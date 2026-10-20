export const BIG_FOUR_COMPONENTS = [
  {
    id: "neural-network",
    name: "Ongoing project",
    tag: "NEURAL NETWORK",
    shelf: "Research & Development",
    category: "Soft Computing & Manufacturing Process Modeling",
    icon: "🧠",
    type: "project",
    title: "Ongoing project",
    subtitle: "Process Modeling & Soft Computing",
    content: "Working on forward and reverse modelling of manufacturing process using soft computing tools"
  },
  {
    id: "quant-alpha",
    name: "Research Consultant",
    tag: "QUANT ALPHA RESEARCH",
    shelf: "Work Experience · WorldQuant",
    category: "World Quant",
    icon: "📈",
    type: "experience",
    title: "Research Consultant",
    roleLine: "Research Consultant February 2026 – Present",
    company: "World Quant",
    points: [
      "Developed and backtested market-neutral alpha signals across global equity markets using the WorldQuant Brain platform, ensuring robustness through rigorous validation on historical and live data.",
      "Designed and optimized predictive trading algorithms using statistical and quantitative techniques to identify non-obvious patterns in financial time series data.",
      "Built and validated systematic trading signals, focusing on performance metrics such as Sharpe ratio, turnover, and drawdown to create deployable alpha strategies."
    ]
  },
  {
    id: "motorcycle",
    name: "Internship",
    tag: "QUALITY CONTROL",
    shelf: "Work Experience · Hero MotoCorp",
    category: "Hero MotoCorp Gurugram, Haryana, India",
    icon: "🏍️",
    type: "experience",
    title: "Internship",
    roleLine: "Quality Control Intern 2 Weeks",
    company: "Hero MotoCorp Gurugram, Haryana, India",
    points: [
      "Worked in the Final Inspection Department, gaining exposure to end-of-line quality inspection processes.",
      "Observed quality inspection activities for Xoom 125 and scooters manufactured for European export markets.",
      "Studied practical applications of Statistical Quality Control (SQC) concepts, including control charts and process monitoring.",
      "Gained exposure to manufacturing quality procedures, inspection standards, defect identification, and quality assurance practices."
    ]
  },
  {
    id: "coke-plant-steel",
    name: "Internship",
    tag: "COKE PLANT STEEL",
    shelf: "Work Experience · Tata Steel",
    category: "TATA STEEL Jamshedpur, Jharkhand, India",
    icon: "🏭",
    type: "experience",
    title: "Internship",
    roleLine: "Intern December 2025 – January 2026",
    company: "TATA STEEL Jamshedpur, Jharkhand, India",
    points: [
      "Conducted a comprehensive study on tuyere failure mechanisms, analyzing thermal stress factors, abrasion patterns from descending burden, and cooling inefficiencies to recommend design enhancements for extended service life.",
      "Studied the thermodynamics of iron making, phase transformation studies, and microstructure-property correlation, creating simplified technical modules to explain complex reduction reactions and slag formation processes.",
      "Led a risk assessment project for the Coke Oven Batteries, developing case studies on past incidents to enhance employee awareness of process safety management (PSM) and hazard identification."
    ]
  }
];

export const SHELVES = [
  {
    id: 0,
    name: "Shelf 1 — Engineering Systems & Metallurgy",
    shortName: "Systems & Metallurgy",
    tagline: "Heavy Pyrometallurgy & Automotive Kinematics",
    components: [BIG_FOUR_COMPONENTS[3], BIG_FOUR_COMPONENTS[2]] // Coke Plant Steel & Motorcycle
  },
  {
    id: 1,
    name: "Shelf 2 — Computation & Quantitative Finance",
    shortName: "AI & Quant Finance",
    tagline: "Statistical Alpha Engines & Deep Neural Architectures",
    components: [BIG_FOUR_COMPONENTS[1], BIG_FOUR_COMPONENTS[0]] // Quant Alpha & Neural Network
  }
];

export const ALL_COMPONENTS = BIG_FOUR_COMPONENTS;
