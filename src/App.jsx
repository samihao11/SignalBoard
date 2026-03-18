import { useState, useMemo } from "react";
import { getCompanySignals } from "./data/signals";
import SignalDashboard from "./components/SignalDashboard";
import CompanyDrilldown from "./components/CompanyDrilldown";
import "./App.css";

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const companySignals = useMemo(() => getCompanySignals(), []);

  const selectedData = companySignals.find(
    (cs) => cs.company === selectedCompany
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Decagon GTM Signal Dashboard</h1>
        <p>Outbound Signal Tracker</p>
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
