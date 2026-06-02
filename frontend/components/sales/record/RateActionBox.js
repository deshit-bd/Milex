"use client";

import { useState } from "react";
import { FiArrowRight, FiPaperclip } from "react-icons/fi";
import Swal from "sweetalert2";
import { RATE_ACTION_KEY } from "./recordData";

export default function RateActionBox({ record }) {
  const [rate, setRate] = useState("");
  const [fileName, setFileName] = useState("");

  function generateRate() {
    setRate("$5.00/Kg + $25");
  }

  function forward() {
    if (!rate) {
      Swal.fire({ icon: "warning", title: "Generate a rate first", confirmButtonColor: "#078b4d" });
      return;
    }
    const payload = {
      identifier: record.identifier,
      accountName: record.accountName,
      rate,
      attachment: fileName,
      status: "Forwarded to Line Manager",
    };
    localStorage.setItem(RATE_ACTION_KEY, JSON.stringify(payload));
    Swal.fire({ icon: "success", title: "Forwarded to Line Manager", timer: 1200, showConfirmButton: false });
  }

  return (
    <section className="rate-action-box">
      <label>RATE REFERENCE NUMBER<input value={`REF-${record.identifier}`} readOnly /></label>
      <label>SYSTEM COMPUTED RATE MATRIX
        <div className="rate-input"><input placeholder="ex: $5.00/Kg + $25" value={rate} onChange={(event) => setRate(event.target.value)} /><button type="button" onClick={generateRate}>Generate Rate</button></div>
      </label>
      <label>SUPPORTING DOCUMENTS
        <span className="attachment-input"><FiPaperclip /> {fileName || "Attach Excel Calculations"}<input type="file" accept=".xls,.xlsx,.csv" onChange={(event) => setFileName(event.target.files[0]?.name || "")} /></span>
      </label>
      <button className="forward-action" type="button" onClick={forward}>Forward to Line Manager <FiArrowRight /></button>
    </section>
  );
}
