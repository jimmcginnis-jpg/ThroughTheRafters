// school.config.js — The ONLY file that changes per school.
// Every component reads from this. To stand up a new school:
// 1. Fork the repo
// 2. Replace this file
// 3. Replace data/*.json
// 4. Deploy

const config = {
  // ─── Identity ─────────────────────────────────────────
  school: "Kentucky",
  mascot: "Wildcats",
  shortName: "UK",
  conference: "SEC",
  location: "Lexington, Kentucky",
  arena: "Rupp Arena",
  city: "Lexington",

  // ─── Site Branding ────────────────────────────────────
  siteName: "Through the Rafters",
  siteTagline: "Where Are They Now?",
  siteUrl: "https://www.throughtherafters.com",
  domain: "throughtherafters.com",
  siteDescription:
    "The complete documentary profile series covering every significant player across eight eras of Kentucky basketball. How they got to Kentucky. What made them special. What happened after. Where they are now.",
  heroSubtitle: "Rupp \u2022 Pitino \u2022 Calipari \u2022 Pope",
  copyrightHolder: "Through the Rafters",

  // ─── Hero Title (supports two-tone split) ─────────────
  heroTitle: {
    line1: "Through the",
    line2: "Rafters",
  },

  // ─── Header Logo (supports two-tone split) ────────────
  headerLogo: {
    line1: "THROUGH THE",
    line2: "RAFTERS",
  },

  // ─── Colors ───────────────────────────────────────────
  // These map to Tailwind classes: bg-school-primary, text-school-accent, etc.
  colors: {
    primary: "#0033A0",   // Main brand color (Kentucky Blue / Duke Navy)
    accent: "#FFFFFF",    // Accent color (Duke Gold / UK White)
    accentLight: "#C8C9C7", // Lighter accent (Duke Gold Light / UK Silver)
    dark: "#0033A0",      // Dark background (header, hero, footer)
    cream: "#F8F9FA",     // Page background
    text: "#0A1628",      // Body text
  },

  // ─── Fonts ────────────────────────────────────────────
  fonts: {
    display: "Oswald",
    displayFallback: "Arial, sans-serif",
    body: "Source Sans 3",
    bodyFallback: "Arial, sans-serif",
    mono: "JetBrains Mono",
    monoFallback: "monospace",
    // Google Fonts import URL
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;700&display=swap",
  },

  // ─── Eras ─────────────────────────────────────────────
  // Defined here for the footer, nav, and any hardcoded era references.
  // Full era data (descriptions, etc.) lives in data/players.json.
  eras: [
    { key: "rupp", num: "I", name: "The Rupp Dynasty", years: "1930\u201372" },
    { key: "hall", num: "II", name: "The Hall Years", years: "1972\u201385" },
    { key: "sutton", num: "III", name: "The Sutton Era", years: "1985\u201389" },
    { key: "pitino", num: "IV", name: "The Pitino Resurrection", years: "1989\u201397" },
    { key: "tubby", num: "V", name: "The Tubby Smith Years", years: "1997\u201307" },
    { key: "gillispie", num: "VI", name: "The Gillispie Interlude", years: "2007\u201309" },
    { key: "calipari", num: "VII", name: "The Calipari Era", years: "2009\u201324" },
    { key: "pope", num: "VIII", name: "The Pope Era", years: "2024\u2013" },
  ],

  // ─── About Page ───────────────────────────────────────
  about: {
    intro:
      "an independent documentary profile series covering every significant player across eight eras of Kentucky basketball \u2014 from Adolph Rupp\u2019s dynasty through the Mark Pope era.",
    profileStructure:
      "Each profile tells four stories: how the player got to Kentucky, what made them special in Lexington, what happened after they left, and where they are now.",
    disclaimer:
      "This project is not affiliated with the University of Kentucky, UK Athletics, or the NCAA. All content is original research and commentary. Player statistics sourced from public records.",
  },

  // ─── Bio Section Labels ───────────────────────────────
  bioTabs: {
    road: { key: "road", label: "Road to " }, // + school name appended
    school: { key: "kentucky", label: "At Kentucky" },
    after: { key: "after", label: "After Kentucky" },
    now: { key: "now", label: "Where Are They Now" },
  },

  // ─── Charity / Community ──────────────────────────────
  defaultCharity: {
    name: "Kentucky Children\u2019s Hospital",
    url: "https://ukhealthcare.uky.edu/giving",
    description:
      "Through the Rafters supports Kentucky Children\u2019s Hospital, continuing the program\u2019s long-standing commitment to the Lexington community.",
  },

  // ─── Social ───────────────────────────────────────────
  social: {
    twitter: "@ThroughRafters",
    hashtags: "#ThroughTheRafters #BBN",
  },

  // ─── External References ──────────────────────────────
  athleticsSite: "ukathletics.com",
  athleticsSiteLabel: "UKAthletics.com",
  schoolWikipedia: "University_of_Kentucky",
  newspaperArchive: "Kentucky Kernel",
};

module.exports = config;
