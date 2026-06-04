"use client";

import { useState } from "react";
import { FiCheckCircle, FiFileText, FiMail } from "react-icons/fi";
import Swal from "sweetalert2";
import OfferLetterPreview from "./OfferLetterPreview";
import { updateRecordStatusOnServer } from "@/lib/database";

export default function ApprovedOfferActions({ record, offerSent = false, onDocumentGenerated }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const effectiveOfferSent =
    offerSent ||
    Boolean(record.offerDocument) ||
    (record.status || "").includes("OFFER DELIVERED") ||
    (record.status || "").includes("CLIENT ACCEPTED") ||
    Boolean(record.finalization);

  async function generateOfferLetter() {
    const payload = {
      identifier: record.identifier,
      accountName: record.accountName,
      type: "Offer Letter",
      status: "Offer Delivered",
      clientAccepted: false,
      generatedAt: new Date().toISOString(),
    };
    await updateRecordStatusOnServer(record.identifier, "OFFER DELIVERED (PENDING AGREEMENT)", "warning", {
      accountName: record.accountName,
      revision: "New",
      offerDocument: payload,
    });
    onDocumentGenerated?.(payload);
    setPreviewOpen(true);
  }

  async function generateAgreement() {
    const payload = {
      ...(record.offerDocument || {}),
      identifier: record.identifier,
      accountName: record.accountName,
      agreementGenerated: true,
      agreementGeneratedAt: new Date().toISOString(),
    };
    await updateRecordStatusOnServer(record.identifier, "OFFER DELIVERED (PENDING AGREEMENT)", "warning", {
      accountName: record.accountName,
      revision: "New",
      offerDocument: payload,
    });
    onDocumentGenerated?.(payload);
    Swal.fire({
      icon: "success",
      title: "Agreement generated",
      text: "The agreement is ready for printing and client signature.",
      confirmButtonColor: "#078b4d",
    });
  }

  return (
    <>
      <section className="approved-action-box">
        {!effectiveOfferSent ? (
          <>
            <p>RATE APPROVED BY LM. PREPARE OFFICIAL LETTERHEAD.</p>
            <div>
              <button type="button" onClick={generateOfferLetter}><FiMail /> Generate &amp; Email<br />Offer Letter</button>
              <button type="button" onClick={generateAgreement}><FiFileText /> Generate<br />Agreement</button>
            </div>
          </>
        ) : (
          <>
            <p>OFFER DELIVERED. KAM WILL COLLECT CUSTOMER SIGNATURE &amp; AGREEMENT.</p>
            <div className="handoff-note">
              <FiCheckCircle />
              <span>Record is now available in KAM Task Queue &amp; Record.</span>
            </div>
          </>
        )}
      </section>
      {previewOpen && <OfferLetterPreview record={record} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}
