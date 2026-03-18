import SignalBadge from "./SignalBadge";
import "./SignalDashboard.css";

export default function SignalDashboard({ companySignals, selectedCompany, onSelect }) {
  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>% Lost to Bad CX</th>
            <th>Leadership Change</th>
            <th>Decagon Portfolio Alum</th>
            <th>AI/Automation Posts</th>
            <th>Contacts</th>
          </tr>
        </thead>
        <tbody>
          {companySignals.map((cs) => {
            const selected = selectedCompany === cs.company;
            return (
              <tr
                key={cs.company}
                className={selected ? "row-selected" : ""}
                onClick={() => onSelect(selected ? null : cs.company)}
              >
                <td className="company-cell">{cs.company}</td>
                <td>
                  <span className="cx-badge">
                    {cs.signals.pctMembershipLostBadCX.toFixed(2)}%
                  </span>
                </td>
                <td><SignalBadge active={cs.signals.newLeadershipHire} /></td>
                <td><SignalBadge active={cs.signals.decagonPortfolioAlum} /></td>
                <td><SignalBadge active={cs.signals.aiAutomationPosts} /></td>
                <td className="count-cell">{cs.contactCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
