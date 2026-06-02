"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import SalesRecordPage from "@/components/sales/record/SalesRecordPage";

export default function RecordPage() {
  return (
    <RoleGuard allowedRole="Sales Coordinator">
      {(session) => <SalesRecordPage session={session} />}
    </RoleGuard>
  );
}
