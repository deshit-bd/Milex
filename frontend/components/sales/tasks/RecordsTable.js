"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSalesRecordsFromServer } from "@/lib/workflow";

export default function RecordsTable() {
  const router = useRouter();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getSalesRecordsFromServer().then((serverRecords) => {
      setRecords(serverRecords);
    });
  }, []);

  function openRecord(record) {
    router.push(`/sales/tasks/${record.identifier}`);
  }

  return (
    <div className="records-table-wrap">
      <table className="records-table">
        <thead>
          <tr><th>Identifier</th><th>Account Name</th><th>Current Status</th><th>Revision</th><th>Action</th></tr>
        </thead>
        <tbody>
          {records.length ? (
            records.map((record) => (
              <tr key={record.identifier}>
                <td>{record.identifier}</td>
                <td>{record.accountName}</td>
                <td><span className={`record-status ${record.tone}`}>{record.status}</span></td>
                <td>{record.revision}</td>
                <td><button type="button" onClick={() => openRecord(record)}>Open Record &gt;</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="empty-table-cell" colSpan="5">No records yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
