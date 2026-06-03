"use client";

import { useEffect, useState } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { OVERVIEW_CARDS } from "./dashboardData";
import { fetchDatabase, getDashboardStats } from "@/lib/database";

export default function OverviewCards() {
  const [stats, setStats] = useState({ activeAccounts: 0, pipelineAccounts: 0, yourQueue: 0, conversionRate: 0 });

  useEffect(() => {
    fetchDatabase().then((db) => {
      setStats(getDashboardStats(db.records || []));
    });
  }, []);

  const cards = OVERVIEW_CARDS.map((card) => {
    if (card.label === "Active Accounts") return { ...card, value: stats.activeAccounts };
    if (card.label === "Pipeline Accounts") return { ...card, value: stats.pipelineAccounts };
    if (card.label === "Your Queue") return { ...card, value: stats.yourQueue };
    return card;
  });

  return (
    <section className="overview-grid" aria-label="Account overview">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <article className={`metric-card ${tone}`} key={label}>
          <div className="metric-icon"><Icon /></div>
          <p>{label}</p>
          <strong>{value}</strong>
        </article>
      ))}
      <article className="conversion-card">
        <div className="conversion-top">
          <div className="metric-icon"><FiBarChart2 /></div>
          <span>TARGET: 65%</span>
        </div>
        <p>Conversion Rate</p>
        <strong>{stats.conversionRate}<small>%</small></strong>
      </article>
    </section>
  );
}
