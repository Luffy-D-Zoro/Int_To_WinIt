import { spawn } from "node:child_process";

const commands = [
  ["backend", ["run", "dev", "--prefix", "backend"]],
  ["frontend", ["run", "dev", "--prefix", "frontend"]],
];

const children = commands.map(([name, args]) => {
  const child = spawn("npm", args, {
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (code && code !== 0) {
      console.error(`${name} stopped with exit code ${code}.`);
      stopChildren(child);
      process.exitCode = code;
    } else if (signal) {
      stopChildren(child);
    }
  });

  return child;
});

function stopChildren(exitedChild) {
  for (const child of children) {
    if (child !== exitedChild && !child.killed) {
      child.kill("SIGTERM");
    }
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    stopChildren();
    process.exit(0);
  });
}