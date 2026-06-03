"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/kam/Topbar";
import KamSidebar from "@/components/kam/Sidebar";
import SalesSidebar from "@/components/sales/SalesSidebar";
import LineManagerSidebar from "@/components/line-manager/LineManagerSidebar";
import { fetchDatabase, readCustomers } from "@/lib/database";

function getSidebar(role) {
  if (role === "KAM") return KamSidebar;
  if (role === "Line Manager") return LineManagerSidebar;
  return SalesSidebar;
}

export default function CustomersPage({ session }) {
  const [customers, setCustomers] = useState([]);
  const Sidebar = getSidebar(session.role);

  useEffect(() => {
    fetchDatabase().then((db) => {
      setCustomers(db.apiError ? readCustomers() : db.customers || []);
    });
  }, []);

  return (
    <main className="portal">
      <Sidebar />
      <section className="portal-content">
        <Topbar session={session} />
        <div className="records-body">
          <h1>Active Customer &amp; Profiles</h1>
          <p>Manage and review your active customer</p>
          <div className="records-table-wrap active-customers-wrap">
            <table className="records-table active-customers-table">
              <thead>
                <tr><th>Customer ID</th><th>Account Name</th><th>Current Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {customers.length ? (
                  customers.map((customer) => (
                    <tr key={customer.customerId}>
                      <td>{customer.customerId}</td>
                      <td>{customer.accountName}</td>
                      <td><span className="record-status success">{customer.status}</span></td>
                      <td><button type="button">Open Record &gt;</button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="empty-table-cell" colSpan="4">No active customers yet</td>
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
