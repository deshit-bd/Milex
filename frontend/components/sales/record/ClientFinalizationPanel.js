"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiFileText, FiPrinter, FiUploadCloud, FiXCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import {
  CLIENT_FINALIZATION_KEY,
  FINAL_PROFILE_INITIAL,
  LEGAL_DOCUMENTS_INITIAL,
} from "./recordData";

function loadFinalization() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(CLIENT_FINALIZATION_KEY) || "null");
  } catch {
    return null;
  }
}

export default function ClientFinalizationPanel({ record, onStageChange }) {
  const [stage, setStage] = useState("client-decision");
  const [rejectReason, setRejectReason] = useState("");
  const [profile, setProfile] = useState(FINAL_PROFILE_INITIAL);
  const [documents, setDocuments] = useState(LEGAL_DOCUMENTS_INITIAL);

  useEffect(() => {
    const saved = loadFinalization();
    if (!saved) return;
    setStage(saved.stage || "client-decision");
    setRejectReason(saved.rejectReason || "");
    setProfile({ ...FINAL_PROFILE_INITIAL, ...(saved.profile || {}) });
    setDocuments(
      LEGAL_DOCUMENTS_INITIAL.map((item) => ({
        ...item,
        ...(saved.documents || []).find((savedItem) => savedItem.id === item.id),
      }))
    );
    onStageChange?.(saved.stage || "client-decision");
  }, [onStageChange]);

  function persist(nextStage = stage, nextProfile = profile, nextDocuments = documents, nextRejectReason = rejectReason) {
    const payload = {
      identifier: record.identifier,
      accountName: record.accountName,
      stage: nextStage,
      rejectReason: nextRejectReason,
      profile: nextProfile,
      documents: nextDocuments,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CLIENT_FINALIZATION_KEY, JSON.stringify(payload));
    setStage(nextStage);
    onStageChange?.(nextStage);
  }

  function agreeClient() {
    persist("final-profile");
    Swal.fire({ icon: "success", title: "Client agreed", text: "Final account profile can now be completed.", confirmButtonColor: "#078b4d" });
  }

  function rejectOffer() {
    if (!rejectReason.trim()) {
      Swal.fire({ icon: "warning", title: "Reject reason required", confirmButtonColor: "#078b4d" });
      return;
    }
    persist("client-rejected");
    Swal.fire({ icon: "info", title: "Offer rejected", text: "Revision has been triggered for Sales Coordinator.", confirmButtonColor: "#078b4d" });
  }

  function updateProfile(event) {
    const nextProfile = { ...profile, [event.target.name]: event.target.value };
    setProfile(nextProfile);
  }

  function saveProfile() {
    persist("final-profile", profile);
    Swal.fire({ icon: "success", title: "Draft saved", timer: 900, showConfirmButton: false });
  }

  function continueToDocuments(event) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    persist("documents", profile);
  }

  function updateDocument(id, field, value) {
    const nextDocuments = documents.map((document) =>
      document.id === id ? { ...document, [field]: value } : document
    );
    setDocuments(nextDocuments);
    persist(stage, profile, nextDocuments);
  }

  function activateProfile() {
    const missingRequired = documents.filter((document) => document.required && !document.fileName);
    if (missingRequired.length) {
      Swal.fire({
        icon: "warning",
        title: "Required documents missing",
        text: `Please upload: ${missingRequired.map((document) => document.title).join(", ")}`,
        confirmButtonColor: "#078b4d",
      });
      return;
    }
    persist("activated");
    Swal.fire({
      icon: "success",
      title: "Profile activated",
      text: `${record.accountName} is ready for distribution.`,
      confirmButtonColor: "#078b4d",
    });
  }

  if (stage === "client-rejected") {
    return (
      <section className="finalization-card">
        <header><FiXCircle /> <strong>Client Rejected Offer</strong></header>
        <p className="finalization-note">{rejectReason}</p>
      </section>
    );
  }

  if (stage === "documents" || stage === "activated") {
    return (
      <section className="finalization-card documents-panel">
        <header>
          <span><FiFileText /> <strong>Supporting Documentation</strong></span>
          <button type="button" onClick={() => window.print()}><FiPrinter /> Print Profile</button>
        </header>
        <p>Please upload high-resolution PDF or image files for each category. Minimum file size: 10MB.</p>
        <div className="document-grid">
          {documents.map((document) => (
            <article className="document-tile" key={document.id}>
              <FiFileText />
              <strong>{document.title}{document.required && <i> *</i>}</strong>
              <span>{document.fileName || "Pending upload"}</span>
              <input
                aria-label={`${document.title} document number`}
                placeholder="Document number"
                value={document.documentNumber}
                onChange={(event) => updateDocument(document.id, "documentNumber", event.target.value)}
              />
              <input
                aria-label={`${document.title} expiry date`}
                type="date"
                value={document.expiryDate}
                onChange={(event) => updateDocument(document.id, "expiryDate", event.target.value)}
              />
              <label>
                <FiUploadCloud /> Upload File
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => updateDocument(document.id, "fileName", event.target.files[0]?.name || "")} />
              </label>
            </article>
          ))}
        </div>
        <button className="activate-profile" type="button" disabled={stage === "activated"} onClick={activateProfile}>
          {stage === "activated" ? "Profile Activated" : "Activate & Distribute Profile"}
        </button>
      </section>
    );
  }

  if (stage === "final-profile") {
    return (
      <form className="finalization-card profile-panel" onSubmit={continueToDocuments}>
        <header><FiCheckCircle /> <strong>Final Account Profile Data</strong></header>
        <p>Agreement is signed. Complete the final tax and operational details to activate the account.</p>
        <div className="profile-grid">
          <label>Name of Managing Partner<input name="managingPartner" value={profile.managingPartner} onChange={updateProfile} required /></label>
          <label>BIN Number<input name="binNumber" value={profile.binNumber} onChange={updateProfile} required /></label>
          <label>TIN Number<input name="tinNumber" value={profile.tinNumber} onChange={updateProfile} required /></label>
          <label>Destinations<input name="destinations" placeholder="Comma separated" value={profile.destinations} onChange={updateProfile} /></label>
          <label>Preferred Carrier<input name="preferredCarrier" placeholder="DHL, UPS" value={profile.preferredCarrier} onChange={updateProfile} /></label>
          <label>Nature of Business<input name="natureOfBusiness" value={profile.natureOfBusiness} onChange={updateProfile} /></label>
          <label>Account Specifics<input name="accountSpecifics" value={profile.accountSpecifics} onChange={updateProfile} /></label>
          <label>Final Amount Limit (BDT)<input name="finalAmountLimit" value={profile.finalAmountLimit} onChange={updateProfile} /></label>
          <label>Final Time Limit (Days)<input name="finalTimeLimit" value={profile.finalTimeLimit} onChange={updateProfile} /></label>
        </div>
        <div className="finalization-actions">
          <button className="outline-action" type="button" onClick={saveProfile}>Save Draft</button>
          <button className="next-action" type="submit">Next</button>
        </div>
      </form>
    );
  }

  return (
    <section className="finalization-card decision-panel">
      <header><FiCheckCircle /> <strong>Required Action</strong></header>
      <p>1. Action Required: Print Documents</p>
      <div className="print-actions">
        <button type="button" onClick={() => window.print()}><FiPrinter /> Reprint Offer</button>
        <button type="button" onClick={() => Swal.fire({ icon: "success", title: "Agreement printed", timer: 900, showConfirmButton: false })}><FiPrinter /> Print Agreement</button>
      </div>
      <p>2. Customer Signature Status</p>
      <button className="customer-agreed" type="button" onClick={agreeClient}><FiCheckCircle /> Customer Agreed</button>
      <label className="reject-reason">
        If no, enter reason & reject
        <input placeholder="e.g. Rate too high" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} />
      </label>
      <button className="reject-offer" type="button" onClick={rejectOffer}><FiXCircle /> Reject Offer (Trigger R-1)</button>
    </section>
  );
}
