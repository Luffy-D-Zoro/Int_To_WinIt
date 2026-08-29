import { Router } from "express";
import multer from "multer";
import { analyzePilDocuments } from "../ai/pilAnalyzer.js";
import { combineDocumentText, extractPdfs } from "../documents/pdfExtractor.js";
import { scrutinizePil } from "../scrutiny/pilRules.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_request, file, callback) => {
    if (file.mimetype !== "application/pdf" || !file.originalname.toLowerCase().endsWith(".pdf")) {
      const error = new Error(`${file.originalname} is not a PDF. Upload PDF files only.`);
      error.code = "UNSUPPORTED_FILE_TYPE";
      callback(error);
      return;
    }
    callback(null, true);
  },
});

const uploadFields = upload.fields([
  { name: "mainPetition", maxCount: 1 },
  { name: "supportingDocuments", maxCount: 4 },
]);

router.post("/analyze", (request, response, next) => {
  uploadFields(request, response, async (uploadError) => {
    if (uploadError) {
      next(uploadError);
      return;
    }

    const mainPetition = request.files?.mainPetition?.[0];
    const supportingDocuments = request.files?.supportingDocuments || [];

    if (!mainPetition) {
      response.status(400).json({
        error: "MAIN_PETITION_REQUIRED",
        message: "Upload one main PIL petition PDF before analyzing the filing.",
      });
      return;
    }

    const files = [mainPetition, ...supportingDocuments];
    const form = {
      petitionerName: request.body.petitionerName?.trim() || "",
      description: request.body.description?.trim() || "",
      court: request.body.court?.trim() || "",
    };

    try {
      const documents = await extractPdfs(files);
      const extraction = await analyzePilDocuments({
        combinedText: combineDocumentText(documents),
        form,
      });
      const scrutiny = scrutinizePil({
        extraction,
        documents,
        hasMainPetition: true,
      });

      response.json({
        filing: form,
        extraction,
        documents: documents.map(({ filename, pageCount, size }, index) => ({
          filename,
          pageCount,
          size,
          role: index === 0 ? "main_petition" : "supporting_document",
        })),
        scrutiny,
      });
    } catch (error) {
      next(error);
    }
  });
});

export default router;
