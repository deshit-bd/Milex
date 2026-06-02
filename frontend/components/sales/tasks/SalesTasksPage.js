import Topbar from "@/components/kam/Topbar";
import SalesSidebar from "../SalesSidebar";
import RecordsTable from "./RecordsTable";

export default function SalesTasksPage({ session }) {
  return (
    <main className="portal">
      <SalesSidebar />
      <section className="portal-content">
        <Topbar session={session} />
        <div className="records-body">
          <h1>Database Records</h1>
          <p>Manage and review your active task queue</p>
          <RecordsTable />
        </div>
      </section>
    </main>
  );
}
