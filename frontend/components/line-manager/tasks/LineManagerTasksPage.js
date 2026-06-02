import Topbar from "@/components/kam/Topbar";
import LineManagerSidebar from "../LineManagerSidebar";
import LineManagerRecordsTable from "./LineManagerRecordsTable";

export default function LineManagerTasksPage({ session }) {
  return (
    <main className="portal">
      <LineManagerSidebar />
      <section className="portal-content">
        <Topbar session={session} />
        <div className="records-body">
          <h1>Database Records</h1>
          <p>Manage and review your active task queue</p>
          <LineManagerRecordsTable />
        </div>
      </section>
    </main>
  );
}
