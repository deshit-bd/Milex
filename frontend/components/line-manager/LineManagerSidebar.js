"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINE_MANAGER_NAV_ITEMS } from "./lineManagerData";

export default function LineManagerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <img className="sidebar-logo" src="/milex-logo.svg" alt="MileX" />
      <nav className="sidebar-nav" aria-label="Line Manager navigation">
        {LINE_MANAGER_NAV_ITEMS.map(({ label, icon: Icon, href }) => (
          <Link className={`nav-item ${pathname === href ? "active" : ""}`} href={href} key={label}>
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
