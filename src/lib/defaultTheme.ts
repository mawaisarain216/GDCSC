import type { HomepageSection, Theme } from "./types";

// Institutional green / teal / gold palette — designed for a Sindh government
// degree college: authoritative, academic, still feels current in 2026.
export const DEFAULT_THEME: Theme = {
  fontHeading: "Poppins",
  fontBody: "Inter",
  baseFontSize: "16",
  h1Size: "48",
  h2Size: "34",
  h3Size: "24",
  colorPrimary: "#0B5D46",
  colorPrimaryDark: "#073F30",
  colorSecondary: "#116A55",
  colorAccent: "#D4A72C",
  colorBg: "#F7F7F4",
  colorSurface: "#FFFFFF",
  colorText: "#1F2A24",
  colorTextMuted: "#5B6B63",
  colorHeaderBg: "#0B5D46",
  colorHeaderText: "#FFFFFF",
  colorFooterBg: "#0A3D2E",
  colorFooterText: "#E7EFEA",
  radius: "12",
  containerWidth: "1240",
  sectionSpacing: "88",
  buttonStyle: "solid",
  headerStyle: "standard",
  stickyHeader: true,
  showTopBar: true,
  darkMode: false,
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { key: "hero", label: "Hero Slider", visible: true },
  { key: "quickLinks", label: "Quick Access Cards", visible: true },
  { key: "about", label: "About the College", visible: true },
  { key: "whyChooseUs", label: "Why Choose Us (features grid)", visible: true },
  { key: "principal", label: "Principal's Message", visible: true },
  { key: "programs", label: "Programs Offered", visible: true },
  { key: "achievements", label: "Achievements / Stats", visible: true },
  { key: "newsAnnouncements", label: "Latest News & Announcements (side-by-side slider)", visible: true },
  { key: "gallery", label: "Campus Gallery", visible: true },
  { key: "cta", label: "Admissions Call-To-Action", visible: true },
];

export const FONT_OPTIONS = [
  "Inter",
  "Poppins",
  "Roboto",
  "Lato",
  "Merriweather",
  "Nunito",
  "Playfair Display",
  "Source Sans 3",
  "Noto Nastaliq Urdu",
];
