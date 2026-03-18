// CMS Medicare Advantage data (from CMSdata.csv)
const cmsData = {
  "UnitedHealth Group": {
    2024: { avgCustServiceScore: 3.59, disenrollmentRate: 18.49, pctLeaversInfoProblems: 10.54, pctMembershipLostBadCX: 1.95 },
    2025: { avgCustServiceScore: 3.13, disenrollmentRate: 18.15, pctLeaversInfoProblems: 10.10, pctMembershipLostBadCX: 1.83 },
    2026: { avgCustServiceScore: 3.28, disenrollmentRate: 18.69, pctLeaversInfoProblems: 9.68,  pctMembershipLostBadCX: 1.81 },
  },
  "Aetna": {
    2024: { avgCustServiceScore: 3.41, disenrollmentRate: 25.74, pctLeaversInfoProblems: 13.66, pctMembershipLostBadCX: 3.52 },
    2025: { avgCustServiceScore: 3.37, disenrollmentRate: 19.82, pctLeaversInfoProblems: 12.65, pctMembershipLostBadCX: 2.51 },
    2026: { avgCustServiceScore: 3.32, disenrollmentRate: 22.05, pctLeaversInfoProblems: 10.97, pctMembershipLostBadCX: 2.42 },
  },
  "Elevance Health": {
    2024: { avgCustServiceScore: 3.09, disenrollmentRate: 23.53, pctLeaversInfoProblems: 12.07, pctMembershipLostBadCX: 2.84 },
    2025: { avgCustServiceScore: 2.93, disenrollmentRate: 23.26, pctLeaversInfoProblems: 11.74, pctMembershipLostBadCX: 2.73 },
    2026: { avgCustServiceScore: 2.94, disenrollmentRate: 19.72, pctLeaversInfoProblems: 11.67, pctMembershipLostBadCX: 2.30 },
  },
};

export default cmsData;
