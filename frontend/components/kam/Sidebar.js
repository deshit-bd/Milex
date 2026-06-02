"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./dashboardData";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <img className="sidebar-logo" src="/milex-logo.svg" alt="MileX" />
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
          <Link className={`nav-item ${pathname === href ? "active" : ""}`} href={href} key={label}>
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
