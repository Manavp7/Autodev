const categories = [
  "Engine Components", "Body Parts", "Electrical Systems", 
  "Fasteners & Hardware", "Raw Materials", "Plastic Molded Parts", 
  "Rubber & Sealing", "Electronics/ECU", "Powertrain", "Braking Systems"
];

export const systemUsers = [
  { id: 'U001', username: 'admin', password: '123', role: 'ADMIN', name: 'Rajesh Kumar', designation: 'General Manager - SCM' },
  { id: 'U002', username: 'buyer1', password: '123', role: 'BUYER', name: 'Amit Shah', designation: 'Sr. Purchase Executive' },
  { id: 'U003', username: 'manager1', password: '123', role: 'MANAGER', name: 'Sanjay Dutt', designation: 'Department Head' },
  { id: 'U004', username: 'quality1', password: '123', role: 'QUALITY', name: 'Vikram Singh', designation: 'IQC Lead' },
  { id: 'U005', username: 'finance1', password: '123', role: 'FINANCE', name: 'Priya Iyer', designation: 'Accounts Manager' },
  { id: 'U006', username: 'supplier1', password: '123', role: 'SUPPLIER', name: 'Bosch Logistics', designation: 'Vendor Contact' },
];

const supplierNames = [
  "Bosch India Pvt Ltd", "Mahindra Auto Parts", "TATA AutoComp", 
  "Motherson Sumi", "Minda Industries", "Varroc Engineering", 
  "Sandhar Technologies", "Subros Ltd", "Bharat Forge", "SKF India", 
  "Schaeffler India", "Lumax Industries", "Roots Industries", 
  "Suprajit Engineering", "Rico Auto", "Endurance Tech", "Gabriel India",
  "JK Tyres", "Apollo Tyres", "Ceat Ltd", "Exide Industries",
  "Amara Raja", "Lucas TVS", "Brakes India", "Wheels India"
];

export const partTemplates = [
  { prefix: "PN-ENG", name: "Crankshaft", category: "Engine Components", basePrice: 12500 },
  { prefix: "PN-ENG", name: "Piston Assembly", category: "Engine Components", basePrice: 4200 },
  { prefix: "PN-BOD", name: "Door Panel Assembly", category: "Body Parts", basePrice: 8500 },
  { prefix: "PN-BOD", name: "Front Bumper", category: "Body Parts", basePrice: 6200 },
  { prefix: "PN-ELE", name: "Wiring Harness", category: "Electrical Systems", basePrice: 3800 },
  { prefix: "PN-FAS", name: "M10 Bolt Set", category: "Fasteners & Hardware", basePrice: 450 },
  { prefix: "PN-BRK", name: "Brake Disc", category: "Braking Systems", basePrice: 2800 },
  { prefix: "PN-RAW", name: "Steel Coil Cold Rolled", category: "Raw Materials", basePrice: 65000 },
  { prefix: "PN-ECU", name: "Engine Control Unit", category: "Electronics/ECU", basePrice: 18500 },
];

export const generateSuppliers = (count = 168) => {
  const suppliers = [];
  for (let i = 0; i < count; i++) {
    const isTopSupplier = i < supplierNames.length;
    const regionalSuffixes = ["Ind", "Tech", "Auto", "Global", "Components", "Solutions", "Precision", "Dynamics"];
    const suffix = regionalSuffixes[i % regionalSuffixes.length];
    const name = isTopSupplier ? supplierNames[i] : `Alpha ${suffix} Co ${100 + i}`;
    const category = categories[i % categories.length];
    const otd = 70 + Math.random() * 29; // 70 to 99
    const iqc = 75 + Math.random() * 24; // 75 to 99
    const score = (otd * 0.5 + iqc * 0.5);
    
    let rating = 'Bronze';
    if (score >= 90) rating = 'Gold';
    else if (score >= 80) rating = 'Silver';
    else if (score < 75) rating = 'Critical';

    suppliers.push({
      id: `SUP-${1000 + i}`,
      name,
      category,
      tier: Math.random() > 0.7 ? "Tier 1" : "Tier 2",
      certifications: ["IATF 16949", "ISO 14001"].slice(0, Math.ceil(Math.random() * 2)),
      auditScore: (75 + Math.random() * 20).toFixed(1),
      riskRating: rating === 'Critical' ? 'High' : rating === 'Bronze' ? 'Medium' : 'Low',
      otd: otd.toFixed(1),
      iqc: iqc.toFixed(1),
      ppap: (80 + Math.random() * 20).toFixed(1),
      ncrCount: Math.floor(Math.random() * 10),
      score: score.toFixed(1),
      rating,
      status: rating === 'Critical' ? 'Hold' : 'Active',
      onboardingDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      spendYTD: Math.floor(Math.random() * 50000000) + 1000000,
    });
  }
  return suppliers;
};

export const generatePOs = (suppliers, count = 847) => {
  const pos = [];
  const statuses = ['Pending', 'Approved', 'Acknowledged', 'Shipped', 'Received', 'Closed'];
  
  for (let i = 0; i < count; i++) {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const part = partTemplates[Math.floor(Math.random() * partTemplates.length)];
    const qty = Math.floor(Math.random() * 1000) + 50;
    const value = qty * part.basePrice;
    
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    if (Math.random() > 0.5) status = 'Closed';
    if (i < 47) status = 'Overdue'; // Ensure some overdue POs
    
    const daysOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + daysOffset);

    pos.push({
      id: `PO-2024-${3000 + i}`,
      date: new Date(Date.now() - Math.random() * 5000000000).toISOString().split('T')[0],
      supplier: supplier.name,
      supplierId: supplier.id,
      value: value,
      partNumber: `${part.prefix}-${Math.floor(Math.random() * 8000) + 1000}`,
      partDescription: part.name,
      qty,
      deliveryDate: deliveryDate.toISOString().split('T')[0],
      status,
      daysToDelivery: daysOffset,
      lineItems: Math.floor(Math.random() * 5) + 1,
    });
  }
  return pos;
};

export const generateShortages = (suppliers, count = 520) => {
  const shortages = [];
  for(let i=0; i<count; i++) {
    const part = partTemplates[Math.floor(Math.random() * partTemplates.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    
    let severity = 'Normal';
    if (i < 40) severity = 'Critical';
    else if (i < 150) severity = 'High';

    shortages.push({
      id: `SH-${5000 + i}`,
      partNumber: `${part.prefix}-${Math.floor(Math.random() * 8000) + 1000}`,
      description: part.name,
      supplier: supplier.name,
      requiredQty: Math.floor(Math.random() * 500) + 100,
      availableStock: severity === 'Critical' ? 0 : severity === 'High' ? Math.floor(Math.random() * 50) + 1 : Math.floor(Math.random() * 200) + 50,
      daysLate: severity === 'Critical' ? Math.floor(Math.random() * 10) + 1 : 0,
      status: severity === 'Critical' ? 'Expedited' : 'Pending',
      severity
    });
  }
  return shortages;
};

export const generatePRs = (count = 134) => {
  const prs = [];
  const statuses = ['Pending Approval', 'Approved', 'Rejected', 'Converted'];
  const departments = ['Production', 'Maintenance', 'R&D', 'Engineering', 'IT', 'Tool Room'];
  
  for(let i=0; i<count; i++) {
    const part = partTemplates[Math.floor(Math.random() * partTemplates.length)];
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    
    if (Math.random() > 0.4) status = 'Approved';
    if (i < 34) status = 'Pending Approval';
    if (i >= 34 && i < 39) status = 'Rejected';
    
    prs.push({
      id: `PR-2024-${8000 + i}`,
      date: new Date(Date.now() - Math.random() * 2000000000).toISOString().split('T')[0],
      requestor: `Employee ${Math.floor(Math.random() * 50) + 1}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      partNumber: `${part.prefix}-${Math.floor(Math.random() * 8000) + 1000}`,
      description: part.name,
      qty: Math.floor(Math.random() * 500) + 10,
      uom: part.category.includes('Raw') ? 'Kg' : 'Nos',
      requiredDate: new Date(Date.now() + Math.random() * 5000000000).toISOString().split('T')[0],
      estCost: Math.floor(Math.random() * 500) * part.basePrice,
      status,
      daysPending: status === 'Pending Approval' ? Math.floor(Math.random() * 10) + 1 : 0,
      approver: `Manager ${Math.floor(Math.random() * 10) + 1}`
    });
  }
  return prs;
};

export const generateRFQs = (count = 186) => {
  const rfqs = [];
  const statuses = ['Draft', 'Awaiting Quotes', 'Under Evaluation', 'Awarded', 'Closed'];
  for(let i=0; i<count; i++) {
    const part = partTemplates[Math.floor(Math.random() * partTemplates.length)];
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    if (Math.random() > 0.3) status = 'Awarded';
    if (i < 7) status = 'Awaiting Quotes';
    if (i >= 7 && i < 12) status = 'Under Evaluation';

    rfqs.push({
      id: `RFQ-2024-${1000 + i}`,
      prReference: `PR-2024-${8000 + i}`,
      description: part.name,
      invitedSuppliers: Math.floor(Math.random() * 5) + 3,
      quotesReceived: status === 'Awarded' || status === 'Under Evaluation' ? Math.floor(Math.random() * 3) + 2 : (status === 'Awaiting Quotes' ? Math.floor(Math.random() * 2) : 0),
      deadline: new Date(Date.now() + (Math.random() * 20 - 10) * 86400000).toISOString().split('T')[0],
      status,
      daysRemaining: status === 'Awaiting Quotes' ? Math.floor(Math.random() * 10) + 1 : 0
    });
  }
  return rfqs;
};

export const generateGRNs = (suppliers, count = 300) => {
  const grns = [];
  const statuses = ['Accepted', 'Rejected', 'Conditional Accept', 'Pending IQC'];
  for(let i=0; i<count; i++) {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const part = partTemplates[Math.floor(Math.random() * partTemplates.length)];
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    if (Math.random() > 0.2) status = 'Accepted';
    if (i < 8) status = 'Pending IQC';
    if (i >= 8 && i < 10) status = 'Rejected';

    const receivedQty = Math.floor(Math.random() * 500) + 50;
    const rejectedQty = status === 'Rejected' ? receivedQty : status === 'Conditional Accept' ? Math.floor(receivedQty * 0.1) : 0;
    
    grns.push({
      id: `GRN-2024-${4000 + i}`,
      date: new Date(Date.now() - Math.random() * 1000000000).toISOString().split('T')[0],
      poReference: `PO-2024-${3000 + i}`,
      supplier: supplier.name,
      material: part.name,
      receivedQty,
      acceptedQty: receivedQty - rejectedQty,
      rejectedQty,
      status,
      warehouse: `WH-${Math.floor(Math.random() * 3) + 1}`,
      threeWayMatch: status === 'Accepted',
    });
  }
  return grns;
};

export const generateContracts = (suppliers, count = 284) => {
  const contracts = [];
  const types = ['Rate Contract', 'Annual Maintenance', 'Project Specific', 'NDA'];
  for(let i=0; i<count; i++) {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const daysToExpiry = Math.floor(Math.random() * 365) - 30; // some negative (expired)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysToExpiry);
    
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1);

    contracts.push({
      id: `CNT-2024-${100 + i}`,
      supplier: supplier.name,
      type: types[Math.floor(Math.random() * types.length)],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 10000000) + 500000,
      status: daysToExpiry < 0 ? 'Expired' : 'Active',
      daysToExpiry,
      paymentTerms: 'Net 45 Days',
    });
  }
  return contracts;
};

// Initialize singletons
export const globalSuppliers = generateSuppliers(500);
export const globalPOs = generatePOs(globalSuppliers, 1247);
export const globalShortages = generateShortages(globalSuppliers, 520);
export const globalPRs = generatePRs(534);
export const globalRFQs = generateRFQs(586);
export const globalGRNs = generateGRNs(globalSuppliers, 600);
export const globalContracts = generateContracts(globalSuppliers, 584);

// Dashboard KPI Data
export const dashboardKpis = {
  totalActivePOs: 1247,
  poTrend: 12, // %
  supplierOTD: 87.4,
  otdTrend: -2.1,
  openShortages: { critical: 23, total: 131 },
  poCycleTime: 4.2,
  cycleTimeTrend: -0.8,
  costSavingsMTD: "1.24 Cr",
  savingsTrend: 18,
  contractCoverage: 82
};

export const monthlyPOVolume = [
  { month: 'Jan', volume: 145 }, { month: 'Feb', volume: 162 }, { month: 'Mar', volume: 178 },
  { month: 'Apr', volume: 155 }, { month: 'May', volume: 190 }, { month: 'Jun', volume: 205 },
  { month: 'Jul', volume: 198 }, { month: 'Aug', volume: 223 }, { month: 'Sep', volume: 187 },
  { month: 'Oct', volume: 210 }, { month: 'Nov', volume: 234 }, { month: 'Dec', volume: 248 }
];

export const formatCurrency = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
};
