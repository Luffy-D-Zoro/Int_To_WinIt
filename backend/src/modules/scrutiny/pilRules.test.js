import assert from "node:assert/strict";
import test from "node:test";
import { scrutinizePil } from "./pilRules.js";

const completeExtraction = {
  petitioner: { name: "Asha Rao", detailsFound: true },
  respondents: ["State of Example"],
  caseSummary: "A public infrastructure filing.",
  publicIssue: "Unsafe public infrastructure",
  causeOfAction: "A representation received no response.",
  publicInjuryOrImpact: "The issue affects residents across the district.",
  prayerOrRelief: "Direct the authority to inspect the infrastructure.",
  personalInterestDisclosure: "The petitioner has no personal interest.",
  importantDates: [],
  actsOrSectionsMentioned: [],
  annexuresReferenced: ["Annexure P-1"],
  apparentAffidavitPresent: true,
  inconsistencies: [],
};

const documents = [
  {
    filename: "main-petition.pdf",
    text: "Public interest petition referring to Annexure P-1.",
  },
  {
    filename: "Annexure-P1.pdf",
    text: "Supporting representation.",
  },
];

test("marks a procedurally complete prototype filing ready for registry review", () => {
  const scrutiny = scrutinizePil({
    extraction: completeExtraction,
    documents,
    hasMainPetition: true,
  });

  assert.equal(scrutiny.overallStatus, "ready_for_registry_review");
  assert.equal(scrutiny.counts.defect, 0);
  assert.ok(scrutiny.checks.every((check) => check.status === "pass"));
});

test("marks missing core fields and unmatched annexures as defects", () => {
  const scrutiny = scrutinizePil({
    extraction: {
      ...completeExtraction,
      petitioner: { name: null, detailsFound: false },
      respondents: [],
      causeOfAction: null,
      prayerOrRelief: null,
      annexuresReferenced: ["Annexure P-7"],
    },
    documents,
    hasMainPetition: true,
  });

  assert.equal(scrutiny.overallStatus, "needs_correction");
  assert.ok(scrutiny.counts.defect >= 5);
  assert.equal(scrutiny.checks.find((check) => check.id === "annexures").status, "defect");
});
