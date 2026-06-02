import { FiBarChart2 } from "react-icons/fi";
import { OVERVIEW_CARDS } from "./dashboardData";

export default function OverviewCards() {
  return (
    <section className="overview-grid" aria-label="Account overview">
      {OVERVIEW_CARDS.map(({ label, value, icon: Icon, tone }) => (
        <article className={`metric-card ${tone}`} key={label}>
          <div className="metric-icon"><Icon /></div>
          <p>{label}</p>
          <strong>{value}</strong>
        </article>
      ))}
      <article className="conversion-card">
        <div className="conversion-top">
          <div className="metric-icon"><FiBarChart2 /></div>
          <span>TARGET: 65%</span>
        </div>
        <p>Conversion Rate</p>
        <strong>68<small>%</small></strong>
      </article>
    </section>
  );
}
