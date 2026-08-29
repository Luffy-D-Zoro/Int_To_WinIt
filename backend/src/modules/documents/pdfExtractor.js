import { PDFParse } from "pdf-parse";

export async function extractPdf(file) {
  const parser = new PDFParse({ data: file.buffer });

  try {
    const result = await parser.getText();
    const text = result.text?.trim();

    if (!text) {
      throw new Error("No readable text was found. The PDF may be scanned or image-only.");
    }

    return {
      filename: file.originalname,
      text,
      pageCount: result.total || result.pages?.length || null,
      size: file.size,
    };
  } catch (error) {
    throw new Error(`Could not extract text from ${file.originalname}: ${error.message}`);
  } finally {
    await parser.destroy().catch(() => {});
  }
}

export async function extractPdfs(files) {
  return Promise.all(files.map(extractPdf));
}

export function combineDocumentText(documents) {
  return documents
    .map(
      (document, index) =>
        `\n===== DOCUMENT ${index + 1}: ${document.filename} =====\n${document.text}\n===== END DOCUMENT: ${document.filename} =====`,
    )
    .join("\n");
}
