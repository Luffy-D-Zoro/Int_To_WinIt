import express from "express";

const app = express();
const port = Number(process.env.PORT || 3001);

app.disable("x-powered-by");
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend API listening on port ${port}`);
});