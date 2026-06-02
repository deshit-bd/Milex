"use client";

import { useState } from "react";
import { FiCheckCircle, FiDownload, FiXCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import { LINE_MANAGER_APPROVAL_KEY, RATE_ACTION_KEY } from "@/components/sales/record/recordData";

export default function LineManagerActionBox({ record }) {
  const [note, setNote] = useState("");
  const rateAction = typeof window !== "undefined" ? JSON.parse(localStorage.getItem(RATE_ACTION_KEY) || "{}") : {};
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

  function decide(status) {
    localStorage.setItem(LINE_MANAGER_APPROVAL_KEY, JSON.stringify({ identifier: record.identifier, status, note, decidedAt: new Date().toISOString() }));
    Swal.fire({
      icon: status === "Approved" ? "success" : "info",
      title: status === "Approved" ? "Rate approved" : "Revision requested",
      text: status === "Approved" ? "Sales Coordinator can now prepare the offer letter." : "The file has been returned for revision.",
      confirmButtonColor: "#078b4d",
    });
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
