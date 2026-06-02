"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RATE_ACTION_KEY } from "@/components/sales/record/recordData";
import { LINE_MANAGER_RECORDS } from "../lineManagerData";

export default function LineManagerRecordsTable() {
  const router = useRouter();
  const [records, setRecords] = useState(LINE_MANAGER_RECORDS);

  useEffect(() => {
    const forwardedRate = localStorage.getItem(RATE_ACTION_KEY);
    if (!forwardedRate) return;
    const parsedRate = JSON.parse(forwardedRate);
    if (!parsedRate.accountName) return;
    setRecords((current) =>
      current.map((record, index) =>
        index === 2
          ? {
              ...record,
              identifier: parsedRate.identifier,
              accountName: parsedRate.accountName || record.accountName,
            }
          : record
      )
    );
  }, []);

  function openRecord(record) {
    localStorage.setItem("milex.line-manager.selected-record", JSON.stringify(record));
    router.push(`/line-manager/tasks/${record.identifier}`);
  }

  return (
    <div className="records-table-wrap">
      <table className="records-table">
        <thead>
          <tr><th>Identifier</th><th>Account Name</th><th>Current Status</th><th>Revision</th><th>Action</th></tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.identifier}>
              <td>{record.identifier}</td>
              <td>{record.accountName}</td>
              <td><span className={`record-status ${record.tone}`}>{record.status}</span></td>
              <td>{record.revision}</td>
              <td><button type="button" onClick={() => openRecord(record)}>Open Record ›</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
