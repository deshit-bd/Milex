import { FiBarChart2, FiBriefcase, FiPrinter } from "react-icons/fi";

function ContactRow({ label, contact }) {
  return (
    <div className="account-contact-row">
      <strong>{label}</strong>
      <span>{contact.name}</span>
      <small>{contact.phone}<br />{contact.email}</small>
    </div>
  );
}

export default function AccountInfo({ record }) {
  return (
    <>
      <section className="account-info-card">
        <header>
          <h2><FiBriefcase /> Initial Account Info</h2>
          <button type="button" onClick={() => window.print()}><FiPrinter /> Print Form</button>
        </header>
        <div className="account-info-grid">
          <div><strong>ADDRESS</strong><p>{record.address}</p></div>
          <div><strong>BUSINESS TYPE</strong><p>{record.businessType}</p></div>
          <div><strong>MOBILE / EMAIL</strong><p>{record.mobile}<br />{record.email}</p></div>
          <div><strong>REQ. LIMITS</strong><p>{record.requestedLimit}</p></div>
        </div>
        <strong className="contacts-label">PRIMARY CONTACTS</strong>
        <div className="account-contacts">
          <ContactRow label="KEY CONTACT PERSON" contact={record.keyContact} />
          <ContactRow label="FINANCIAL CONTACT" contact={record.financialContact} />
        </div>
        <div className="kam-note">
          <strong>KAM RECOMMENDATION NOTE</strong>
          <p>{record.recommendationNote}</p>
        </div>
      </section>
      <section className="history-card">
        <strong><FiBarChart2 /></strong>
        <h2>Historical Volume Data</h2>
        <p>Volume charts will populate after initial rate approval.</p>
      </section>
    </>
  );
}
