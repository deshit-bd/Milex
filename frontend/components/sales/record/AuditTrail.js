import { FiClock } from "react-icons/fi";

function getActiveStep(finalizationStage, offerDelivered) {
  if (finalizationStage === "activated") return ["PROFILE ACTIVATED", "Customer profile distributed"];
  if (finalizationStage === "documents") return ["CLIENT FINAL DATA UPDATE", "Waiting for legal documents"];
  if (finalizationStage === "final-profile") return ["FINAL ACCOUNT PROFILE", "Waiting for account profile data"];
  if (finalizationStage === "client-rejected") return ["OFFER REJECTED", "Revision required"];
  if (offerDelivered) return ["OFFER DELIVERED", "Waiting for client agreement"];
  return ["PENDING OFFER LETTER", "Waiting for SC Offer letter"];
}

export default function AuditTrail({ approved = false, finalizationStage = "", offerDelivered = false }) {
  const [activeTitle, activeDescription] = getActiveStep(finalizationStage, offerDelivered);

  return (
    <section className="audit-card">
      <h2><FiClock /> Process Audit Trail</h2>
      {approved ? (
        <>
          <div className="audit-item active"><i /><strong>{activeTitle}</strong><p>{activeDescription}</p></div>
          {offerDelivered && <div className="audit-item"><i /><strong>OFFER LETTER / AGREEMENT GENERATED</strong><p>Ready for client signature</p></div>}
          <div className="audit-item"><i /><strong>RATE APPROVED BY LM</strong><p>Oct 24, 2023 - 09:41 AM</p></div>
          <div className="audit-item"><i /><strong>RATE PREPARATION BY SC</strong><p>Oct 24, 2023 - 09:41 AM</p></div>
        </>
      ) : (
        <div className="audit-item active"><i /><strong>PENDING RATE PREPARATION</strong><p>Waiting for Pricing Team</p></div>
      )}
      <div className="audit-item"><i /><strong>RECOMMENDATION FORM<br />CREATED BY KAM</strong><p>Oct 24, 2023 - 09:41 AM</p></div>
    </section>
  );
}
