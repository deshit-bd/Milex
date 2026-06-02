"use client";

import { useState } from "react";
import { FiArrowRight, FiMail } from "react-icons/fi";
import Swal from "sweetalert2";
import { OFFER_DOCUMENT_KEY } from "./recordData";
import OfferLetterPreview from "./OfferLetterPreview";

export default function ApprovedOfferActions({ record, onDocumentGenerated }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  function generateDocument(type) {
    const payload = {
      identifier: record.identifier,
      accountName: record.accountName,
      type,
      status: "Generated",
      generatedAt: new Date().toISOString(),
    };
    localStorage.setItem(OFFER_DOCUMENT_KEY, JSON.stringify(payload));
    onDocumentGenerated?.(type);
    if (type === "Offer Letter") {
      setPreviewOpen(true);
      return;
    }
    Swal.fire({
      icon: "success",
      title: `${type} generated`,
      text: `${type} is ready for ${record.accountName}.`,
      confirmButtonColor: "#078b4d",
    });
  }

  return (
    <>
      <section className="approved-action-box">
        <p>RATE APPROVED BY LM. PREPARE OFFICIAL LETTERHEAD.</p>
        <div>
          <button type="button" onClick={() => generateDocument("Offer Letter")}><FiMail /> Generate &amp; Email<br />Offer Letter</button>
          <button type="button" onClick={() => generateDocument("Agreement")}>Generate Agreement <FiArrowRight /></button>
        </div>
      </section>
      {previewOpen && <OfferLetterPreview record={record} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}
