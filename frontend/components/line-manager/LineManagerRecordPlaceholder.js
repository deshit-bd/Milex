"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiTag, FiXCircle } from "react-icons/fi";
import Topbar from "@/components/kam/Topbar";
import AccountInfo from "@/components/sales/record/AccountInfo";
import { SAMPLE_RECORD_DETAIL } from "@/components/sales/record/recordData";
import { fetchDatabase } from "@/lib/database";
import LineManagerSidebar from "./LineManagerSidebar";
import LineManagerActionBox from "./record/LineManagerActionBox";
import LineManagerAuditTrail from "./record/LineManagerAuditTrail";

function DecisionSummary({ decision }) {
  const approved = decision?.status === "Approved";

  return (
    <section className={`decision-summary ${approved ? "approved" : "revision"}`}>
      <div className="forwarded-status-icon">
        {approved ? <FiCheckCircle /> : <FiXCircle />}
      </div>
      <h2>{approved ? "Rate Approved" : "Revision Requested"}</h2>
      <p>
        {approved
          ? "Sales Coordinator can now prepare the offer letter."
          : "The file has been returned to Sales Coordinator for rate revision."}
      </p>
      {decision?.note && (
        <div className="forwarded-reference">
          <span>LINE MANAGER NOTE</span>
          <p>{decision.note}</p>
        </div>
      )}
    </section>
  );
}

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

export default function LineManagerRecordPlaceholder({ session, recordId }) {
  const [record, setRecord] = useState(SAMPLE_RECORD_DETAIL);
  const [decision, setDecision] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector(".record-body")?.scrollTo(0, 0);
    async function loadRecord() {
      const db = await fetchDatabase();
      const dbRecord = (db.records || []).find((item) => item.identifier === recordId) || {};
      setRecord(buildRecordDetail(dbRecord));
      setDecision(dbRecord.status === "PENDING LM APPROVAL" ? null : dbRecord.lineManagerApproval || null);
    }
    loadRecord();
  }, [recordId]);

  return (
    <main className="portal">
      <LineManagerSidebar />
      <section className="portal-content">
        <Topbar session={session} />
        <div className="record-body">
          <section className="record-hero">
            <div><h1>{record.accountName}</h1><span><FiTag /> {record.identifier}</span><span className="rate-reference"><FiTag /> REF-{record.identifier}</span></div>
            <strong>{decision?.status === "Approved" ? "APPROVED BY LM" : decision?.status === "Revision Requested" ? "REVISION REQUESTED" : "PENDING RATE APPROVAL"}</strong>
          </section>
          <div className="record-layout">
            <div><AccountInfo record={record} /></div>
            <aside>
              {decision ? <DecisionSummary decision={decision} /> : <LineManagerActionBox record={record} onDecision={setDecision} />}
              <LineManagerAuditTrail decision={decision} />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
