import { useState, useMemo } from "react";
import { getCompanySignals } from "./data/signals";
import SignalDashboard from "./components/SignalDashboard";
import CompanyDrilldown from "./components/CompanyDrilldown";

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const companySignals = useMemo(() => getCompanySignals(), []);

  const selectedData = companySignals.find(
    (cs) => cs.company === selectedCompany
  );

  return (
    <div className="max-w-[1100px] mx-auto px-5 pb-10 font-sans text-gray-800 bg-slate-100 min-h-screen">
      <header className="bg-slate-800 text-white px-6 py-5 -mx-5 mb-6 flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-xl font-bold">Decagon GTM Signal Dashboard</h1>
        <p className="text-sm opacity-80">Outbound Signal Tracker</p>
      </header>

      <SignalDashboard
        companySignals={companySignals}
        selectedCompany={selectedCompany}
        onSelect={setSelectedCompany}
      />

      {selectedData && (
        <CompanyDrilldown
          data={selectedData}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}
