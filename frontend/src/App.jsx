import { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState({ state: "checking", message: "Checking API..." });

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("The API returned an error.");
        }
        return response.json();
      })
      .then((data) => {
        setHealth({
          state: data.status === "ok" ? "ready" : "error",
          message: data.status === "ok" ? "Backend connected" : "Unexpected API response",
        });
      })
      .catch(() => {
        setHealth({ state: "error", message: "Backend unavailable" });
      });
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7fb] text-slate-950">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-7 sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <header className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20">
              JW
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-800">
              Judicial Workflow Automation
            </span>
          </div>
          <span className="hidden rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-500 sm:block">
            Initial project skeleton
          </span>
        </header>

        <section className="relative flex flex-1 items-center py-16">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                <span className="h-px w-8 bg-indigo-600" />
                Ready to build
              </p>
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl">
                A clear foundation for better workflows.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                The project is set up with a lightweight React frontend and Express backend, ready for the next step.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
                  React + Vite
                </span>
                <span className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
                  Node + Express
                </span>
                <span className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
                  Tailwind CSS
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-white bg-white/80 p-2 shadow-2xl shadow-slate-300/40 backdrop-blur">
              <div className="rounded-[1.35rem] bg-slate-950 p-7 text-white sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    System status
                  </span>
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        health.state === "ready"
                          ? "bg-emerald-400"
                          : health.state === "error"
                            ? "bg-rose-400"
                            : "animate-pulse bg-amber-400"
                      }`}
                    />
                    {health.message}
                  </span>
                </div>
                <div className="mt-12">
                  <p className="text-4xl font-semibold tracking-tight">Start small.</p>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                    Your frontend and backend are connected through a simple health endpoint.
                  </p>
                </div>
                <div className="mt-12 border-t border-white/10 pt-5 font-mono text-xs text-slate-500">
                  GET <span className="text-indigo-300">/api/health</span>
                  <span className="float-right text-emerald-300">200 OK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative flex items-center justify-between border-t border-slate-200/80 pt-5 text-xs text-slate-400">
          <span>Minimal foundation · No external services configured</span>
          <span className="hidden sm:block">Port 5000 · API 3001</span>
        </footer>
      </div>
    </main>
  );
}

export default App;