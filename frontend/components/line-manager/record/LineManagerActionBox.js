"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiDownload, FiXCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import { updateRecordStatusOnServer } from "@/lib/database";

export default function LineManagerActionBox({ record, onDecision }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const rateAction = record.rateAction || {};
  const rateReference = `REF-${rateAction.identifier || record.identifier}`;

  function downloadRate() {
    const file = new Blob([`Rate Reference: ${rateReference}\nRate: ${rateAction.rate || "Pending"}`], { type: "text/plain" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${rateReference}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function decide(status) {
    if (status === "Revision Requested" && !note.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Revision note required",
        text: "Please write what Sales needs to revise.",
        confirmButtonColor: "#078b4d",
      });
      return;
    }

    const decision = { identifier: record.identifier, status, note, decidedAt: new Date().toISOString() };
    await updateRecordStatusOnServer(
      record.identifier,
      status === "Approved" ? "APPROVED (PENDING OFFER LETTER)" : "REVISION REQUESTED BY LM",
      "warning",
      {
        accountName: record.accountName,
        revision: status === "Approved" ? "New" : "R-1",
        revisionNote: status === "Revision Requested" ? note : "",
        lineManagerDecision: status,
        lineManagerDecidedAt: decision.decidedAt,
        lineManagerApproval: decision,
      }
    );
    onDecision?.(decision);
    Swal.fire({
      icon: status === "Approved" ? "success" : "info",
      title: status === "Approved" ? "Rate approved" : "Revision requested",
      text: status === "Approved" ? "Sales Coordinator can now prepare the offer letter." : "The file has been returned for revision.",
      confirmButtonColor: "#078b4d",
    }).then(() => router.replace("/line-manager/dashboard"));
  }

  return (
    <section className="lm-action-box">
      <h2>Required Action</h2>
      <div className="attached-rate">
        <span>ATTACHED RATE FORM</span>
        <strong>{rateReference}</strong>
        <button type="button" onClick={downloadRate}><FiDownload /> Download Excel to Verify</button>
      </div>
      <label>NOTE<textarea placeholder="Notes..." value={note} onChange={(event) => setNote(event.target.value)} /></label>
      <div className="lm-decision-actions">
        <button type="button" onClick={() => decide("Approved")}><FiCheckCircle /> Approve</button>
        <button type="button" onClick={() => decide("Revision Requested")}><FiXCircle /> Revision</button>
      </div>
    </section>
  );
}
