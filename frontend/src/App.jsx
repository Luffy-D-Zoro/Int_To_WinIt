import { useEffect, useRef, useState } from "react";

const STEPS = ["New PIL", "AI Extraction", "Procedural Scrutiny", "Registry Review"];
const COURTS = [
  "Supreme Court of India",
  "High Court of Delhi",
  "High Court of Bombay",
  "High Court of Karnataka",
];

const iconPaths = {
  arrow: <path d="m9 18 6-6-6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  document: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M9 12h6M9 16h6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
  scale: <><path d="M12 3v18M7 21h10M5 6h14" /><path d="m5 6-3 6h6L5 6Zm14 0-3 6h6l-3-6ZM2 12c0 2 1.3 3 3 3s3-1 3-3M16 12c0 2 1.3 3 3 3s3-1 3-3" /></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 14v6h14v-6" /></>,
  warning: <><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5M12 17h.01" /></>,
  x: <path d="m7 7 10 10M17 7 7 17" />,
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

function Header({ health }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#183c67] text-white">
            <Icon name="scale" className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-slate-900 sm:text-base">Public Interest Litigation Portal</p>
            <p className="hidden text-xs text-slate-500 sm:block">AI-assisted filing and registry scrutiny</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className={`h-2 w-2 rounded-full ${health === "ready" ? "bg-emerald-500" : health === "error" ? "bg-rose-500" : "animate-pulse bg-amber-500"}`} />
          <span className="hidden sm:inline">{health === "ready" ? "System online" : health === "error" ? "API unavailable" : "Connecting"}</span>
        </div>
      </div>
    </header>
  );
}

function StepIndicator({ current }) {
  return (
    <nav aria-label="Filing progress" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex min-w-[650px] items-center py-4">
          {STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const complete = stepNumber < current;
            const active = stepNumber === current;
            return (
              <li key={step} className="flex flex-1 items-center last:flex-none">
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${complete ? "border-emerald-600 bg-emerald-600 text-white" : active ? "border-[#183c67] bg-[#183c67] text-white" : "border-slate-300 bg-white text-slate-400"}`}>
                    {complete ? <Icon name="check" className="h-4 w-4" /> : stepNumber}
                  </span>
                  <span className={`whitespace-nowrap text-sm font-medium ${active ? "text-slate-950" : complete ? "text-emerald-700" : "text-slate-400"}`}>{step}</span>
                </div>
                {index < STEPS.length - 1 && <span className={`mx-4 h-px flex-1 ${complete ? "bg-emerald-400" : "bg-slate-200"}`} />}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-7">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#285f99]">{eyebrow}</p>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}

function FileInput({ id, title, description, multiple, files, onFiles, onRemove }) {
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    onFiles(Array.from(fileList || []));
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">{title}</label>
        <span className="text-xs text-slate-400">{multiple ? "Optional · up to 4" : "Required"}</span>
      </div>
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-[#285f99] hover:bg-blue-50/50"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
      >
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#285f99] shadow-sm">
          <Icon name="upload" />
        </span>
        <span className="text-sm font-semibold text-slate-700">Choose PDF{multiple ? " files" : ""} or drag and drop</span>
        <span className="mt-1 text-xs text-slate-500">PDF only · maximum 10 MB per file</span>
      </label>
      <input ref={inputRef} id={id} type="file" accept="application/pdf,.pdf" multiple={multiple} className="sr-only" onChange={(event) => handleFiles(event.target.files)} />
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${file.lastModified}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <Icon name="document" className="h-5 w-5 shrink-0 text-rose-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
              </div>
              <button type="button" onClick={() => onRemove(index)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Remove ${file.name}`}>
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

function Alert({ children, tone = "error" }) {
  const styles = tone === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-blue-200 bg-blue-50 text-blue-800";
  return (
    <div className={`flex gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`} role={tone === "error" ? "alert" : undefined}>
      <Icon name={tone === "error" ? "warning" : "info"} className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

function NewPilScreen({ form, setForm, mainFile, setMainFile, supportingFiles, setSupportingFiles, onAnalyze, loading, error, returned }) {
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  return (
    <>
      <PageHeading eyebrow="PIL filing" title="File New PIL" description="Provide basic filing information and upload the petition. The system will extract document details and perform an initial procedural scrutiny." />
      {returned && <div className="mb-5"><Alert tone="info">The filing was returned for correction. Update the details or documents, then analyze it again before resubmitting.</Alert></div>}
      {error && <div className="mb-5"><Alert>{error}</Alert></div>}
      <form onSubmit={onAnalyze} className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-slate-900">Basic filing details</h2>
            <p className="mt-1 text-sm text-slate-500">These details provide context; the uploaded documents remain the source for AI extraction.</p>
          </div>
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Petitioner name <span className="font-normal text-slate-400">(optional)</span></span>
              <input value={form.petitionerName} onChange={update("petitionerName")} placeholder="Name of petitioner or organization" className="form-control" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Court</span>
              <select value={form.court} onChange={update("court")} className="form-control" required>
                {COURTS.map((court) => <option key={court}>{court}</option>)}
              </select>
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Short description</span>
              <textarea value={form.description} onChange={update("description")} rows="3" placeholder="Briefly describe the public issue raised in this filing" className="form-control resize-y" />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-slate-900">Filing documents</h2>
            <p className="mt-1 text-sm text-slate-500">Documents are processed in memory for this prototype and are not permanently stored.</p>
          </div>
          <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-2">
            <FileInput id="main-petition" title="Main Petition" description="Upload the primary PIL petition as a text-readable PDF." files={mainFile ? [mainFile] : []} onFiles={(files) => setMainFile(files[0] || null)} onRemove={() => setMainFile(null)} />
            <FileInput id="supporting-documents" title="Supporting Documents" description="Add affidavits, annexures, representations, or other supporting PDFs." multiple files={supportingFiles} onFiles={(files) => setSupportingFiles((current) => [...current, ...files].slice(0, 4))} onRemove={(index) => setSupportingFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} />
          </div>
        </section>

        <div className="flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-xs leading-5 text-slate-500">Automated analysis assists administrative review only. It does not determine legal validity, merits, or whether the PIL should succeed.</p>
          <button type="submit" disabled={loading} className="primary-button min-w-44 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <><span className="spinner" />Analyzing filing...</> : <>Analyze Filing<Icon name="arrow" className="h-4 w-4" /></>}
          </button>
        </div>
        {loading && <p className="text-center text-sm font-medium text-[#285f99] sm:text-right">Extracting and analyzing your filing...</p>}
      </form>
    </>
  );
}

function DetailCard({ label, children, wide = false }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-4 ${wide ? "md:col-span-2" : ""}`}>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <div className="text-sm leading-6 text-slate-700">{children || <span className="italic text-slate-400">Not found in uploaded documents</span>}</div>
    </div>
  );
}

function PillList({ values }) {
  if (!values?.length) return null;
  return <div className="flex flex-wrap gap-2">{values.map((value) => <span key={value} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{value}</span>)}</div>;
}

function DocumentsList({ documents }) {
  return (
    <div className="divide-y divide-slate-100">
      {documents.map((document) => (
        <div key={document.filename} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600"><Icon name="document" className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-700">{document.filename}</p>
            <p className="mt-0.5 text-xs text-slate-400">{document.role === "main_petition" ? "Main petition" : "Supporting document"}{document.pageCount ? ` · ${document.pageCount} page${document.pageCount === 1 ? "" : "s"}` : ""} · {formatBytes(document.size)}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">Analyzed</span>
        </div>
      ))}
    </div>
  );
}

function ExtractionScreen({ data, onBack, onContinue }) {
  const extraction = data.extraction;
  return (
    <>
      <PageHeading eyebrow="Document analysis complete" title="AI Extraction" description="Review the extracted details below before moving to procedural scrutiny. Missing information is intentionally left blank rather than inferred." />
      <div className="mb-6"><Alert tone="info">AI-extracted details — review before proceeding. The original filing documents remain authoritative.</Alert></div>
      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard label="Case summary" wide>{extraction.caseSummary}</DetailCard>
        <DetailCard label="Petitioner">{extraction.petitioner.name}</DetailCard>
        <DetailCard label="Respondents">{extraction.respondents.length ? <ul className="space-y-1">{extraction.respondents.map((respondent) => <li key={respondent}>• {respondent}</li>)}</ul> : null}</DetailCard>
        <DetailCard label="Public issue">{extraction.publicIssue}</DetailCard>
        <DetailCard label="Cause of action">{extraction.causeOfAction}</DetailCard>
        <DetailCard label="Public injury or impact">{extraction.publicInjuryOrImpact}</DetailCard>
        <DetailCard label="Prayer / relief">{extraction.prayerOrRelief}</DetailCard>
        <DetailCard label="Important dates" wide>
          {extraction.importantDates.length ? <div className="space-y-3">{extraction.importantDates.map((item, index) => <div key={`${item.date}-${index}`} className="flex gap-3"><Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-[#285f99]" /><div><span className="font-semibold text-slate-800">{item.date}</span> — {item.event}<p className="text-xs text-slate-400">{item.sourceDocument}</p></div></div>)}</div> : null}
        </DetailCard>
        <DetailCard label="Acts / sections mentioned"><PillList values={extraction.actsOrSectionsMentioned} /></DetailCard>
        <DetailCard label="Annexures referenced"><PillList values={extraction.annexuresReferenced} /></DetailCard>
        <DetailCard label="Documents analyzed" wide><DocumentsList documents={data.documents} /></DetailCard>
      </div>
      <PageActions onBack={onBack} backLabel="Back to filing" onContinue={onContinue} continueLabel="View Procedural Scrutiny" />
    </>
  );
}

function PageActions({ onBack, backLabel, onContinue, continueLabel }) {
  return (
    <div className="mt-7 flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
      <button type="button" onClick={onBack} className="secondary-button">{backLabel}</button>
      <button type="button" onClick={onContinue} className="primary-button">{continueLabel}<Icon name="arrow" className="h-4 w-4" /></button>
    </div>
  );
}

const checkStyles = {
  pass: { label: "Passed Checks", icon: "check", iconStyle: "bg-emerald-100 text-emerald-700", heading: "text-emerald-800" },
  warning: { label: "Warnings", icon: "warning", iconStyle: "bg-amber-100 text-amber-700", heading: "text-amber-800" },
  defect: { label: "Defects", icon: "x", iconStyle: "bg-rose-100 text-rose-700", heading: "text-rose-800" },
};

function CheckGroup({ status, checks }) {
  const style = checkStyles[status];
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className={`font-semibold ${style.heading}`}>{style.label}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{checks.length}</span>
      </div>
      <div className="divide-y divide-slate-100 px-5">
        {checks.length ? checks.map((check) => (
          <div key={check.id} className="flex gap-3 py-4">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.iconStyle}`}><Icon name={style.icon} className="h-3.5 w-3.5" /></span>
            <div>
              <p className="text-sm font-semibold text-slate-800">{check.title}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{check.message}</p>
              {check.source && <p className="mt-1.5 text-xs text-slate-400">Source: {check.source}</p>}
            </div>
          </div>
        )) : <p className="py-4 text-sm text-slate-400">None</p>}
      </div>
    </section>
  );
}

function ScrutinySummary({ scrutiny, compact = false }) {
  const ready = scrutiny.overallStatus === "ready_for_registry_review";
  return (
    <div className={`rounded-xl border p-5 ${ready ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ready ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}><Icon name={ready ? "check" : "warning"} /></span>
          <div>
            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${ready ? "text-emerald-700" : "text-rose-700"}`}>Overall procedural status</p>
            <p className={`mt-1 text-lg font-bold tracking-tight ${ready ? "text-emerald-950" : "text-rose-950"}`}>{ready ? "READY FOR REGISTRY REVIEW" : "NEEDS CORRECTION"}</p>
            {!compact && <p className="mt-1 text-sm text-slate-600">{ready ? "No blocking procedural defects were detected." : `${scrutiny.counts.defect} blocking defect${scrutiny.counts.defect === 1 ? " requires" : "s require"} attention before approval.`}</p>}
          </div>
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-emerald-700">{scrutiny.counts.pass} passed</span>
          <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-amber-700">{scrutiny.counts.warning} warnings</span>
          <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-rose-700">{scrutiny.counts.defect} defects</span>
        </div>
      </div>
    </div>
  );
}

function ScrutinyScreen({ data, onBack, onContinue }) {
  const groups = ["pass", "warning", "defect"].map((status) => ({ status, checks: data.scrutiny.checks.filter((check) => check.status === status) }));
  return (
    <>
      <PageHeading eyebrow="Automated scrutiny" title="PIL Procedural Readiness" description="A prototype check of filing completeness based on uploaded documents and AI-extracted information. This is not a judicial or legal determination." />
      <ScrutinySummary scrutiny={data.scrutiny} />
      <div className="mt-6 grid items-start gap-5 lg:grid-cols-3">
        {groups.map((group) => <CheckGroup key={group.status} {...group} />)}
      </div>
      <p className="mt-5 text-xs leading-5 text-slate-500">{data.scrutiny.disclaimer} Warnings do not block this demo workflow; registry staff should review all findings. Defects are clearly carried into registry review.</p>
      <PageActions onBack={onBack} backLabel="Review extraction" onContinue={onContinue} continueLabel="Send to Registry Review" />
    </>
  );
}

function Workflow() {
  const stages = [
    ["Filed", "done"],
    ["Automated Scrutiny", "done"],
    ["Registry Review", "done"],
    ["Preliminary Hearing", "active"],
    ["Notice", "pending"],
    ["Respondent Reply", "pending"],
    ["Further Hearing", "pending"],
    ["Final Order", "pending"],
  ];
  return (
    <section className="rounded-xl border border-emerald-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Registry approved</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">PIL Workflow</h2>
      </div>
      <ol className="grid gap-0 p-5 sm:p-6 md:grid-cols-4 lg:grid-cols-8">
        {stages.map(([label, status], index) => (
          <li key={label} className="relative flex gap-3 pb-5 last:pb-0 md:block md:pb-0 md:text-center">
            {index < stages.length - 1 && <span className={`absolute left-3 top-6 h-[calc(100%-1.5rem)] w-px md:left-[calc(50%+12px)] md:top-3 md:h-px md:w-[calc(100%-24px)] ${status === "done" ? "bg-emerald-500" : "bg-slate-200"}`} />}
            <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 md:mx-auto ${status === "done" ? "border-emerald-600 bg-emerald-600 text-white" : status === "active" ? "border-[#285f99] bg-[#285f99] text-white ring-4 ring-blue-100" : "border-slate-300 bg-white text-slate-300"}`}>
              {status === "done" ? <Icon name="check" className="h-3.5 w-3.5" /> : status === "active" ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
            </span>
            <p className={`pt-0.5 text-xs font-semibold leading-4 md:mt-3 md:px-1 ${status === "done" ? "text-emerald-700" : status === "active" ? "text-[#183c67]" : "text-slate-400"}`}>{label}</p>
          </li>
        ))}
      </ol>
      <div className="border-t border-slate-100 bg-emerald-50/60 px-5 py-4 text-sm text-emerald-900 sm:px-6">The filing has moved to <strong>Preliminary Hearing</strong>. Later stages are shown for workflow demonstration only.</div>
    </section>
  );
}

function RegistryScreen({ data, decision, setDecision, onBack, onEdit }) {
  const issues = data.scrutiny.checks.filter((check) => check.status !== "pass");
  if (decision === "approved") {
    return (
      <>
        <PageHeading eyebrow="Registry action recorded" title="Filing Approved" description="The mock registry review is complete. The filing has advanced to the next procedural stage." />
        <Workflow />
      </>
    );
  }
  if (decision === "returned") {
    return (
      <>
        <PageHeading eyebrow="Registry action recorded" title="Returned for Correction" description="The mock registry has returned this filing so the petitioner can address the identified procedural issues." />
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white"><Icon name="warning" /></span>
            <div><h2 className="font-semibold text-amber-950">Correction requested</h2><p className="mt-1 text-sm leading-6 text-amber-900">Review the warnings and defects, replace or add documents as needed, and run automated scrutiny again before resubmitting.</p></div>
          </div>
          <button type="button" onClick={onEdit} className="secondary-button mt-5 border-amber-300 bg-white text-amber-900 hover:bg-amber-100">Edit filing and documents</button>
        </section>
      </>
    );
  }
  return (
    <>
      <PageHeading eyebrow="Mock registry desk" title="Registry Review" description="Review the extracted case overview, documents, and automated procedural findings before recording a registry action." />
      <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-3 font-semibold text-slate-900">Case summary</h2>
            <p className="text-sm leading-6 text-slate-600">{data.extraction.caseSummary}</p>
            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Petitioner</p><p className="mt-1 text-sm font-medium text-slate-700">{data.extraction.petitioner.name || "Not detected"}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Court</p><p className="mt-1 text-sm font-medium text-slate-700">{data.filing.court || "Not selected"}</p></div>
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="mb-4 font-semibold text-slate-900">Documents ({data.documents.length})</h2><DocumentsList documents={data.documents} /></section>
        </div>
        <div className="space-y-5">
          <ScrutinySummary scrutiny={data.scrutiny} compact />
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Issues for review</h2></div>
            <div className="divide-y divide-slate-100 px-5">{issues.length ? issues.map((check) => <div key={check.id} className="flex gap-3 py-3.5"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${check.status === "defect" ? "bg-rose-500" : "bg-amber-500"}`} /><div><p className="text-sm font-medium text-slate-800">{check.title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{check.message}</p></div></div>) : <p className="py-4 text-sm text-slate-500">No warnings or defects were detected.</p>}</div>
          </section>
        </div>
      </div>
      <div className="mt-7 flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
        <button type="button" onClick={onBack} className="secondary-button">Back to scrutiny</button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => setDecision("returned")} className="secondary-button border-amber-300 text-amber-800 hover:bg-amber-50">Return for Correction</button>
          <button type="button" onClick={() => setDecision("approved")} className="primary-button bg-emerald-700 hover:bg-emerald-800">Approve Filing<Icon name="check" className="h-4 w-4" /></button>
        </div>
      </div>
    </>
  );
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFiles(mainFile, supportingFiles) {
  if (!mainFile) return "Please upload the main PIL petition PDF.";
  const files = [mainFile, ...supportingFiles];
  if (files.length > 5) return "Upload no more than 5 PDF files.";
  const unsupported = files.find((file) => file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"));
  if (unsupported) return `${unsupported.name} is not a PDF. Upload PDF files only.`;
  const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
  if (oversized) return `${oversized.name} is larger than the 10 MB limit.`;
  return null;
}

function App() {
  const [health, setHealth] = useState("checking");
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({ petitionerName: "", description: "", court: COURTS[0] });
  const [mainFile, setMainFile] = useState(null);
  const [supportingFiles, setSupportingFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [decision, setDecision] = useState(null);
  const [returned, setReturned] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => setHealth(data.status === "ok" ? "ready" : "error"))
      .catch(() => setHealth("error"));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage, decision]);

  async function handleAnalyze(event) {
    event.preventDefault();
    const validationError = validateFiles(mainFile, supportingFiles);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    const body = new FormData();
    body.append("mainPetition", mainFile);
    supportingFiles.forEach((file) => body.append("supportingDocuments", file));
    Object.entries(form).forEach(([key, value]) => body.append(key, value));

    try {
      const response = await fetch("/api/pil/analyze", { method: "POST", body });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.message || "The filing could not be analyzed. Please try again.");
      setAnalysis(payload);
      setDecision(null);
      setReturned(false);
      setStage(2);
    } catch (requestError) {
      setError(requestError.message || "The filing could not be analyzed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function editReturnedFiling() {
    setDecision(null);
    setReturned(true);
    setStage(1);
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-950">
      <Header health={health} />
      <StepIndicator current={stage} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {stage === 1 && <NewPilScreen form={form} setForm={setForm} mainFile={mainFile} setMainFile={setMainFile} supportingFiles={supportingFiles} setSupportingFiles={setSupportingFiles} onAnalyze={handleAnalyze} loading={loading} error={error} returned={returned} />}
        {stage === 2 && analysis && <ExtractionScreen data={analysis} onBack={() => setStage(1)} onContinue={() => setStage(3)} />}
        {stage === 3 && analysis && <ScrutinyScreen data={analysis} onBack={() => setStage(2)} onContinue={() => setStage(4)} />}
        {stage === 4 && analysis && <RegistryScreen data={analysis} decision={decision} setDecision={setDecision} onBack={() => setStage(3)} onEdit={editReturnedFiling} />}
      </main>
      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>PIL Filing & Scrutiny Prototype</span><span>Procedural assistance only · No legal determination</span></div>
      </footer>
    </div>
  );
}

export default App;
