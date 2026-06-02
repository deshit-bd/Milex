"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import LineManagerRecordPlaceholder from "@/components/line-manager/LineManagerRecordPlaceholder";

export default function LineManagerTaskPage() {
  return (
    <RoleGuard allowedRole="Line Manager">
      {(session) => <LineManagerRecordPlaceholder session={session} />}
    </RoleGuard>
  );
}
