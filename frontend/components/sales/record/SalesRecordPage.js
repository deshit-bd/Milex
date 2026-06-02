"use client";

import { useEffect, useState } from "react";
import { FiTag } from "react-icons/fi";
import Topbar from "@/components/kam/Topbar";
import SalesSidebar from "../SalesSidebar";
import AccountInfo from "./AccountInfo";
import AuditTrail from "./AuditTrail";
import RateActionBox from "./RateActionBox";
import ApprovedOfferActions from "./ApprovedOfferActions";
import ClientFinalizationPanel from "./ClientFinalizationPanel";
import { CLIENT_FINALIZATION_KEY, LINE_MANAGER_APPROVAL_KEY, OFFER_DOCUMENT_KEY, SAMPLE_RECORD_DETAIL } from "./recordData";

function getApprovedStatus(finalizationStage, offerDelivered) {
  if (finalizationStage === "activated") return "PROFILE ACTIVATED";
  if (finalizationStage === "documents") return "CLIENT FINAL DATA UPDATE";
  if (finalizationStage === "final-profile") return "OFFER DELIVERED (PENDING AGREEMENT)";
  if (finalizationStage === "client-rejected") return "OFFER REJECTED (REVISION REQUIRED)";
  if (offerDelivered) return "OFFER DELIVERED (PENDING AGREEMENT)";
  return "APPROVED (PENDING OFFER LETTER)";
}

export default function SalesRecordPage({ session }) {
  const [record, setRecord] = useState(SAMPLE_RECORD_DETAIL);
  const [approved, setApproved] = useState(false);
  const [offerDelivered, setOfferDelivered] = useState(false);
  const [finalizationStage, setFinalizationStage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector(".record-body")?.scrollTo(0, 0);
    const selected = localStorage.getItem("milex.sales.selected-record");
    const submitted = localStorage.getItem("milex.kam.recommendation.submitted");
    const approval = localStorage.getItem(LINE_MANAGER_APPROVAL_KEY);
    const offerDocument = localStorage.getItem(OFFER_DOCUMENT_KEY);
    const finalization = localStorage.getItem(CLIENT_FINALIZATION_KEY);
    setApproved(Boolean(approval && JSON.parse(approval).status === "Approved"));
    setOfferDelivered(Boolean(offerDocument));
    setFinalizationStage(finalization ? JSON.parse(finalization).stage : "");
    if (!selected) return;
    const selectedRecord = JSON.parse(selected);
    const submittedRecord = submitted ? JSON.parse(submitted) : null;
    setRecord((current) => ({
      ...current,
      identifier: selectedRecord.identifier,
      accountName: selectedRecord.accountName,
      address: submittedRecord?.primaryAddress || current.address,
      businessType: submittedRecord?.businessType || current.businessType,
      mobile: submittedRecord?.mobileNumber || current.mobile,
      email: submittedRecord?.emailAddress || current.email,
      recommendationNote: submittedRecord?.recommendationNote || current.recommendationNote,
    }));
  }, []);

  function handleDocumentGenerated() {
    setOfferDelivered(true);
  }

  return (
    <main className="portal">
      <SalesSidebar />
      <section className="portal-content">
        <Topbar session={session} />
        <div className="record-body">
          <section className="record-hero">
            <div>
              <h1>{record.accountName}</h1>
              <span><FiTag /> {record.identifier}</span>
              {approved && <span className="rate-reference"><FiTag /> REF-{record.identifier}</span>}
            </div>
            <strong>{approved ? getApprovedStatus(finalizationStage, offerDelivered) : "PENDING RATE PREPARATION"}</strong>
          </section>
          <div className="record-layout">
            <div>
              <AccountInfo record={record} />
              {approved && offerDelivered && finalizationStage && finalizationStage !== "client-decision" && (
                <ClientFinalizationPanel
                  record={record}
                  onStageChange={setFinalizationStage}
                />
              )}
            </div>
            <aside>
              {approved && offerDelivered && (!finalizationStage || finalizationStage === "client-decision") ? (
                <ClientFinalizationPanel
                  record={record}
                  onStageChange={setFinalizationStage}
                />
              ) : approved ? (
                <ApprovedOfferActions record={record} onDocumentGenerated={handleDocumentGenerated} />
              ) : (
                <RateActionBox record={record} />
              )}
              <AuditTrail approved={approved} finalizationStage={finalizationStage} offerDelivered={offerDelivered} />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
