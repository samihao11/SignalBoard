import SignalBadge from "./SignalBadge";

export default function SignalDashboard({ companySignals, selectedCompany, onSelect }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr>
            <th className="bg-slate-800 text-white text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Company</th>
            <th className="bg-slate-800 text-white text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">% Lost to Bad CX</th>
            <th className="bg-slate-800 text-white text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Leadership Change</th>
            <th className="bg-slate-800 text-white text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Decagon Portfolio Alum</th>
            <th className="bg-slate-800 text-white text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">AI/Automation Posts</th>
            <th className="bg-slate-800 text-white text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Contacts</th>
          </tr>
        </thead>
        <tbody>
          {companySignals.map((cs) => {
            const selected = selectedCompany === cs.company;
            return (
              <tr
                key={cs.company}
                className={`cursor-pointer transition-colors duration-100 hover:bg-blue-50 ${
                  selected ? "bg-blue-100 shadow-[inset_3px_0_0_#2563eb]" : ""
                }`}
                onClick={() => onSelect(selected ? null : cs.company)}
              >
                <td className="px-4 py-3 text-[0.9rem] border-b border-gray-200 font-semibold text-slate-800">{cs.company}</td>
                <td className="px-4 py-3 text-[0.9rem] border-b border-gray-200">
                  <span className="inline-block bg-slate-800 text-white px-2.5 py-0.5 rounded-full text-sm font-semibold">
                    {cs.signals.pctMembershipLostBadCX.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-[0.9rem] border-b border-gray-200"><SignalBadge active={cs.signals.newLeadershipHire} /></td>
                <td className="px-4 py-3 text-[0.9rem] border-b border-gray-200"><SignalBadge active={cs.signals.decagonPortfolioAlum} /></td>
                <td className="px-4 py-3 text-[0.9rem] border-b border-gray-200"><SignalBadge active={cs.signals.aiAutomationPosts} /></td>
                <td className="px-4 py-3 text-[0.9rem] border-b border-gray-200 text-center font-semibold">{cs.contactCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
