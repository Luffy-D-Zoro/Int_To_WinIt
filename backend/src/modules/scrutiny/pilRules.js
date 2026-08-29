const result = (id, title, status, message, source = null) => ({
  id,
  title,
  status,
  message,
  source,
});

function normalizeReference(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findMissingAnnexures(references, documents) {
  const documentEvidence = documents
    .slice(1)
    .map((document) => `${document.filename} ${document.text.slice(0, 4000)}`)
    .join(" ")
    .toLowerCase();

  return references.filter((reference) => {
    const normalized = normalizeReference(reference);
    const candidates = [normalized, normalized.replace(/^annexure/, ""), normalized.replace(/^annex/, "")]
      .filter((candidate) => candidate.length >= 2);

    return !candidates.some((candidate) => normalizeReference(documentEvidence).includes(candidate));
  });
}

function describesMissingAnnexure(inconsistency, missingAnnexures) {
  const inconsistencyText = normalizeReference(`${inconsistency.type} ${inconsistency.description}`);

  return inconsistencyText.includes("annexure")
    && missingAnnexures.some((reference) => {
      const normalized = normalizeReference(reference);
      const identifier = normalized.replace(/^annexure/, "").replace(/^annex/, "");

      return identifier.length >= 2 && inconsistencyText.includes(identifier);
    });
}

export function scrutinizePil({ extraction, documents, hasMainPetition }) {
  const checks = [];

  checks.push(
    hasMainPetition
      ? result("main-petition", "Main petition document", "pass", "A main PIL petition PDF was uploaded.", documents[0]?.filename)
      : result("main-petition", "Main petition document", "defect", "A main PIL petition PDF is required."),
  );

  checks.push(
    extraction.petitioner.detailsFound
      ? result("petitioner", "Petitioner details", "pass", `Petitioner identified as ${extraction.petitioner.name || "named in the filing"}.`, "AI extraction and filing form")
      : result("petitioner", "Petitioner details", "defect", "Petitioner information was not detected.", "Uploaded documents"),
  );

  checks.push(
    extraction.respondents.length
      ? result("respondents", "Respondents", "pass", `${extraction.respondents.length} respondent${extraction.respondents.length === 1 ? " was" : "s were"} identified.`, "AI extraction")
      : result("respondents", "Respondents", "defect", "No respondent was identified in the filing.", "Uploaded documents"),
  );

  checks.push(
    extraction.causeOfAction
      ? result("cause", "Cause of action", "pass", "A cause of action appears to be described.", "AI extraction")
      : result("cause", "Cause of action", "defect", "The cause of action was not clearly detected.", "Uploaded documents"),
  );

  checks.push(
    extraction.publicIssue && extraction.publicInjuryOrImpact
      ? result("public-impact", "Public issue and impact", "pass", "The filing describes a public issue and its stated impact.", "AI extraction")
      : result("public-impact", "Public issue and impact", "warning", "The public issue or wider public impact is not clearly explained.", "Uploaded documents"),
  );

  checks.push(
    extraction.prayerOrRelief
      ? result("prayer", "Prayer or relief", "pass", "Requested relief appears in the filing.", "AI extraction")
      : result("prayer", "Prayer or relief", "defect", "A prayer or requested relief was not detected.", "Uploaded documents"),
  );

  checks.push(
    extraction.personalInterestDisclosure
      ? result("interest-disclosure", "Personal-interest disclosure", "pass", "A personal-interest disclosure appears in the filing.", "AI extraction")
      : result("interest-disclosure", "Personal-interest disclosure", "warning", "A personal-interest disclosure was not clearly detected.", "Uploaded documents"),
  );

  checks.push(
    extraction.apparentAffidavitPresent
      ? result("affidavit", "Supporting affidavit", "pass", "A supporting affidavit appears to be present.", "AI extraction")
      : result("affidavit", "Supporting affidavit", "warning", "A supporting affidavit was not clearly detected.", "Uploaded documents"),
  );

  const missingAnnexures = findMissingAnnexures(extraction.annexuresReferenced, documents);
  if (!extraction.annexuresReferenced.length) {
    checks.push(result("annexures", "Referenced annexures", "warning", "No annexure references were detected.", "AI extraction"));
  } else if (missingAnnexures.length) {
    checks.push(
      result(
        "annexures",
        "Referenced annexures",
        "warning",
        `Referenced annexure${missingAnnexures.length === 1 ? "" : "s"} not matched to the uploads: ${missingAnnexures.join(", ")}.`,
        "Uploaded filenames and document text",
      ),
    );
  } else {
    checks.push(result("annexures", "Referenced annexures", "pass", "Detected annexure references could be matched to the uploaded material.", "Uploaded filenames and document text"));
  }

  const inconsistencies = extraction.inconsistencies.filter(
    (inconsistency) => !describesMissingAnnexure(inconsistency, missingAnnexures),
  );

  if (inconsistencies.length) {
    inconsistencies.forEach((inconsistency, index) => {
      checks.push(
        result(
          `inconsistency-${index + 1}`,
          `Possible ${inconsistency.type}`,
          "warning",
          inconsistency.description,
          inconsistency.source,
        ),
      );
    });
  } else {
    checks.push(result("inconsistencies", "Internal consistency", "pass", "No apparent name or date conflicts were surfaced by the automated review.", "AI extraction"));
  }

  const counts = checks.reduce(
    (totals, check) => ({ ...totals, [check.status]: totals[check.status] + 1 }),
    { pass: 0, warning: 0, defect: 0 },
  );

  return {
    overallStatus: counts.defect ? "needs_correction" : "ready_for_registry_review",
    checks,
    counts,
    disclaimer: "Automated scrutiny supports procedural review only and is not a determination of legal validity or merits.",
  };
}
