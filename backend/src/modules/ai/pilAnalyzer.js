import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.6-flash";

const nullableString = {
  type: ["string", "null"],
};

const pilExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "petitioner",
    "respondents",
    "caseSummary",
    "publicIssue",
    "causeOfAction",
    "publicInjuryOrImpact",
    "prayerOrRelief",
    "personalInterestDisclosure",
    "importantDates",
    "actsOrSectionsMentioned",
    "annexuresReferenced",
    "apparentAffidavitPresent",
    "inconsistencies",
  ],
  properties: {
    petitioner: {
      type: "object",
      additionalProperties: false,
      required: ["name", "detailsFound"],
      properties: {
        name: nullableString,
        detailsFound: { type: "boolean" },
      },
    },
    respondents: {
      type: "array",
      items: { type: "string" },
    },
    caseSummary: { type: "string" },
    publicIssue: nullableString,
    causeOfAction: nullableString,
    publicInjuryOrImpact: nullableString,
    prayerOrRelief: nullableString,
    personalInterestDisclosure: nullableString,
    importantDates: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["date", "event", "sourceDocument"],
        properties: {
          date: { type: "string" },
          event: { type: "string" },
          sourceDocument: { type: "string" },
        },
      },
    },
    actsOrSectionsMentioned: {
      type: "array",
      items: { type: "string" },
    },
    annexuresReferenced: {
      type: "array",
      items: { type: "string" },
    },
    apparentAffidavitPresent: { type: "boolean" },
    inconsistencies: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "description", "source"],
        properties: {
          type: { type: "string" },
          description: { type: "string" },
          source: nullableString,
        },
      },
    },
  },
};

function asNullableString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asStringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];
}

function normalizeExtraction(value, submittedPetitionerName) {
  const petitionerName = asNullableString(value?.petitioner?.name) || submittedPetitionerName || null;

  return {
    petitioner: {
      name: petitionerName,
      detailsFound: Boolean(value?.petitioner?.detailsFound || petitionerName),
    },
    respondents: asStringArray(value?.respondents),
    caseSummary: asNullableString(value?.caseSummary) || "No case summary could be extracted.",
    publicIssue: asNullableString(value?.publicIssue),
    causeOfAction: asNullableString(value?.causeOfAction),
    publicInjuryOrImpact: asNullableString(value?.publicInjuryOrImpact),
    prayerOrRelief: asNullableString(value?.prayerOrRelief),
    personalInterestDisclosure: asNullableString(value?.personalInterestDisclosure),
    importantDates: Array.isArray(value?.importantDates)
      ? value.importantDates
          .filter((item) => item && item.date && item.event)
          .map((item) => ({
            date: String(item.date),
            event: String(item.event),
            sourceDocument: asNullableString(item.sourceDocument) || "Uploaded filing",
          }))
      : [],
    actsOrSectionsMentioned: asStringArray(value?.actsOrSectionsMentioned),
    annexuresReferenced: asStringArray(value?.annexuresReferenced),
    apparentAffidavitPresent: Boolean(value?.apparentAffidavitPresent),
    inconsistencies: Array.isArray(value?.inconsistencies)
      ? value.inconsistencies
          .filter((item) => item && item.description)
          .map((item) => ({
            type: asNullableString(item.type) || "inconsistency",
            description: String(item.description),
            source: asNullableString(item.source),
          }))
      : [],
  };
}

export async function analyzePilDocuments({ combinedText, form }) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error(
      "Gemini is not configured. Add GEMINI_API_KEY to the backend environment and try again.",
    );
    error.code = "GEMINI_KEY_MISSING";
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You assist court registry staff with administrative review of Public Interest Litigation filings.

Extract only information explicitly supported by the uploaded documents below. Do not invent missing facts. Use null or empty arrays when information is absent. If wording is uncertain, describe only the supported uncertainty. Do not decide legal merits, recommend judgment, or determine whether the PIL should succeed. This is procedural assistance only.

Submitted form context (not evidence from the PDFs):
- Petitioner name: ${form.petitionerName || "Not supplied"}
- Short description: ${form.description || "Not supplied"}
- Selected court: ${form.court || "Not supplied"}

Uploaded documents:
${combinedText}`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: pilExtractionSchema,
        temperature: 0.1,
      },
    });
  } catch (cause) {
    const error = new Error("Gemini could not analyze the filing. Please try again.");
    error.code = "GEMINI_API_ERROR";
    error.cause = cause;
    throw error;
  }

  try {
    const parsed = JSON.parse(response.text);
    return normalizeExtraction(parsed, asNullableString(form.petitionerName));
  } catch (cause) {
    const error = new Error("Gemini returned an unreadable analysis. Please try again.");
    error.code = "GEMINI_RESPONSE_INVALID";
    error.cause = cause;
    throw error;
  }
}
