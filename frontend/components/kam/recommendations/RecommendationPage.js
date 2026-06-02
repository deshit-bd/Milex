import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import RecommendationForm from "./RecommendationForm";
import RegistryCard from "./RegistryCard";

export default function RecommendationPage({ session }) {
  return (
    <main className="portal">
      <Sidebar />
      <section className="portal-content">
        <Topbar session={session} />
        <div className="recommendation-body">
          <RecommendationForm />
          <RegistryCard />
        </div>
      </section>
    </main>
  );
}
