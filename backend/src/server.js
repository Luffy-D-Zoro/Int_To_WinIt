import express from "express";
import multer from "multer";
import pilRoutes from "./modules/cases/pilRoutes.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.disable("x-powered-by");
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/pil", pilRoutes);

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "Each PDF must be 10 MB or smaller.",
      LIMIT_FILE_COUNT: "Upload no more than 5 PDF files.",
      LIMIT_UNEXPECTED_FILE: "Upload one main petition and up to 4 supporting PDFs.",
    };
    response.status(400).json({
      error: error.code,
      message: messages[error.code] || "The uploaded files could not be accepted.",
    });
    return;
  }

  const status = error.code === "UNSUPPORTED_FILE_TYPE"
    ? 400
    : error.code === "GEMINI_KEY_MISSING"
      ? 503
      : error.code?.startsWith("GEMINI_")
        ? 502
        : 422;
  if (status >= 500 && error.code !== "GEMINI_KEY_MISSING") {
    console.error(error.cause || error);
  }
  response.status(status).json({
    error: error.code || "PIL_ANALYSIS_FAILED",
    message: error.message || "The filing could not be analyzed.",
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend API listening on port ${port}`);
});
