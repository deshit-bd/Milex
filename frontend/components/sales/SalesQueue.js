"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiClock } from "react-icons/fi";
import Swal from "sweetalert2";
import { fetchDatabase, readRecords } from "@/lib/database";

const SUBMITTED_KEY = "milex.kam.recommendation.submitted";
const SALES_QUEUE_KEY = "milex.sales.queue";

export default function SalesQueue() {
  const router = useRouter();
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function loadQueue() {
      const db = await fetchDatabase();
      const storedQueue = localStorage.getItem(SALES_QUEUE_KEY);
      const submission = localStorage.getItem(SUBMITTED_KEY);
      const records = db.apiError ? readRecords() : db.records || [];
      const pendingRecord = records.find((record) =>
        ["PENDING RATE PREPARATION", "REVISION REQUESTED BY LM", "CLIENT FINAL DATA UPDATE", "FINAL PROFILE DATA"].includes(record.status)
      );
      if (pendingRecord) {
        setItem({
          accountName: pendingRecord.accountName,
          customerCode: pendingRecord.identifier,
          revision: pendingRecord.revision,
          queueStatus: pendingRecord.status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()),
        });
        return;
      }
      if (db.apiError && storedQueue) {
        setItem(JSON.parse(storedQueue));
        return;
      }
      if (db.apiError && submission) {
        const parsed = JSON.parse(submission);
        setItem({
          accountName: parsed.accountName || "",
          customerCode: parsed.identifier,
          queueStatus: "Pending Rate Preparation",
        });
      }
    }
    loadQueue();
  }, []);

  async function processFile() {
    if (!item) return;
    const updated = { ...item, queueStatus: "Rate Preparation In Progress" };
    setItem(updated);
    Swal.fire({
      icon: "success",
      title: "File processing started",
      text: `${updated.accountName} is now being prepared.`,
      timer: 1200,
      showConfirmButton: false,
    }).then(() => router.push(`/sales/tasks/${updated.customerCode}`));
  }

  return (
    <section className="queue-card sales-queue">
      <header>
        <div><FiClock /><strong>Action Required Queue</strong></div>
        <button type="button">View All</button>
      </header>
      {item ? (
        <article className="sales-queue-item">
          <div>
            <h2>{item.accountName}</h2>
            <div className="queue-tags">
              <span>{item.customerCode}</span>
              <strong><i className="status-dot" /> {item.queueStatus}</strong>
            </div>
          </div>
          <button type="button" onClick={processFile}>Process File</button>
        </article>
      ) : (
        <p>No tasks pending for your role</p>
      )}
    </section>
  );
}
