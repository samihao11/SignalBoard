import contacts from "./contacts";
import cmsData from "./cmsData";

const COMPANIES = ["UnitedHealth Group", "Aetna", "Elevance Health"];

export function getCompanySignals() {
  return COMPANIES.map((company) => {
    const companyContacts = contacts.filter(
      (c) => c.normalizedCompany === company
    );

    const newLeadershipHires = companyContacts.filter(
      (c) => c.startedRoleInPastYear
    );
    const portfolioAlums = companyContacts.filter(
      (c) => c.workedAtTargetCompanies
    );
    const aiPosters = companyContacts.filter((c) => c.aiPostSummary);

    const cms = cmsData[company];
    const latestCXLoss = cms[2026].pctMembershipLostBadCX;

    return {
      company,
      contactCount: companyContacts.length,
      contacts: companyContacts,
      cms,
      signals: {
        pctMembershipLostBadCX: latestCXLoss,
        newLeadershipHire: newLeadershipHires.length > 0,
        newLeadershipHires,
        decagonPortfolioAlum: portfolioAlums.length > 0,
        portfolioAlums,
        aiAutomationPosts: aiPosters.length > 0,
        aiPosters,
      },
    };
  });
}
