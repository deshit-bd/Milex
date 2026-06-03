"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiClock } from "react-icons/fi";
import { RATE_ACTION_KEY } from "@/components/sales/record/recordData";
import { fetchDatabase, readRecords } from "@/lib/database";

export default function LineManagerQueue() {
  const router = useRouter();
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function loadQueue() {
      const db = await fetchDatabase();
      const records = db.apiError ? readRecords() : db.records || [];
      const pendingRecord = records.find(
        (record) => record.status === "PENDING LM APPROVAL" || record.status === "PENDING RATE APPROVAL"
      );
      if (pendingRecord) {
        setItem({
          identifier: pendingRecord.identifier,
          accountName: pendingRecord.accountName,
          queueStatus: "Pending Rate Approval",
        });
        return;
      }
      if (!db.apiError) return;
      const forwardedRate = localStorage.getItem(RATE_ACTION_KEY);
      if (!forwardedRate) return;
      const parsedRate = JSON.parse(forwardedRate);
      if (!parsedRate.accountName) return;
      setItem({
        identifier: parsedRate.identifier,
        accountName: parsedRate.accountName || "",
        queueStatus: "Pending Rate Approval",
      });
    }
    loadQueue();
  }, []);

  function processFile() {
    if (!item) return;
    router.push(`/line-manager/tasks/${item.identifier}`);
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
              <span>{item.identifier}</span>
              <strong className="lm-status"><i className="status-dot" /> {item.queueStatus}</strong>
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
