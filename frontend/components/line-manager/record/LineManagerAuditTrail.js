import { FiClock } from "react-icons/fi";

export default function LineManagerAuditTrail() {
  return (
    <section className="audit-card">
      <h2><FiClock /> Process Audit Trail</h2>
      <div className="audit-item active"><i /><strong>PENDING RATE APPROVAL</strong><p>Waiting for Line Manager Approval</p></div>
      <div className="audit-item"><i /><strong>PENDING RATE PREPARATION</strong><p>Oct 24, 2023 - 09:41 AM</p></div>
      <div className="audit-item"><i /><strong>RECOMMENDATION FORM<br />CREATED BY KAM</strong><p>Oct 24, 2023 - 09:41 AM</p></div>
    </section>
  );
}
