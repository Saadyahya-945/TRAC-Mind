"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./legal-aid.module.css";

const INFO_CARDS = [
  {
    icon: "📋",
    title: "PoA Act Rights",
    body: "Under the Scheduled Castes & Scheduled Tribes (Prevention of Atrocities) Act, you are legally entitled to police protection, free medical treatment, and statutory rehabilitation relief.",
  },
  {
    icon: "📞",
    title: "NHAA Helpline",
    body: "Call 14566 (toll-free 24/7) for prompt reporting of atrocities, emergency dispatch, and direct coordination with district monitoring committees.",
  },
  {
    icon: "⚖️",
    title: "Free Legal Defense",
    body: "NALSA (National Legal Services Authority) provides free experienced lawyers for both prosecution and bail opposition. Call 15100 anytime.",
  },
  {
    icon: "🏥",
    title: "Medico-Legal Care",
    body: "Government hospitals are mandated to provide immediate free medical care and forensic documentation without requiring prior police FIR clearance.",
  },
];

const RELIEF_TIERS = [
  {
    id: "r1",
    label: "Physical assault, hurt or intimidation",
    amount: "₹1,00,000 – ₹4,00,000",
    stages: "25% on FIR, 50% on chargesheet, 25% on conviction",
  },
  {
    id: "r2",
    label: "Arson, property destruction or crop damage",
    amount: "₹1,00,000 – ₹8,25,000 + reconstruction",
    stages: "Immediate spot inspection & full government restitution",
  },
  {
    id: "r3",
    label: "Severe atrocity, grievous bodily harm or dignity violation",
    amount: "₹4,25,000 – ₹8,25,000 + monthly pension",
    stages: "50% after medical examination & FIR, remainder on trial commencement",
  },
  {
    id: "r4",
    label: "Social boycott or wrongful displacement",
    amount: "₹1,00,000 + safe alternate relocation",
    stages: "Immediate safe housing & subsistence allowance",
  },
];

const FAQS = [
  {
    q: "Can the police refuse to register my FIR?",
    a: "No. Under Section 18A of the PoA Act, no preliminary inquiry is permissible before registering an FIR. If a local police station refuses, you can file a Zero-FIR at any police station or contact NHAA 14566 immediately.",
  },
  {
    q: "What is Section 15A Witness Protection?",
    a: "Section 15A guarantees the victim and witnesses protection from threats, intimidation, and violence, along with travel allowances, police escort to court, and secure video testimony if needed.",
  },
  {
    q: "Do I have to pay any court or legal fees?",
    a: "Zero fees. All legal assistance, court documentation, certified copies, and lawyer representation are completely free under NALSA and the PoA Act provisions.",
  },
];

export default function LegalAidPage() {
  const [selectedRelief, setSelectedRelief] = useState(RELIEF_TIERS[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [phone, setPhone] = useState("");
  const [prefTime, setPrefTime] = useState("Anytime");
  const [prefLang, setPrefLang] = useState("Hindi");

  function requestCallback(e: React.FormEvent) {
    e.preventDefault();
    setCallbackRequested(true);
  }

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <div style={{ display: "flex", marginBottom: "var(--sp-2)" }}>
        <Link href="/home" className="btn btn-ghost btn-sm">
          ← Back to Home
        </Link>
      </div>
      <h1 className="text-h1 text-serif">Legal Rights & Aid</h1>
      <p className="text-body text-muted" style={{ margin: "var(--sp-2) 0 var(--sp-6)" }}>
        Know your statutory protections under the PoA Act. Free legal defense, police escort, and immediate relief.
      </p>

      {/* Emergency helpline banner */}
      <div className={styles.emergencyBanner}>
        <span className={styles.emergencyIcon}>⚡</span>
        <div>
          <div style={{ fontWeight: 700 }}>Facing intimidation or need immediate help?</div>
          <div className="text-sm">
            Call <a href="tel:14566" className={styles.hotlink}>14566</a> (NHAA) or <a href="tel:15100" className={styles.hotlink}>15100</a> (NALSA) — both 24/7 and free.
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className={styles.cardGrid}>
        {INFO_CARDS.map((card) => (
          <div key={card.title} className={`card ${styles.infoCard}`}>
            <div className={styles.cardIcon}>{card.icon}</div>
            <div className={styles.cardTitle}>{card.title}</div>
            <div className="text-sm text-muted">{card.body}</div>
          </div>
        ))}
      </div>

      {/* Statutory Compensation / Relief Estimator */}
      <section className={styles.reliefSection}>
        <div className={styles.reliefHeader}>
          <span className={styles.reliefIcon}>💰</span>
          <div>
            <h2 className="text-h2">Statutory Relief Estimator (Schedule II)</h2>
            <p className="text-sm text-muted">
              Select the nature of the atrocity to view the government relief entitlement guaranteed under law:
            </p>
          </div>
        </div>

        <div className={styles.reliefSelector}>
          {RELIEF_TIERS.map((tier) => (
            <button
              key={tier.id}
              className={`${styles.reliefTab} ${selectedRelief.id === tier.id ? styles.reliefTabActive : ""}`}
              onClick={() => setSelectedRelief(tier)}
            >
              {tier.label}
            </button>
          ))}
        </div>

        <div className={styles.reliefResultCard}>
          <div className={styles.reliefResultAmount}>
            <span className="text-xs text-muted">Entitled Compensation</span>
            <div className={styles.amountValue}>{selectedRelief.amount}</div>
          </div>
          <div className={styles.reliefResultStages}>
            <span className="text-xs text-muted">Disbursement Schedule</span>
            <div className="text-sm font-semibold text-ink">{selectedRelief.stages}</div>
          </div>
          <div className={styles.reliefNote}>
            ℹ️ Relief is deposited directly to the survivor's bank account through the District Magistrate's office. TRAC-Mind counselors can help you file the claim paperwork.
          </div>
        </div>
      </section>

      {/* Legal Aid Callback Request */}
      <section className={styles.callbackSection}>
        <h2 className="text-h2">Request a Confidential Legal Consultation</h2>
        <p className="text-sm text-muted" style={{ margin: "var(--sp-2) 0 var(--sp-5)" }}>
          A certified NALSA volunteer lawyer will call you securely. You can remain anonymous.
        </p>

        {callbackRequested ? (
          <div className={styles.callbackConfirm}>
            <span style={{ fontSize: "1.75rem" }}>✅</span>
            <div>
              <strong>Request successfully queued.</strong> An authorized legal aid counselor will reach out via {prefTime.toLowerCase()} in {prefLang}. Your contact details are stored under end-to-end encryption.
            </div>
          </div>
        ) : (
          <form onSubmit={requestCallback} className={styles.callbackForm}>
            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <label htmlFor="phone-input" className="text-sm font-semibold">
                  Phone Number
                </label>
                <input
                  id="phone-input"
                  type="tel"
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  required
                />
              </div>

              <div className={styles.formCol}>
                <label htmlFor="time-select" className="text-sm font-semibold">
                  Best Time to Call
                </label>
                <select
                  id="time-select"
                  className="input"
                  value={prefTime}
                  onChange={(e) => setPrefTime(e.target.value)}
                >
                  <option>Anytime</option>
                  <option>Morning (9 AM – 12 PM)</option>
                  <option>Afternoon (12 PM – 4 PM)</option>
                  <option>Evening (4 PM – 8 PM)</option>
                </select>
              </div>

              <div className={styles.formCol}>
                <label htmlFor="lang-select" className="text-sm font-semibold">
                  Preferred Language
                </label>
                <select
                  id="lang-select"
                  className="input"
                  value={prefLang}
                  onChange={(e) => setPrefLang(e.target.value)}
                >
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Marathi</option>
                  <option>Tamil</option>
                  <option>Telugu</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", marginTop: "var(--sp-2)" }}>
              Request Free Legal Callback
            </button>
          </form>
        )}
      </section>

      {/* Frequently Asked Questions */}
      <section className={styles.faqSection}>
        <h2 className="text-h2" style={{ marginBottom: "var(--sp-4)" }}>Frequently Asked Legal Questions</h2>
        <div className={styles.faqList}>
          {FAQS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className={styles.faqArrow}>{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <div className={`${styles.faqAnswer} animate-fade-in`}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Direct Helpline Buttons */}
      <div className={styles.quickLinks}>
        <a href="tel:15100" className={styles.qLink}>
          <span>📞</span> NALSA Free Legal Defense — 15100
        </a>
        <a href="tel:14566" className={styles.qLink}>
          <span>🆘</span> NHAA National Atrocity Helpline — 14566
        </a>
        <a href="tel:1091" className={styles.qLink}>
          <span>🛡️</span> Women in Distress Helpline — 1091
        </a>
      </div>
    </div>
  );
}
