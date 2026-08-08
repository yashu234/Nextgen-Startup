/**
 * Compliance Engine Utility — Member 4: Legal & Regulatory Engine
 *
 * Provides structured legal compliance checklists, government registrations,
 * document requirements, estimated government fees, processing times,
 * and registration steps based on startup industry and business type.
 *
 * Industries covered:
 *   food, ecommerce, tech, healthcare, education, logistics, retail, fintech
 */

// ── Master Compliance Data Repository ──────────────────────────────────────
const COMPLIANCE_DATABASE = {
  // Food & Beverage / Food Delivery
  food: {
    registrations: [
      {
        id: 'fssai',
        title: 'FSSAI License / Registration',
        reason: 'Food safety and standards compliance is mandatory for all food manufacturing, processing, and delivery businesses in India.',
        requiredDocs: ['PAN Card of Founder/Entity', 'Aadhaar Card', 'Proof of Premises Address (Rental Agreement/Electricity Bill)', 'Food Safety Management System (FSMS) Plan', 'List of Food Products/Categories'],
        estimatedFee: '₹100 (Basic) - ₹7,500 (State/Central License)',
        processingTime: '7 - 30 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'gst',
        title: 'GST Registration',
        reason: 'Mandatory for food aggregators, e-commerce sales, or businesses with annual turnover exceeding threshold limits (₹20L/₹40L).',
        requiredDocs: ['PAN Card of Business', 'Certificate of Incorporation / Partnership Deed', 'Bank Account Details & Cancelled Cheque', 'Premises Address Proof'],
        estimatedFee: '₹0 (Govt Fee) / ~₹500 - ₹1,500 (Professional Fee)',
        processingTime: '3 - 7 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'msme',
        title: 'MSME / Udyam Registration',
        reason: 'Provides government scheme eligibility, priority sector bank lending, subsidies, and tax benefits for small businesses.',
        requiredDocs: ['Aadhaar Card of Founder', 'PAN Card of Founder/Business', 'GSTIN (if available)'],
        estimatedFee: '₹0 (Free on Govt Portal)',
        processingTime: '1 - 2 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'startup_india',
        title: 'Startup India DPIIT Recognition',
        reason: 'Offers 3-year tax exemption (80IAC), fast-tracked patent examination, and access to SIDBI Fund of Funds.',
        requiredDocs: ['Certificate of Incorporation/Registration', 'Write-up on Innovation & Scalability', 'Pitch Deck / Website URL'],
        estimatedFee: '₹0 (Free on Startup India Portal)',
        processingTime: '10 - 15 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'shop_act',
        title: 'Shop & Establishment Act Registration',
        reason: 'Local municipal registration required to legally open a commercial establishment, office, or dark kitchen.',
        requiredDocs: ['Commercial Address Proof', 'Rent Agreement & NOC from Landlord', 'PAN & Aadhaar of Proprietor/Directors', 'Employee List & Salary Structure'],
        estimatedFee: '₹500 - ₹2,500 (Varies by State)',
        processingTime: '5 - 10 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'trademark',
        title: 'Trademark Registration (Brand Name & Logo)',
        reason: 'Protects your brand name, food brand logo, and packaging against unauthorized copying or infringement.',
        requiredDocs: ['Logo PNG/JPEG', 'Brand Name', 'TM Application Form', 'Userval Statement/Proof of First Use'],
        estimatedFee: '₹4,500 (Govt fee per class for MSME/Startup)',
        processingTime: '6 - 12 Months',
        priority: 'Medium',
        status: 'Pending',
      },
    ],
    licenses: [
      'Eating House License (Municipal Corporation)',
      'Fire Safety NOC (for kitchen facilities > 50 sq m)',
      'Health & Trade License (Local Municipal Body)',
      'Environmental / Pollution Clearance (State PCB)',
    ],
    legalDocs: [
      'Food Delivery Partner Vendor Agreement',
      'Hygiene & Quality Standard Operating Procedures (SOPs)',
      'Customer Terms of Service & Refund Policy',
      'Employee & Kitchen Staff Employment Contracts',
    ],
  },

  // E-Commerce / Retail
  ecommerce: {
    registrations: [
      {
        id: 'gst',
        title: 'GST Registration',
        reason: 'Mandatory for all e-commerce sellers selling goods or services online regardless of turnover.',
        requiredDocs: ['PAN Card of Entity', 'Incorporation Certificate', 'Bank Account Statement/Cancelled Cheque', 'Principal Place of Business Proof'],
        estimatedFee: '₹0 (Govt Fee)',
        processingTime: '3 - 7 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'msme',
        title: 'MSME / Udyam Registration',
        reason: 'Unlocks priority bank loans, lower interest rates, collateral-free credit, and government procurement preference.',
        requiredDocs: ['Aadhaar Card', 'PAN Card', 'Bank Account Info'],
        estimatedFee: '₹0 (Free)',
        processingTime: '1 - 2 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'iec',
        title: 'Import Export Code (IEC)',
        reason: 'Required if your e-commerce store imports goods from overseas or exports products internationally.',
        requiredDocs: ['PAN Card', 'Aadhaar/Voter ID', 'Cancelled Cheque of Entity', 'Address Proof'],
        estimatedFee: '₹500 (Govt Fee)',
        processingTime: '2 - 5 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'trademark',
        title: 'Trademark Registration',
        reason: 'Protects e-commerce store brand name, domain, and unique product labels from counterfeiters.',
        requiredDocs: ['Brand Logo', 'Identity Proof', 'Authorization Letter'],
        estimatedFee: '₹4,500 (Per Class)',
        processingTime: '6 - 12 Months',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'dpdp',
        title: 'DPDP Data Privacy Compliance',
        reason: 'Compliance with Digital Personal Data Protection Act for storing online customer emails, phone numbers, and payment history.',
        requiredDocs: ['Privacy Policy Notice', 'Consent Management Framework', 'Data Breach Handling Policy'],
        estimatedFee: '₹0 (Self-declaration & legal drafting)',
        processingTime: 'Immediate',
        priority: 'High',
        status: 'Pending',
      },
    ],
    licenses: [
      'Shop & Establishment License',
      'Legal Metrology Package Commodity Registration (for pre-packed goods)',
      'Payment Gateway Merchant Agreement Approval',
    ],
    legalDocs: [
      'E-Commerce Terms & Conditions',
      'Privacy Policy & Cookie Consent',
      'Shipping, Delivery & Return/Refund Policy',
      'Vendor & Logistics Partner Service Agreement',
    ],
  },

  // Tech / Software / SaaS / AI
  tech: {
    registrations: [
      {
        id: 'startup_india',
        title: 'Startup India DPIIT Recognition',
        reason: 'Essential for tech startups to claim 80IAC income tax exemptions and self-certify under environmental & labor laws.',
        requiredDocs: ['Certificate of Incorporation', 'Pitch Deck / Product Demo Link', 'Description of Innovative Tech Solution'],
        estimatedFee: '₹0 (Free)',
        processingTime: '7 - 14 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'gst',
        title: 'GST Registration (OAR/SaaS)',
        reason: 'Required for selling SaaS software, API subscriptions, and digital services locally or globally.',
        requiredDocs: ['PAN Card', 'Certificate of Incorporation', 'Address Proof', 'Bank Account Info'],
        estimatedFee: '₹0 (Govt Fee)',
        processingTime: '3 - 7 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'msme',
        title: 'MSME / Udyam Registration',
        reason: 'Subsidies on patent filings, trademark fees (50% rebate), and government software tender preferences.',
        requiredDocs: ['Aadhaar Card', 'PAN Card'],
        estimatedFee: '₹0 (Free)',
        processingTime: '1 - 2 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'copyright_patent',
        title: 'Software Copyright & Patent Registration',
        reason: 'Protects proprietary algorithms, AI source code, software architecture, and user interface designs.',
        requiredDocs: ['Source Code Snippets (First 20 & Last 20 lines)', 'Software Design Document', 'Applicant Authorisation'],
        estimatedFee: '₹500 - ₹5,000 (Govt Fee)',
        processingTime: '3 - 6 Months',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'dpdp',
        title: 'DPDP & GDPR Data Protection Audit',
        reason: 'Mandatory data privacy compliance for user data handling, AI processing, cloud analytics, and international users.',
        requiredDocs: ['Comprehensive Privacy Policy', 'Data Processing Addendum (DPA)', 'Security & Access Control Audit'],
        estimatedFee: '₹0 - ₹10,000 (Internal/Audit)',
        processingTime: '5 - 10 Business Days',
        priority: 'High',
        status: 'Pending',
      },
    ],
    licenses: [
      'Software Export Clearance (STPI / LUT under GST for zero-rated export)',
      'Cloud Data Center Security Compliance Certification (ISO 27001)',
    ],
    legalDocs: [
      'SaaS Master Services Agreement (MSA)',
      'End User License Agreement (EULA)',
      'Privacy Policy & Data Security Standards',
      'Employee Non-Disclosure Agreement (NDA) & IP Assignment Agreement',
    ],
  },

  // ── NEW INDUSTRY: Healthcare / MedTech ─────────────────────────────────────
  healthcare: {
    registrations: [
      {
        id: 'clinical_establishment',
        title: 'Clinical Establishment Registration',
        reason: 'Mandatory under the Clinical Establishments (Registration & Regulation) Act, 2010 for all hospitals, clinics, diagnostic labs, and health centers.',
        requiredDocs: ['Incorporation Certificate', 'Address Proof of Clinic', 'Medical Council Registration of Qualified Doctors', 'Equipment List & Floor Plan', 'Fire NOC'],
        estimatedFee: '₹2,000 - ₹25,000 (Based on bed count & state)',
        processingTime: '15 - 45 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'drug_license',
        title: 'Drug License (Form 20/21)',
        reason: 'Required for any startup selling, storing, distributing, or manufacturing pharmaceutical drugs, medical devices, or OTC products.',
        requiredDocs: ['Pharmacy Degree Certificate', 'Premises Proof', 'Drug Inspector Inspection Report', 'Storage Facility Details'],
        estimatedFee: '₹3,000 - ₹10,000',
        processingTime: '30 - 60 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'gst',
        title: 'GST Registration',
        reason: 'Required for health-tech platforms, medical device sales, or healthcare services with turnover above threshold.',
        requiredDocs: ['PAN Card', 'Incorporation Certificate', 'Address Proof', 'Bank Details'],
        estimatedFee: '₹0 (Govt Fee)',
        processingTime: '3 - 7 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'msme',
        title: 'MSME / Udyam Registration',
        reason: 'Eligible for healthcare equipment subsidies, priority bank credit, and government hospital tender empanelment.',
        requiredDocs: ['Aadhaar Card', 'PAN Card'],
        estimatedFee: '₹0 (Free)',
        processingTime: '1 - 2 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'startup_india',
        title: 'Startup India DPIIT Recognition',
        reason: 'HealthTech startups are priority recipients of BIRAC grants, DST funding, and Ayushman Bharat Digital Mission (ABDM) sandbox access.',
        requiredDocs: ['Incorporation Certificate', 'Pitch Deck', 'Product Innovation Description'],
        estimatedFee: '₹0 (Free)',
        processingTime: '7 - 14 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
    ],
    licenses: [
      'Biomedical Waste Management License (CPCB/State PCB)',
      'PCPNDT Act Compliance (for ultrasound/prenatal diagnostics)',
      'Pharmacy Council of India Registration',
      'NABH Accreditation (for hospitals seeking insurance empanelment)',
    ],
    legalDocs: [
      'Patient Data Privacy & Consent Policy (DISHA Compliance)',
      'Doctor-Patient Telemedicine Service Agreement',
      'Medical Device Usage & Liability Waiver',
      'Healthcare Worker Employment & Non-Compete Agreement',
    ],
  },

  // ── NEW INDUSTRY: Education / EdTech ───────────────────────────────────────
  education: {
    registrations: [
      {
        id: 'society_trust',
        title: 'Society / Trust / Section-8 Company Registration',
        reason: 'Educational institutions in India are legally required to be registered as a Society (under Societies Registration Act), Trust, or Section-8 Not-for-Profit Company.',
        requiredDocs: ['Memorandum of Association', 'Rules & Regulations Document', 'Identity Proof of Governing Body Members', 'Address Proof of Institution'],
        estimatedFee: '₹500 - ₹5,000 (State Dependent)',
        processingTime: '15 - 30 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'gst',
        title: 'GST Registration (EdTech / Online Courses)',
        reason: 'Online education platforms, ed-tech subscription services, and vocational training businesses must register for GST (18% on digital services).',
        requiredDocs: ['PAN Card', 'Incorporation Certificate', 'Address Proof', 'Bank Account Details'],
        estimatedFee: '₹0 (Govt Fee)',
        processingTime: '3 - 7 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'msme',
        title: 'MSME / Udyam Registration',
        reason: 'Eligible for PM eVIDYA scheme benefits, e-learning infrastructure subsidies, and government skill development contracts.',
        requiredDocs: ['Aadhaar Card', 'PAN Card'],
        estimatedFee: '₹0 (Free)',
        processingTime: '1 - 2 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'startup_india',
        title: 'Startup India DPIIT Recognition',
        reason: 'EdTech startups qualify for NASSCOM EdTech 100 recognition and NIC/MeitY startup grants for digital literacy programs.',
        requiredDocs: ['Incorporation Certificate', 'Pitch Deck', 'Innovation Write-up'],
        estimatedFee: '₹0 (Free)',
        processingTime: '7 - 14 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'trademark',
        title: 'Trademark Registration (Platform & Curriculum Brand)',
        reason: 'Protects course names, learning methodology, brand name, and proprietary educational content from copying.',
        requiredDocs: ['Brand Logo', 'Brand Name', 'TM Form', 'Identity Proof'],
        estimatedFee: '₹4,500 (Per Class)',
        processingTime: '6 - 12 Months',
        priority: 'Medium',
        status: 'Pending',
      },
    ],
    licenses: [
      'AICTE / UGC Affiliation (for degree-granting courses)',
      'State Education Board Recognition (for school curriculum)',
      'NSDC Certification (for skill development & vocational training)',
      'ISO 9001 Quality Management Certification (optional but preferred)',
    ],
    legalDocs: [
      'Student Enrollment & Course Terms Agreement',
      'Instructor / Faculty Employment Contract',
      'Content Licensing & Copyright Assignment Agreement',
      'Refund & Cancellation Policy for Online Courses',
    ],
  },

  // ── NEW INDUSTRY: Logistics / Supply Chain / Delivery ─────────────────────
  logistics: {
    registrations: [
      {
        id: 'gst',
        title: 'GST Registration (GTA)',
        reason: 'Goods Transport Agencies (GTA) must mandatorily register under GST. Logistics services are taxable at 5% or 12% depending on the service type.',
        requiredDocs: ['PAN Card', 'Incorporation Certificate', 'Fleet Vehicle RC Books', 'Address Proof', 'Bank Account Details'],
        estimatedFee: '₹0 (Govt Fee)',
        processingTime: '3 - 7 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'goods_carriage_permit',
        title: 'National Permit for Goods Carriage (NP)',
        reason: 'Required under the Motor Vehicles Act for all commercial vehicles (trucks, tempos, vans) operating across state borders.',
        requiredDocs: ['Vehicle Registration Certificate (RC)', 'Insurance Certificate', 'PUC Certificate', 'Tax Clearance Certificate', 'Driver License & Fitness Certificate'],
        estimatedFee: '₹1,500 - ₹15,000 per vehicle (Annual)',
        processingTime: '7 - 21 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'msme',
        title: 'MSME / Udyam Registration',
        reason: 'Enables priority bank loans for fleet expansion, government logistics tender eligibility, and diesel subsidy access.',
        requiredDocs: ['Aadhaar Card', 'PAN Card'],
        estimatedFee: '₹0 (Free)',
        processingTime: '1 - 2 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'warehouse_license',
        title: 'Warehousing License (WDRA)',
        reason: 'Compulsory for operating commercial warehouses storing agricultural commodities under the Warehousing Development & Regulation Act.',
        requiredDocs: ['Warehouse Infrastructure Details', 'Fire Safety NOC', 'Pest Control Certificate', 'Quality Testing Lab Report'],
        estimatedFee: '₹10,000 - ₹50,000 (Based on capacity)',
        processingTime: '30 - 60 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'startup_india',
        title: 'Startup India DPIIT Recognition',
        reason: 'Logistics tech startups (route optimization, fleet management AI, EV logistics) are priority candidates for DPIIT innovation grants.',
        requiredDocs: ['Incorporation Certificate', 'Pitch Deck', 'Innovation Description'],
        estimatedFee: '₹0 (Free)',
        processingTime: '7 - 14 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
    ],
    licenses: [
      'State Pollution Control Board NOC (for warehouses)',
      'E-Way Bill Registration (for interstate goods movement)',
      'EV Fleet Subsidy Registration (FAME-II Scheme)',
    ],
    legalDocs: [
      'Logistics Service Agreement (LSA) with Clients',
      'Driver & Delivery Personnel Employment Contract',
      'Cargo Insurance & Liability Policy',
      'Last-Mile Delivery Partner Agreement',
    ],
  },

  // ── NEW INDUSTRY: Retail / Physical Store ─────────────────────────────────
  retail: {
    registrations: [
      {
        id: 'gst',
        title: 'GST Registration',
        reason: 'All retail stores with annual turnover exceeding ₹40 lakh (goods) or ₹20 lakh (services) must register and collect GST from customers.',
        requiredDocs: ['PAN Card', 'Aadhaar Card', 'Premises Proof', 'Bank Account Details', 'Photograph of Business Owner'],
        estimatedFee: '₹0 (Govt Fee)',
        processingTime: '3 - 7 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'shop_establishment',
        title: 'Shop & Establishment Act Registration',
        reason: 'Mandatory for all physical retail shops and stores to legally operate, hire employees, and set working hours.',
        requiredDocs: ['Address Proof of Store', 'PAN Card', 'Aadhaar of Owner', 'Employee List', 'Rent Agreement/NOC'],
        estimatedFee: '₹200 - ₹5,000 (State Dependent)',
        processingTime: '5 - 15 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'msme',
        title: 'MSME / Udyam Registration',
        reason: 'Retail MSMEs gain priority GeM portal access (Government e-Marketplace), lower bank interest rates, and collateral-free loans.',
        requiredDocs: ['Aadhaar Card', 'PAN Card', 'Bank Account Info'],
        estimatedFee: '₹0 (Free)',
        processingTime: '1 - 2 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'bis_hallmark',
        title: 'BIS / Hallmarking Certification',
        reason: 'Required for retail businesses selling gold jewellery (mandatory BIS Hallmarking), electronics, food-contact materials, or safety-certified products.',
        requiredDocs: ['Product Samples for Testing', 'Manufacturing Process Details', 'Lab Test Reports', 'Quality Manual'],
        estimatedFee: '₹5,000 - ₹50,000 (Per product category)',
        processingTime: '30 - 90 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'trademark',
        title: 'Trademark Registration',
        reason: 'Protects retail store name, private label brands, product logos, and packaging designs.',
        requiredDocs: ['Brand Logo/Name', 'Identity Proof', 'Authorization Letter'],
        estimatedFee: '₹4,500 (Per Class)',
        processingTime: '6 - 12 Months',
        priority: 'Medium',
        status: 'Pending',
      },
    ],
    licenses: [
      'Trade License from Local Municipal Corporation',
      'Fire Safety & Building Safety NOC',
      'Food Safety (FSSAI) License (if selling packaged food/beverages)',
      'Legal Metrology Certification (for weighing & measuring equipment)',
    ],
    legalDocs: [
      'Vendor / Supplier Purchase Agreement',
      'Return & Exchange Policy (Customer Facing)',
      'Staff Employment & Code of Conduct Agreement',
      'Lease Agreement for Commercial Retail Space',
    ],
  },

  // ── NEW INDUSTRY: Finance / FinTech / Payments ─────────────────────────────
  fintech: {
    registrations: [
      {
        id: 'rbi_nbfc',
        title: 'RBI NBFC Registration / Certificate of Registration',
        reason: 'Fintech companies offering lending, credit, investments, or insurance services must register as an NBFC with the Reserve Bank of India.',
        requiredDocs: ['Net Owned Fund Certificate (min ₹2 Crore for new NBFC)', 'Certificate of Incorporation', 'Board Resolution', 'Statutory Auditor Certificate', 'Directors\' KYC & Background'],
        estimatedFee: '₹0 (RBI Govt Processing) + ₹50,000+ Legal Fees',
        processingTime: '6 - 18 Months',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'ppi_license',
        title: 'Prepaid Payment Instrument (PPI) License — RBI',
        reason: 'Required for digital wallets, prepaid cards, UPI apps, or any platform that stores user money electronically.',
        requiredDocs: ['Net Worth Certificate (min ₹5 Crore)', 'Technology Architecture Document', 'Escrow Account Agreement', 'AML/KYC Policy Document'],
        estimatedFee: '₹0 (Govt) + ₹1L+ Legal Processing',
        processingTime: '12 - 24 Months',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'gst',
        title: 'GST Registration',
        reason: 'Financial services (excluding banking/insurance) are taxable at 18% GST. All FinTech transaction fees, platform fees, and SaaS charges require GST compliance.',
        requiredDocs: ['PAN Card', 'Certificate of Incorporation', 'Address Proof', 'Bank Account Info'],
        estimatedFee: '₹0 (Govt Fee)',
        processingTime: '3 - 7 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'startup_india',
        title: 'Startup India DPIIT Recognition',
        reason: 'FinTech startups access IFSCA regulatory sandbox, RBI Innovation Hub (RBIH) partnerships, and SIDBI fintech acceleration funding.',
        requiredDocs: ['Incorporation Certificate', 'Pitch Deck', 'Innovation Write-up'],
        estimatedFee: '₹0 (Free)',
        processingTime: '7 - 14 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'dpdp_pci_dss',
        title: 'DPDP Compliance + PCI DSS Certification',
        reason: 'All fintech platforms handling payment card data, user bank accounts, or personal financial records must comply with PCI DSS (global standard) and India\'s DPDP Act.',
        requiredDocs: ['PCI DSS Qualified Security Assessor (QSA) Report', 'Data Flow Diagrams', 'Vulnerability Assessment & Penetration Testing (VAPT) Report'],
        estimatedFee: '₹1,00,000 - ₹5,00,000 (Annual Audit)',
        processingTime: '60 - 90 Business Days',
        priority: 'High',
        status: 'Pending',
      },
    ],
    licenses: [
      'SEBI Investment Adviser License (for wealth management apps)',
      'IRDAI License (for insurance-tech / insurtech platforms)',
      'AMFI Registration (for mutual fund distribution platforms)',
      'FIU-IND Registration (Anti-Money Laundering Reporting Entity)',
    ],
    legalDocs: [
      'User Agreement & KYC/AML Policy',
      'Privacy Policy (DPDP + RBI Data Localization Compliance)',
      'Escrow Agreement with Partner Bank',
      'Payment Gateway Service Level Agreement (SLA)',
    ],
  },
}

/**
 * Get tailored compliance recommendations based on user input
 */
export function getComplianceRequirements(industry = '', idea = '', businessType = '') {
  const ind = (industry || idea || '').toLowerCase()

  let selectedKey = 'tech'

  // Food & Beverage
  if (ind.includes('food') || ind.includes('restaurant') || ind.includes('cafe') || ind.includes('kitchen') || ind.includes('delivery') || ind.includes('beverage') || ind.includes('catering')) {
    selectedKey = 'food'
  }
  // E-Commerce / Online Retail
  else if (ind.includes('commerce') || ind.includes('shop') || ind.includes('store') || ind.includes('fashion') || ind.includes('goods') || ind.includes('marketplace')) {
    selectedKey = 'ecommerce'
  }
  // Healthcare / MedTech
  else if (ind.includes('health') || ind.includes('medical') || ind.includes('clinic') || ind.includes('pharma') || ind.includes('hospital') || ind.includes('medtech') || ind.includes('wellness') || ind.includes('dental') || ind.includes('doctor')) {
    selectedKey = 'healthcare'
  }
  // Education / EdTech
  else if (ind.includes('education') || ind.includes('edtech') || ind.includes('school') || ind.includes('learning') || ind.includes('training') || ind.includes('course') || ind.includes('tutor') || ind.includes('coaching')) {
    selectedKey = 'education'
  }
  // Logistics / Supply Chain
  else if (ind.includes('logistic') || ind.includes('transport') || ind.includes('courier') || ind.includes('supply chain') || ind.includes('warehouse') || ind.includes('freight') || ind.includes('shipping')) {
    selectedKey = 'logistics'
  }
  // Physical Retail
  else if (ind.includes('retail') || ind.includes('supermarket') || ind.includes('grocery') || ind.includes('jewel') || ind.includes('boutique') || ind.includes('kirana')) {
    selectedKey = 'retail'
  }
  // FinTech / Finance
  else if (ind.includes('fintech') || ind.includes('finance') || ind.includes('payment') || ind.includes('lending') || ind.includes('banking') || ind.includes('insurance') || ind.includes('wallet') || ind.includes('invest')) {
    selectedKey = 'fintech'
  }

  const baseData = COMPLIANCE_DATABASE[selectedKey] || COMPLIANCE_DATABASE.tech

  // Build standard step-by-step registration guide
  const registrationSteps = [
    'Incorporate Business Entity (Private Limited / LLP / OPC / Sole Proprietorship)',
    'Apply for PAN & TAN for Business Entity',
    'Open Business Bank Account with Corporate Net Banking',
    'Obtain GST & Industry-Specific Registrations (FSSAI/MSME/Drug License etc.)',
    'Apply for Startup India Recognition & Intellectual Property (Trademarks/Patents)',
    'Ensure Data Privacy Compliance (DPDP Act / GDPR for international operations)',
  ]

  const governmentRegistrations = baseData.registrations.map((r) => ({
    title: r.title,
    status: r.status,
    priority: r.priority,
    fee: r.estimatedFee,
    time: r.processingTime,
  }))

  const legalRecommendations = `For a ${industry || 'new'} startup operating as a ${businessType || 'business'}, prioritize obtaining ${baseData.registrations[0]?.title} and ${baseData.registrations[1]?.title} before commencing commercial transactions to avoid statutory penalties.`

  return {
    checklist: baseData.registrations,
    governmentRegistrations,
    licenses: baseData.licenses,
    legalDocs: baseData.legalDocs,
    registrationSteps,
    legalRecommendations,
    detectedIndustry: selectedKey,
  }
}

/**
 * Get all available industry keys for the override selector
 */
export function getAllIndustries() {
  return [
    { key: 'food', label: '🍽️ Food & Beverage / Delivery' },
    { key: 'ecommerce', label: '🛒 E-Commerce / Online Retail' },
    { key: 'tech', label: '💻 Tech / SaaS / AI Software' },
    { key: 'healthcare', label: '🏥 Healthcare / MedTech' },
    { key: 'education', label: '📚 Education / EdTech' },
    { key: 'logistics', label: '🚚 Logistics / Supply Chain' },
    { key: 'retail', label: '🏪 Physical Retail / Store' },
    { key: 'fintech', label: '💳 Finance / FinTech / Payments' },
  ]
}
