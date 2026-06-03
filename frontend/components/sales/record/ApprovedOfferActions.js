"use client";

import { useState } from "react";
import { FiCheckCircle, FiMail, FiXCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import OfferLetterPreview from "./OfferLetterPreview";
import { updateRecordStatusOnServer } from "@/lib/database";

export default function ApprovedOfferActions({ record, offerSent = false, onDocumentGenerated, onCustomerAccepted }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
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

  async function acceptOffer() {
    const payload = {
      identifier: record.identifier,
      accountName: record.accountName,
      type: "Offer Letter",
      status: "Client Accepted Offer",
      clientAccepted: true,
      acceptedAt: new Date().toISOString(),
    };
    await updateRecordStatusOnServer(record.identifier, "CLIENT ACCEPTED OFFER (PENDING AGREEMENT)", "warning", {
      accountName: record.accountName,
      revision: "New",
      offerDocument: payload,
    });
    onCustomerAccepted?.(payload);
    Swal.fire({
      icon: "success",
      title: "Customer accepted offer",
      text: "Agreement can now be prepared.",
      confirmButtonColor: "#078b4d",
    });
  }

  async function rejectOffer() {
    if (!rejectReason.trim()) {
      Swal.fire({ icon: "warning", title: "Reject reason required", confirmButtonColor: "#078b4d" });
      return;
    }
    await updateRecordStatusOnServer(record.identifier, "OFFER REJECTED (REVISION REQUIRED)", "danger", {
      accountName: record.accountName,
      revision: "R-1",
      offerRejectReason: rejectReason,
    });
    Swal.fire({ icon: "info", title: "Offer rejected", text: "Revision has been triggered.", confirmButtonColor: "#078b4d" });
  }

  return (
    <>
      <section className="approved-action-box">
        {!effectiveOfferSent ? (
          <>
            <p>RATE APPROVED BY LM. PREPARE OFFICIAL LETTERHEAD.</p>
            <div>
              <button type="button" onClick={generateOfferLetter}><FiMail /> Generate &amp; Email<br />Offer Letter</button>
            </div>
          </>
        ) : (
          <>
            <p>OFFER DELIVERED. WAITING FOR CUSTOMER RESPONSE.</p>
            <button className="customer-agreed" type="button" onClick={acceptOffer}><FiCheckCircle /> Mark Customer Accepted Offer</button>
            <label className="reject-reason">
              If no, enter reason & reject
              <input placeholder="e.g. Rate too high" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} />
            </label>
            <button className="reject-offer" type="button" onClick={rejectOffer}><FiXCircle /> Reject Offer (Trigger R-1)</button>
          </>
        )}
      </section>
      {previewOpen && <OfferLetterPreview record={record} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}
