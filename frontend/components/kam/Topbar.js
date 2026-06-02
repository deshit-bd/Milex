"use client";

import { useState } from "react";
import { FiBell, FiHelpCircle, FiLogOut, FiSearch, FiSettings } from "react-icons/fi";
import { logout } from "@/lib/auth";

export default function Topbar({ session }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="search-box">
        <FiSearch />
        <input type="search" placeholder="Search accounts, leads, or proposals..." />
      </div>
      <div className="topbar-actions">
        <button type="button" aria-label="Help"><FiHelpCircle /></button>
        <button type="button" aria-label="Notifications"><FiBell /><i /></button>
        <button type="button" aria-label="Settings"><FiSettings /></button>
        <div className="profile-wrap">
          <button className="avatar-button" type="button" aria-label="Open profile menu" onClick={() => setProfileOpen((open) => !open)}>KH</button>
          {profileOpen && (
            <div className="profile-menu">
              <strong>{session.role}</strong>
              <small>{session.email}</small>
              <button type="button" onClick={logout}><FiLogOut /> Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
