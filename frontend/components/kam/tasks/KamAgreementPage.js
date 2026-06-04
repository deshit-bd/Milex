"use client";

import { useEffect, useState } from "react";
import { FiTag } from "react-icons/fi";
import Sidebar from "@/components/kam/Sidebar";
import Topbar from "@/components/kam/Topbar";
import AccountInfo from "@/components/sales/record/AccountInfo";
import ClientFinalizationPanel from "@/components/sales/record/ClientFinalizationPanel";
import AuditTrail from "@/components/sales/record/AuditTrail";
import { fetchDatabase } from "@/lib/database";
import { SAMPLE_RECORD_DETAIL } from "@/components/sales/record/recordData";

function buildRecordDetail(record = {}) {
  const submitted = record.recommendation || record;
  const base = { ...SAMPLE_RECORD_DETAIL, ...record };

  return {
    ...base,
    identifier: record.identifier || "",
    accountName: submitted.accountName || record.accountName || "",
    address: submitted.primaryAddress || record.address || "",
    businessType: submitted.businessType || record.businessType || "",
    mobile: submitted.mobileNumber || record.mobile || "",
    email: submitted.emailAddress || record.email || "",
    requestedLimit: submitted.creditLimit
      ? `TK ${submitted.creditLimit}${submitted.creditPeriod ? ` (${submitted.creditPeriod} Days)` : ""}`
      : record.requestedLimit || "",
    seniorContact: {
      name: submitted.seniorName || record.seniorContact?.name || "",
      phone: submitted.seniorMobile || record.seniorContact?.phone || "",
      email: submitted.seniorEmail || record.seniorContact?.email || "",
    },
    keyContact: {
      name: submitted.keyName || record.keyContact?.name || "",
      phone: submitted.keyMobile || record.keyContact?.phone || "",
      email: submitted.keyEmail || record.keyContact?.email || "",
    },
    financialContact: {
      name: submitted.financialName || record.financialContact?.name || "",
      phone: submitted.financialMobile || record.financialContact?.phone || "",
      email: submitted.financialEmail || record.financialContact?.email || "",
    },
    recommendationNote: submitted.recommendationNote || record.recommendationNote || "",
  };
}

function getStatus(stage, status) {
  if (stage === "activated") return "ACTIVE & DISTRIBUTED";
  if (stage === "documents") return "CLIENT FINAL DATA UPDATE";
  if (stage === "final-profile") return "PENDING_PROFILE";
  if (stage === "client-rejected") return "OFFER REJECTED (REVISION REQUIRED)";
  return status || "OFFER DELIVERED (PENDING AGREEMENT)";
}

export default function KamAgreementPage({ session, recordId }) {
  const [record, setRecord] = useState(SAMPLE_RECORD_DETAIL);
  const [finalizationStage, setFinalizationStage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector(".record-body")?.scrollTo(0, 0);
    fetchDatabase().then((db) => {
      const currentRecord = (db.records || []).find((item) => item.identifier === recordId) || {};
      setRecord(buildRecordDetail(currentRecord));
      setFinalizationStage(currentRecord.finalization?.stage || "client-decision");
    });
  }, [recordId]);

  function handleFinalizationChange(finalization) {
    setRecord((current) => ({ ...current, finalization, status: getStatus(finalization.stage, current.status) }));
  }

  return (
    <main className="portal">
      <Sidebar />
      <section className="portal-content">
        <Topbar session={session} />
        <div className="record-body">
          <section className="record-hero">
            <div>
              <h1>{record.accountName}</h1>
              <span><FiTag /> {record.identifier}</span>
              <span className="rate-reference"><FiTag /> REF-{record.identifier}</span>
            </div>
            <strong>{getStatus(finalizationStage, record.status)}</strong>
          </section>
          <div className="record-layout">
            <div>
              <AccountInfo record={record} />
              {finalizationStage !== "client-decision" && (
                <ClientFinalizationPanel
                  record={record}
                  onStageChange={setFinalizationStage}
                  onFinalizationChange={handleFinalizationChange}
                />
              )}
            </div>
            <aside>
              {finalizationStage === "client-decision" && (
                <ClientFinalizationPanel
                  record={record}
                  onStageChange={setFinalizationStage}
                  onFinalizationChange={handleFinalizationChange}
                />
              )}
              <AuditTrail
                approved
                rateForwarded
                offerDelivered
                finalizationStage={finalizationStage}
              />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
