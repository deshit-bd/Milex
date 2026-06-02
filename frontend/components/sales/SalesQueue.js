"use client";

import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import Swal from "sweetalert2";
import { SAMPLE_QUEUE_ITEM } from "./salesData";

const SUBMITTED_KEY = "milex.kam.recommendation.submitted";
const SALES_QUEUE_KEY = "milex.sales.queue";

export default function SalesQueue() {
  const [item, setItem] = useState(SAMPLE_QUEUE_ITEM);

  useEffect(() => {
    const storedQueue = localStorage.getItem(SALES_QUEUE_KEY);
    const submission = localStorage.getItem(SUBMITTED_KEY);
    if (storedQueue) {
      setItem(JSON.parse(storedQueue));
      return;
    }
    if (submission) {
      const parsed = JSON.parse(submission);
      setItem({
        accountName: parsed.accountName || SAMPLE_QUEUE_ITEM.accountName,
        customerCode: "MLX25DHK001",
        queueStatus: "Pending Rate Preparation",
      });
    }
  }, []);

  function processFile() {
    const updated = { ...item, queueStatus: "Rate Preparation In Progress" };
    localStorage.setItem(SALES_QUEUE_KEY, JSON.stringify(updated));
    setItem(updated);
    Swal.fire({
      icon: "success",
      title: "File processing started",
      text: `${updated.accountName} is now being prepared.`,
      timer: 1200,
      showConfirmButton: false,
    });
  }

  return (
    <section className="queue-card sales-queue">
      <header>
        <div><FiClock /><strong>Action Required Queue</strong></div>
        <button type="button">View All</button>
      </header>
      <article className="sales-queue-item">
        <div>
          <h2>{item.accountName}</h2>
          <div className="queue-tags">
            <span>{item.customerCode}</span>
            <strong>● {item.queueStatus}</strong>
          </div>
        </div>
        <button type="button" onClick={processFile}>Process File</button>
      </article>
    </section>
  );
}
