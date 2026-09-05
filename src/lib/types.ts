export interface SocialLink {
  id: string;
  label: string;
  platform: string;
  url: string;
  enabled: boolean;
  showInTopBar: boolean;
  showInFooter: boolean;
  order: number;
}

export interface HeaderUtilityLink {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
  openInNewTab: boolean;
  order: number;
}

export interface Settings {
  id: number;
  siteName: string;
  shortName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  email: string;
  address: string;
  mapEmbedUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  socialLinksJson: string;
  headerUtilityLinksJson: string;
  topBarSocialLimit: number;
  footerSocialLimit: number;
  metaTitle: string;
  metaDescription: string;
  affiliationText: string;
  themeJson: string;
  homepageSectionsJson: string;
  customCss: string;
  updatedAt: string;
}

export interface Theme {
  fontHeading: string;
  fontBody: string;
  baseFontSize: string;
  h1Size: string;
  h2Size: string;
  h3Size: string;
  colorPrimary: string;
  colorPrimaryDark: string;
  colorSecondary: string;
  colorAccent: string;
  colorBg: string;
  colorSurface: string;
  colorText: string;
  colorTextMuted: string;
  colorHeaderBg: string;
  colorHeaderText: string;
  colorFooterBg: string;
  colorFooterText: string;
  radius: string;
  containerWidth: string;
  sectionSpacing: string;
  buttonStyle: "solid" | "outline" | "soft";
  headerStyle: "standard" | "centered" | "minimal";
  stickyHeader: boolean;
  showTopBar: boolean;
  darkMode: boolean;
}

export interface HomepageSection {
  key: string;
  label: string;
  visible: boolean;
  title?: string;
}

export interface ContentBlock {
  id: string;
  key: string;
  label: string;
  type: "TEXT" | "HTML" | "IMAGE";
  value: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  location: "HEADER" | "FOOTER";
  order_num: number;
  openInNewTab: number;
  parentId: string | null;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  fileUrl: string;
  isPinned: number;
  publishedAt: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  slug: string;
  type: "NEWS" | "EVENT";
  body: string;
  coverImageUrl: string;
  eventDate: string | null;
  publishedAt: string;
}

export interface Slide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  order_num: number;
  isActive: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
  order_num: number;
}

export interface DocumentFile {
  id: string;
  title: string;
  fileUrl: string;
  category: string;
  uploadedAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  headName: string;
  headFacultyId: string | null;
  imageUrl: string;
  order_num: number;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  level: string;
  duration: string;
  description: string;
  departmentId: string | null;
  order_num: number;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  photoUrl: string;
  email: string;
  departmentId: string | null;
  order_num: number;
}

export interface Achievement {
  id: string;
  label: string;
  value: string;
  icon: string;
  order_num: number;
}

export interface AdmissionProgram {
  id: string;
  name: string;
  faculty: string;
  seats: number;
  isOpen: number;
  order_num: number;
}

export interface AdmissionFormField {
  id: string;
  section: "FACULTY" | "EDUCATIONAL" | "PERSONAL" | "DOCUMENTS";
  label: string;
  fieldKey: string;
  fieldType: "text" | "select" | "radio" | "checkbox" | "date" | "file" | "textarea";
  options: string;
  required: number;
  enabled: number;
  order_num: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: number;
  submittedAt: string;
}

export type AdmissionStatus = "RECEIVED" | "UNDER_REVIEW" | "DOCS_VERIFIED" | "SELECTED" | "WAITLISTED" | "REJECTED";

export interface AdmissionApplication {
  id: string;
  applicationNo: string;
  programChoice: string;
  /** FK-style link to admission_programs.id — the source of truth for which
   *  program this application is for. programChoice stays as a denormalized
   *  display name (kept for applications submitted before this field existed,
   *  and so the record stays readable even if the program is later renamed
   *  or removed). */
  admissionProgramId: string;
  dataJson: string;
  photoUrl: string;
  status: AdmissionStatus;
  /** Required whenever status is REJECTED — shown back to the applicant. */
  rejectionReason: string;
  /** Timestamp of the most recent status change (empty until the first one). */
  reviewedAt: string;
  submittedAt: string;
}
