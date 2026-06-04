"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/kam/Sidebar";
import Topbar from "@/components/kam/Topbar";
import { fetchDatabase } from "@/lib/database";

function isKamTask(record) {
  return [
    "OFFER DELIVERED (PENDING AGREEMENT)",
    "CLIENT ACCEPTED OFFER (PENDING AGREEMENT)",
    "PENDING_PROFILE",
    "FINAL PROFILE DATA",
    "CLIENT FINAL DATA UPDATE",
  ].includes(record.status);
}

export default function KamTasksPage({ session }) {
  const router = useRouter();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchDatabase().then((db) => {
      setRecords((db.records || []).filter(isKamTask));
    });
  }, []);

  return (
    <main className="portal">
      <Sidebar />
      <section className="portal-content">
        <Topbar session={session} />
        <div className="records-body">
          <h1>Task Queue &amp; Record</h1>
          <p>Customer offer delivery, agreement upload, and profile setup tasks.</p>
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
                      <td><span className={`record-status ${record.tone || "warning"}`}>{record.status}</span></td>
                      <td>{record.revision || "New"}</td>
                      <td><button type="button" onClick={() => router.push(`/kam/tasks/${record.identifier}`)}>Open Record &gt;</button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="empty-table-cell" colSpan="5">No KAM tasks pending</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
