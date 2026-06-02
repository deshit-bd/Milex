import { FiClock } from "react-icons/fi";

export default function ActionQueue() {
  return (
    <section className="queue-card">
      <header>
        <div><FiClock /><strong>Action Required Queue</strong></div>
        <button type="button">View All</button>
      </header>
      <p>No tasks pending for your role</p>
    </section>
  );
}
