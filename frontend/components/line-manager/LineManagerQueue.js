"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiClock } from "react-icons/fi";
import { RATE_ACTION_KEY } from "@/components/sales/record/recordData";
import { SAMPLE_LINE_MANAGER_QUEUE } from "./lineManagerData";

export default function LineManagerQueue() {
  const router = useRouter();
  const [item, setItem] = useState(SAMPLE_LINE_MANAGER_QUEUE);

  useEffect(() => {
    const forwardedRate = localStorage.getItem(RATE_ACTION_KEY);
    if (!forwardedRate) return;
    const parsedRate = JSON.parse(forwardedRate);
    if (!parsedRate.accountName) return;
    setItem({
      identifier: parsedRate.identifier,
      accountName: parsedRate.accountName || SAMPLE_LINE_MANAGER_QUEUE.accountName,
      queueStatus: "Pending Rate Approval",
    });
  }, []);

  function processFile() {
    localStorage.setItem("milex.line-manager.selected-record", JSON.stringify(item));
    router.push(`/line-manager/tasks/${item.identifier}`);
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
            <span>{item.identifier}</span>
            <strong className="lm-status">● {item.queueStatus}</strong>
          </div>
        </div>
        <button type="button" onClick={processFile}>Process File</button>
      </article>
    </section>
  );
}
