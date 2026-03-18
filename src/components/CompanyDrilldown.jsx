import { useState } from "react";
import DraftEmailModal from "./DraftEmailModal";

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
    <div className="bg-white rounded-xl shadow-md p-6 mt-2">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-slate-800 text-xl font-semibold">{company}</h2>
        <button
          className="bg-slate-800 text-white border-none px-4 py-1.5 rounded-md cursor-pointer text-sm hover:opacity-90"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* CMS Trend */}
      <section className="mb-6">
        <h3 className="text-base text-slate-800 mb-3 border-b-2 border-gray-200 pb-1.5">
          % Membership Lost to Bad CX — 3-Year Trend
        </h3>
        <div className="flex gap-4 flex-wrap">
          {years.map((year, i) => {
            const val = cms[year].pctMembershipLostBadCX;
            const prev = i > 0 ? cms[years[i - 1]].pctMembershipLostBadCX : null;
            return (
              <div key={year} className="flex-1 min-w-[120px] bg-slate-50 border border-gray-200 rounded-lg p-4 text-center flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-semibold">{year}</span>
                <span className="text-2xl font-bold text-slate-800">{val.toFixed(2)}%</span>
                {prev !== null && (
                  <span className={`text-xs font-semibold ${val < prev ? "text-green-600" : "text-red-600"}`}>
                    {trendArrow(val, prev)} {Math.abs(val - prev).toFixed(2)}pp
                  </span>
                )}
              </div>
            );
          })}
          {(() => {
            const avg = years.reduce((sum, y) => sum + cms[y].pctMembershipLostBadCX, 0) / years.length;
            return (
              <div className="flex-1 min-w-[120px] bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-semibold">3-Year Avg</span>
                <span className="text-2xl font-bold text-slate-800">{avg.toFixed(2)}%</span>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Active Signals */}
      <section className="mb-6">
        <h3 className="text-base text-slate-800 mb-3 border-b-2 border-gray-200 pb-1.5">Active Signals</h3>
        <div className="flex gap-4 flex-wrap">
          {signals.newLeadershipHire && (
            <div className="flex-1 min-w-[200px] bg-green-50 border border-green-200 rounded-lg p-3.5">
              <h4 className="mb-2 text-sm text-green-800 font-semibold">Leadership Changes</h4>
              <ul className="pl-4 text-sm text-gray-700 space-y-1">
                {signals.newLeadershipHires.map((c) => (
                  <li key={c.fullName}><strong>{c.fullName}</strong> — {c.title}</li>
                ))}
              </ul>
            </div>
          )}
          {signals.aiAutomationPosts && (
            <div className="flex-1 min-w-[200px] bg-green-50 border border-green-200 rounded-lg p-3.5">
              <h4 className="mb-2 text-sm text-green-800 font-semibold">AI/Automation Posts</h4>
              {signals.aiPosters.map((c) => (
                <div key={c.fullName} className="mb-2">
                  <strong className="text-sm text-gray-700">{c.fullName}</strong>
                  <p className="text-sm text-gray-700 mt-1 leading-snug">{c.aiPostSummary}</p>
                </div>
              ))}
            </div>
          )}
          {signals.decagonPortfolioAlum && (
            <div className="flex-1 min-w-[200px] bg-green-50 border border-green-200 rounded-lg p-3.5">
              <h4 className="mb-2 text-sm text-green-800 font-semibold">Decagon Portfolio Alums</h4>
              <ul className="pl-4 text-sm text-gray-700 space-y-1">
                {signals.portfolioAlums.map((c) => (
                  <li key={c.fullName}><strong>{c.fullName}</strong> — {c.title}</li>
                ))}
              </ul>
            </div>
          )}
          {!signals.newLeadershipHire && !signals.aiAutomationPosts && !signals.decagonPortfolioAlum && (
            <p className="text-gray-500 text-[0.9rem]">No active signals beyond CMS data for this company.</p>
          )}
        </div>
      </section>

      {/* All Contacts */}
      <section className="mb-6">
        <h3 className="text-base text-slate-800 mb-3 border-b-2 border-gray-200 pb-1.5">
          All Contacts ({contacts.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="bg-slate-800 text-white text-left px-3.5 py-2.5 text-sm font-semibold">Name</th>
                <th className="bg-slate-800 text-white text-left px-3.5 py-2.5 text-sm font-semibold">Title</th>
                <th className="bg-slate-800 text-white text-left px-3.5 py-2.5 text-sm font-semibold">Email</th>
                <th className="bg-slate-800 text-white text-left px-3.5 py-2.5 text-sm font-semibold">LinkedIn</th>
                <th className="bg-slate-800 text-white text-left px-3.5 py-2.5 text-sm font-semibold">Signals</th>
                <th className="bg-slate-800 text-white text-left px-3.5 py-2.5 text-sm font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {sortedContacts.map((c) => {
                const pills = [];
                if (c.startedRoleInPastYear) pills.push("Leadership Change");
                if (c.aiPostSummary) pills.push("AI Posts");
                return (
                  <tr key={c.fullName} className="hover:bg-blue-50">
                    <td className="px-3.5 py-2.5 text-sm border-b border-gray-200 align-top font-semibold text-slate-800 whitespace-nowrap">{c.fullName}</td>
                    <td className="px-3.5 py-2.5 text-sm border-b border-gray-200 align-top">{c.title}</td>
                    <td className="px-3.5 py-2.5 text-sm border-b border-gray-200 align-top">
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="text-sm text-blue-600 no-underline hover:underline">{c.email}</a>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-sm border-b border-gray-200 align-top">
                      {c.linkedIn && (
                        <a href={c.linkedIn} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 no-underline hover:underline">LinkedIn</a>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-sm border-b border-gray-200 align-top">
                      {pills.length > 0 && (
                        <div className="flex gap-1.5">
                          {pills.map((p) =>
                            p === "AI Posts" && c.aiPostSummary ? (
                              <span key={p} className="relative inline-block group">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium whitespace-nowrap animate-pulse-green">{p}</span>
                                <span className="hidden group-hover:block absolute top-full right-0 mt-1.5 bg-white border border-gray-200 shadow-lg rounded-md px-3 py-2 text-xs text-gray-700 leading-snug max-w-[300px] w-max z-10">{c.aiPostSummary}</span>
                              </span>
                            ) : (
                              <span key={p} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium whitespace-nowrap animate-pulse-green">{p}</span>
                            )
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-sm border-b border-gray-200 align-top">
                      <button
                        className="bg-slate-800 text-white border-none px-3 py-1 rounded-md cursor-pointer text-xs font-medium whitespace-nowrap hover:opacity-90"
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
