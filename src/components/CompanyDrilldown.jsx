import { useState } from "react";
import DraftEmailModal from "./DraftEmailModal";
import "./CompanyDrilldown.css";

const years = [2024, 2025, 2026];

function trendArrow(current, previous) {
  const diff = current - previous;
  if (Math.abs(diff) < 0.01) return "~";
  return diff < 0 ? "\u2193" : "\u2191";
}

export default function CompanyDrilldown({ data, onClose }) {
  const { company, contacts, cms, signals } = data;
  const sortedContacts = [...contacts].sort((a, b) => a.tier - b.tier);
  const [draftContact, setDraftContact] = useState(null);

  return (
    <div className="drilldown">
      <div className="drilldown-header">
        <h2>{company}</h2>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>

      {/* CMS Trend */}
      <section className="drilldown-section">
        <h3>% Membership Lost to Bad CX — 3-Year Trend</h3>
        <div className="trend-row">
          {years.map((year, i) => {
            const val = cms[year].pctMembershipLostBadCX;
            const prev = i > 0 ? cms[years[i - 1]].pctMembershipLostBadCX : null;
            return (
              <div key={year} className="trend-card">
                <span className="trend-year">{year}</span>
                <span className="trend-value">{val.toFixed(2)}%</span>
                {prev !== null && (
                  <span className={`trend-arrow ${val < prev ? "improving" : "worsening"}`}>
                    {trendArrow(val, prev)} {Math.abs(val - prev).toFixed(2)}pp
                  </span>
                )}
              </div>
            );
          })}
          {(() => {
            const avg = years.reduce((sum, y) => sum + cms[y].pctMembershipLostBadCX, 0) / years.length;
            return (
              <div className="trend-card trend-card-avg">
                <span className="trend-year">3-Year Avg</span>
                <span className="trend-value">{avg.toFixed(2)}%</span>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Active Signals */}
      <section className="drilldown-section">
        <h3>Active Signals</h3>
        <div className="signal-details">
          {signals.newLeadershipHire && (
            <div className="signal-detail-card">
              <h4>Leadership Changes</h4>
              <ul>
                {signals.newLeadershipHires.map((c) => (
                  <li key={c.fullName}><strong>{c.fullName}</strong> — {c.title}</li>
                ))}
              </ul>
            </div>
          )}
          {signals.aiAutomationPosts && (
            <div className="signal-detail-card">
              <h4>AI/Automation Posts</h4>
              {signals.aiPosters.map((c) => (
                <div key={c.fullName} className="ai-poster-detail">
                  <strong>{c.fullName}</strong>
                  <p>{c.aiPostSummary}</p>
                </div>
              ))}
            </div>
          )}
          {signals.decagonPortfolioAlum && (
            <div className="signal-detail-card">
              <h4>Decagon Portfolio Alums</h4>
              <ul>
                {signals.portfolioAlums.map((c) => (
                  <li key={c.fullName}><strong>{c.fullName}</strong> — {c.title}</li>
                ))}
              </ul>
            </div>
          )}
          {!signals.newLeadershipHire && !signals.aiAutomationPosts && !signals.decagonPortfolioAlum && (
            <p className="no-signals">No active signals beyond CMS data for this company.</p>
          )}
        </div>
      </section>

      {/* All Contacts */}
      <section className="drilldown-section">
        <h3>All Contacts ({contacts.length})</h3>
        <div className="contacts-table-wrap">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Email</th>
                <th>LinkedIn</th>
                <th>Signals</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedContacts.map((c) => {
                const pills = [];
                if (c.startedRoleInPastYear) pills.push("Leadership Change");
                if (c.aiPostSummary) pills.push("AI Posts");
                return (
                  <tr key={c.fullName}>
                    <td className="contact-name-cell">{c.fullName}</td>
                    <td>{c.title}</td>
                    <td>
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="contact-link">{c.email}</a>
                      )}
                    </td>
                    <td>
                      {c.linkedIn && (
                        <a href={c.linkedIn} target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
                      )}
                    </td>
                    <td>
                      {pills.length > 0 && (
                        <div className="signal-pills">
                          {pills.map((p) =>
                            p === "AI Posts" && c.aiPostSummary ? (
                              <span key={p} className="signal-pill-wrapper">
                                <span className="signal-pill">{p}</span>
                                <span className="pill-tooltip">{c.aiPostSummary}</span>
                              </span>
                            ) : (
                              <span key={p} className="signal-pill">{p}</span>
                            )
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className="draft-copy-table-btn"
                        onClick={() => setDraftContact(c)}
                      >
                        Draft Copy
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {draftContact && (
        <DraftEmailModal
          contact={draftContact}
          company={company}
          cms={cms}
          signals={signals}
          onClose={() => setDraftContact(null)}
        />
      )}
    </div>
  );
}
