"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiUser } from "react-icons/fi";

export default function RegistryCard() {
  const [createdDate, setCreatedDate] = useState("");

  useEffect(() => {
    setCreatedDate(
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date())
    );
  }, []);

  return (
    <aside className="registry-card">
      <div className="registry-title">
        <h2>System Registry</h2>
        <span>Status: Draft</span>
      </div>
      <p>CUSTOMER CODE</p>
      <strong>MLX25DHK001</strong>
      <div className="registry-divider" />
      <p>SCANNABLE IDENTITY</p>
      <div className="barcode" aria-label="Barcode MLX25DHK001" />
      <div className="registry-divider" />
      <p>CREATED BY</p>
      <div className="registry-meta"><FiUser /> <span>KAM User</span></div>
      <p>CREATED DATE</p>
      <div className="registry-meta"><FiCalendar /> <span>{createdDate}</span></div>
    </aside>
  );
}
