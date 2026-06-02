"use client";

import { useEffect, useState } from "react";
import { FiTag } from "react-icons/fi";
import Topbar from "@/components/kam/Topbar";
import AccountInfo from "@/components/sales/record/AccountInfo";
import { SAMPLE_RECORD_DETAIL } from "@/components/sales/record/recordData";
import LineManagerSidebar from "./LineManagerSidebar";
import LineManagerActionBox from "./record/LineManagerActionBox";
import LineManagerAuditTrail from "./record/LineManagerAuditTrail";

export default function LineManagerRecordPlaceholder({ session }) {
  const [record, setRecord] = useState(SAMPLE_RECORD_DETAIL);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector(".record-body")?.scrollTo(0, 0);
    const selected = localStorage.getItem("milex.line-manager.selected-record");
    const submitted = localStorage.getItem("milex.kam.recommendation.submitted");
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

  return (
    <main className="portal">
      <LineManagerSidebar />
      <section className="portal-content">
        <Topbar session={session} />
        <div className="record-body">
          <section className="record-hero">
            <div><h1>{record.accountName}</h1><span><FiTag /> {record.identifier}</span><span className="rate-reference"><FiTag /> REF-{record.identifier}</span></div>
            <strong>PENDING RATE APPROVAL</strong>
          </section>
          <div className="record-layout">
            <div><AccountInfo record={record} /></div>
            <aside><LineManagerActionBox record={record} /><LineManagerAuditTrail /></aside>
          </div>
        </div>
      </section>
    </main>
  );
}
