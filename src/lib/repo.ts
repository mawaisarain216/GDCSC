import { db, genId, nowIso } from "./db";
import { DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_THEME } from "./defaultTheme";
import type {
  Achievement,
  AdmissionApplication,
  AdmissionFormField,
  AdmissionProgram,
  ContactMessage,
  ContentBlock,
  Department,
  DocumentFile,
  FacultyMember,
  GalleryImage,
  MenuItem,
  NewsEvent,
  Notice,
  Program,
  Settings,
  Slide,
  Theme,
  HomepageSection,
} from "./types";

/* ----------------------------- Settings / Theme ----------------------------- */

export async function getSettings() {
  let row = await db.prepare("SELECT * FROM settings WHERE id = 1").get() as unknown as Settings | undefined;
  if (!row) {
    await db.prepare(
      `INSERT INTO settings (id, themeJson, homepageSectionsJson, updatedAt) VALUES (1, ?, ?, ?)`
    ).run(JSON.stringify(DEFAULT_THEME), JSON.stringify(DEFAULT_HOMEPAGE_SECTIONS), nowIso());
    row = await db.prepare("SELECT * FROM settings WHERE id = 1").get() as unknown as Settings;
  }
  return row;
}

export async function getTheme() {
  const s = await getSettings();
  try {
    return { ...DEFAULT_THEME, ...JSON.parse(s.themeJson || "{}") };
  } catch {
    return DEFAULT_THEME;
  }
}

export async function getHomepageSections() {
  const s = await getSettings();
  try {
    const parsed = JSON.parse(s.homepageSectionsJson || "[]");
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* fall through */
  }
  return DEFAULT_HOMEPAGE_SECTIONS;
}

export async function updateSettings(patch: Partial<Settings>) {
  const current = await getSettings();
  const merged = { ...current, ...patch };
  await db.prepare(
    `UPDATE settings SET siteName=?, shortName=?, tagline=?, logoUrl=?, faviconUrl=?, phone=?, email=?, address=?, mapEmbedUrl=?, facebookUrl=?, twitterUrl=?, youtubeUrl=?, instagramUrl=?, metaTitle=?, metaDescription=?, affiliationText=?, themeJson=?, homepageSectionsJson=?, customCss=?, updatedAt=? WHERE id=1`
  ).run(
    merged.siteName,
    merged.shortName,
    merged.tagline,
    merged.logoUrl,
    merged.faviconUrl,
    merged.phone,
    merged.email,
    merged.address,
    merged.mapEmbedUrl,
    merged.facebookUrl,
    merged.twitterUrl,
    merged.youtubeUrl,
    merged.instagramUrl,
    merged.metaTitle,
    merged.metaDescription,
    merged.affiliationText,
    merged.themeJson,
    merged.homepageSectionsJson,
    merged.customCss,
    nowIso()
  );
  return getSettings();
}

export async function updateTheme(theme: Theme) {
  return updateSettings({ themeJson: JSON.stringify(theme) });
}

export async function updateHomepageSections(sections: HomepageSection[]) {
  return updateSettings({ homepageSectionsJson: JSON.stringify(sections) });
}

/* ----------------------------- Content blocks ----------------------------- */

const CONTENT_DEFAULTS: { key: string; label: string; type: ContentBlock["type"]; value: string }[] = [
  { key: "home.hero.eyebrow", label: "Hero eyebrow text", type: "TEXT", value: "Government of Sindh · Directorate General of Colleges" },
  { key: "home.hero.title", label: "Hero title", type: "TEXT", value: "Govt. Boys Degree College Shahpur Chakar" },
  { key: "home.hero.subtitle", label: "Hero subtitle", type: "TEXT", value: "Empowering the young men of Shahpur Chakar and Taluka Shahdadpur through quality higher secondary and degree education in Pre-Medical, Pre-Engineering, Arts and Commerce." },
  { key: "home.about.title", label: "About section title", type: "TEXT", value: "About Our College" },
  { key: "home.about.body", label: "About section body", type: "HTML", value: "<p>Govt. Boys Degree College Shahpur Chakar — a College of Excellence — has served the students of Shahpur Chakar and the surrounding villages of Taluka Shahdadpur, District Sanghar, offering Intermediate and Degree programs across Pre-Medical, Pre-Engineering, Arts and Commerce. (Sample/dummy text — replace from Admin → Content.)</p>" },
  { key: "principal.name", label: "Principal name", type: "TEXT", value: "Prof. (Sample Name)" },
  { key: "principal.photoUrl", label: "Principal photo", type: "IMAGE", value: "" },
  { key: "principal.message", label: "Principal's message", type: "HTML", value: "<p>It is my privilege to welcome you to Govt. Boys Degree College Shahpur Chakar. Our institution remains committed to academic excellence, discipline and the holistic development of every student who walks through our gates. (Sample/dummy message — replace from Admin → Content.)</p>" },
  { key: "about.page.body", label: "About page — full history & mission", type: "HTML", value: "<p>Govt. Boys Degree College Shahpur Chakar is a public sector degree college in Taluka Shahdadpur, District Sanghar, Sindh. This is placeholder/sample content to be replaced by the college administration with verified history, mission and vision statements.</p>" },
  { key: "contact.intro", label: "Contact page intro text", type: "TEXT", value: "We would love to hear from you. Reach out with admissions queries, academic questions or general feedback." },
];

export async function ensureContentDefaults() {
  const insert = db.prepare(
    `INSERT OR IGNORE INTO content_blocks (id, key, label, type, value, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`
  );
  for (const c of CONTENT_DEFAULTS) {
    await insert.run(genId("cb"), c.key, c.label, c.type, c.value, nowIso());
  }
}

export async function getAllContentBlocks() {
  await ensureContentDefaults();
  return await db.prepare("SELECT * FROM content_blocks ORDER BY key ASC").all() as unknown as ContentBlock[];
}

export async function getContent(key: string, fallback = "") {
  const row = await db.prepare("SELECT value FROM content_blocks WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row ? row.value : fallback;
}

export async function setContent(key: string, value: string) {
  await db.prepare("UPDATE content_blocks SET value = ?, updatedAt = ? WHERE key = ?").run(
    value,
    nowIso(),
    key
  );
}

/* ----------------------------- Menu ----------------------------- */

export async function getMenu(location: "HEADER" | "FOOTER") {
  return db
    .prepare("SELECT * FROM menu_items WHERE location = ? ORDER BY order_num ASC")
    .all(location) as unknown as MenuItem[];
}

export async function getAllMenuItems() {
  return await db.prepare("SELECT * FROM menu_items ORDER BY location ASC, order_num ASC").all() as unknown as MenuItem[];
}

export async function createMenuItem(data: Omit<MenuItem, "id">) {
  const id = genId("menu");
  await db.prepare(
    `INSERT INTO menu_items (id, label, url, location, order_num, openInNewTab, parentId) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.label, data.url, data.location, data.order_num, data.openInNewTab, data.parentId);
  return id;
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  const current = await db.prepare("SELECT * FROM menu_items WHERE id = ?").get(id) as unknown as MenuItem;
  const m = { ...current, ...data };
  await db.prepare(
    `UPDATE menu_items SET label=?, url=?, location=?, order_num=?, openInNewTab=?, parentId=? WHERE id=?`
  ).run(m.label, m.url, m.location, m.order_num, m.openInNewTab, m.parentId, id);
}

export async function deleteMenuItem(id: string) {
  await db.prepare("DELETE FROM menu_items WHERE id = ? OR parentId = ?").run(id, id);
}

/* ----------------------------- Notices ----------------------------- */

export async function getNotices(limit?: number) {
  const sql = `SELECT * FROM notices ORDER BY isPinned DESC, publishedAt DESC${limit ? " LIMIT ?" : ""}`;
  return (limit ? await db.prepare(sql).all(limit) : await db.prepare(sql).all()) as unknown as Notice[];
}

export async function getNotice(id: string) {
  return await db.prepare("SELECT * FROM notices WHERE id = ?").get(id) as unknown as Notice | undefined;
}

export async function createNotice(data: Omit<Notice, "id">) {
  const id = genId("notice");
  await db.prepare(
    `INSERT INTO notices (id, title, body, category, fileUrl, isPinned, publishedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.title, data.body, data.category, data.fileUrl, data.isPinned, data.publishedAt);
  return id;
}

export async function updateNotice(id: string, data: Partial<Notice>) {
  const current = (await getNotice(id))!;
  const n = { ...current, ...data };
  await db.prepare(
    `UPDATE notices SET title=?, body=?, category=?, fileUrl=?, isPinned=?, publishedAt=? WHERE id=?`
  ).run(n.title, n.body, n.category, n.fileUrl, n.isPinned, n.publishedAt, id);
}

export async function deleteNotice(id: string) {
  await db.prepare("DELETE FROM notices WHERE id = ?").run(id);
}

/* ----------------------------- News & Events ----------------------------- */

export async function getNewsEvents(type?: "NEWS" | "EVENT", limit?: number) {
  let sql = "SELECT * FROM news_events";
  const params: (string | number)[] = [];
  if (type) {
    sql += " WHERE type = ?";
    params.push(type);
  }
  sql += " ORDER BY publishedAt DESC";
  if (limit) {
    sql += " LIMIT ?";
    params.push(limit);
  }
  return await db.prepare(sql).all(...params) as unknown as NewsEvent[];
}

export async function getNewsEventBySlug(slug: string) {
  return await db.prepare("SELECT * FROM news_events WHERE slug = ?").get(slug) as unknown as NewsEvent | undefined;
}

export async function getNewsEventById(id: string) {
  return await db.prepare("SELECT * FROM news_events WHERE id = ?").get(id) as unknown as NewsEvent | undefined;
}

export async function createNewsEvent(data: Omit<NewsEvent, "id">) {
  const id = genId("ne");
  await db.prepare(
    `INSERT INTO news_events (id, title, slug, type, body, coverImageUrl, eventDate, publishedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.title, data.slug, data.type, data.body, data.coverImageUrl, data.eventDate, data.publishedAt);
  return id;
}

export async function updateNewsEvent(id: string, data: Partial<NewsEvent>) {
  const current = (await getNewsEventById(id))!;
  const n = { ...current, ...data };
  await db.prepare(
    `UPDATE news_events SET title=?, slug=?, type=?, body=?, coverImageUrl=?, eventDate=?, publishedAt=? WHERE id=?`
  ).run(n.title, n.slug, n.type, n.body, n.coverImageUrl, n.eventDate, n.publishedAt, id);
}

export async function deleteNewsEvent(id: string) {
  await db.prepare("DELETE FROM news_events WHERE id = ?").run(id);
}

/* ----------------------------- Slides ----------------------------- */

export async function getSlides(activeOnly = false) {
  const sql = activeOnly
    ? "SELECT * FROM slides WHERE isActive = 1 ORDER BY order_num ASC"
    : "SELECT * FROM slides ORDER BY order_num ASC";
  return await db.prepare(sql).all() as unknown as Slide[];
}

export async function getSlideById(id: string) {
  return await db.prepare("SELECT * FROM slides WHERE id = ?").get(id) as unknown as Slide | undefined;
}

export async function createSlide(data: Omit<Slide, "id">) {
  const id = genId("slide");
  await db.prepare(
    `INSERT INTO slides (id, imageUrl, title, subtitle, buttonText, buttonUrl, order_num, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.imageUrl, data.title, data.subtitle, data.buttonText, data.buttonUrl, data.order_num, data.isActive);
  return id;
}

export async function updateSlide(id: string, data: Partial<Slide>) {
  const current = await db.prepare("SELECT * FROM slides WHERE id = ?").get(id) as unknown as Slide;
  const s = { ...current, ...data };
  await db.prepare(
    `UPDATE slides SET imageUrl=?, title=?, subtitle=?, buttonText=?, buttonUrl=?, order_num=?, isActive=? WHERE id=?`
  ).run(s.imageUrl, s.title, s.subtitle, s.buttonText, s.buttonUrl, s.order_num, s.isActive, id);
}

export async function deleteSlide(id: string) {
  await db.prepare("DELETE FROM slides WHERE id = ?").run(id);
}

/* ----------------------------- Gallery ----------------------------- */

export async function getGalleryImages(category?: string) {
  if (category && category !== "All") {
    return db
      .prepare("SELECT * FROM gallery_images WHERE category = ? ORDER BY order_num ASC")
      .all(category) as unknown as GalleryImage[];
  }
  return await db.prepare("SELECT * FROM gallery_images ORDER BY order_num ASC").all() as unknown as GalleryImage[];
}

export async function createGalleryImage(data: Omit<GalleryImage, "id">) {
  const id = genId("gal");
  await db.prepare(
    `INSERT INTO gallery_images (id, url, caption, category, order_num) VALUES (?, ?, ?, ?, ?)`
  ).run(id, data.url, data.caption, data.category, data.order_num);
  return id;
}

export async function deleteGalleryImage(id: string) {
  await db.prepare("DELETE FROM gallery_images WHERE id = ?").run(id);
}

/* ----------------------------- Documents ----------------------------- */

export async function getDocuments(category?: string) {
  if (category && category !== "All") {
    return db
      .prepare("SELECT * FROM documents WHERE category = ? ORDER BY uploadedAt DESC")
      .all(category) as unknown as DocumentFile[];
  }
  return await db.prepare("SELECT * FROM documents ORDER BY uploadedAt DESC").all() as unknown as DocumentFile[];
}

export async function createDocument(data: Omit<DocumentFile, "id">) {
  const id = genId("doc");
  await db.prepare(
    `INSERT INTO documents (id, title, fileUrl, category, uploadedAt) VALUES (?, ?, ?, ?, ?)`
  ).run(id, data.title, data.fileUrl, data.category, data.uploadedAt);
  return id;
}

export async function deleteDocument(id: string) {
  await db.prepare("DELETE FROM documents WHERE id = ?").run(id);
}

/* ----------------------------- Departments / Programs / Faculty ----------------------------- */

export async function getDepartments() {
  return await db.prepare("SELECT * FROM departments ORDER BY order_num ASC").all() as unknown as Department[];
}

export async function getDepartmentBySlug(slug: string) {
  return await db.prepare("SELECT * FROM departments WHERE slug = ?").get(slug) as unknown as Department | undefined;
}

export async function getDepartmentById(id: string) {
  return await db.prepare("SELECT * FROM departments WHERE id = ?").get(id) as unknown as Department | undefined;
}

export async function createDepartment(data: Omit<Department, "id">) {
  const id = genId("dept");
  await db.prepare(
    `INSERT INTO departments (id, name, slug, description, headName, imageUrl, order_num) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.name, data.slug, data.description, data.headName, data.imageUrl, data.order_num);
  return id;
}

export async function updateDepartment(id: string, data: Partial<Department>) {
  const current = await db.prepare("SELECT * FROM departments WHERE id = ?").get(id) as unknown as Department;
  const d = { ...current, ...data };
  await db.prepare(
    `UPDATE departments SET name=?, slug=?, description=?, headName=?, imageUrl=?, order_num=? WHERE id=?`
  ).run(d.name, d.slug, d.description, d.headName, d.imageUrl, d.order_num, id);
}

export async function deleteDepartment(id: string) {
  await db.prepare("DELETE FROM departments WHERE id = ?").run(id);
}

export async function getPrograms() {
  return await db.prepare("SELECT * FROM programs ORDER BY order_num ASC").all() as unknown as Program[];
}

export async function getProgramById(id: string) {
  return await db.prepare("SELECT * FROM programs WHERE id = ?").get(id) as unknown as Program | undefined;
}

export async function createProgram(data: Omit<Program, "id">) {
  const id = genId("prog");
  await db.prepare(
    `INSERT INTO programs (id, title, slug, level, duration, description, departmentId, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.title, data.slug, data.level, data.duration, data.description, data.departmentId, data.order_num);
  return id;
}

export async function updateProgram(id: string, data: Partial<Program>) {
  const current = await db.prepare("SELECT * FROM programs WHERE id = ?").get(id) as unknown as Program;
  const p = { ...current, ...data };
  await db.prepare(
    `UPDATE programs SET title=?, slug=?, level=?, duration=?, description=?, departmentId=?, order_num=? WHERE id=?`
  ).run(p.title, p.slug, p.level, p.duration, p.description, p.departmentId, p.order_num, id);
}

export async function deleteProgram(id: string) {
  await db.prepare("DELETE FROM programs WHERE id = ?").run(id);
}

export async function getFaculty() {
  return await db.prepare("SELECT * FROM faculty_members ORDER BY order_num ASC").all() as unknown as FacultyMember[];
}

export async function getFacultyById(id: string) {
  return await db.prepare("SELECT * FROM faculty_members WHERE id = ?").get(id) as unknown as FacultyMember | undefined;
}

export async function createFaculty(data: Omit<FacultyMember, "id">) {
  const id = genId("fac");
  await db.prepare(
    `INSERT INTO faculty_members (id, name, designation, qualification, photoUrl, email, departmentId, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.name, data.designation, data.qualification, data.photoUrl, data.email, data.departmentId, data.order_num);
  return id;
}

export async function updateFaculty(id: string, data: Partial<FacultyMember>) {
  const current = await db.prepare("SELECT * FROM faculty_members WHERE id = ?").get(id) as unknown as FacultyMember;
  const f = { ...current, ...data };
  await db.prepare(
    `UPDATE faculty_members SET name=?, designation=?, qualification=?, photoUrl=?, email=?, departmentId=?, order_num=? WHERE id=?`
  ).run(f.name, f.designation, f.qualification, f.photoUrl, f.email, f.departmentId, f.order_num, id);
}

export async function deleteFaculty(id: string) {
  await db.prepare("DELETE FROM faculty_members WHERE id = ?").run(id);
}

export async function getAchievements() {
  return await db.prepare("SELECT * FROM achievements ORDER BY order_num ASC").all() as unknown as Achievement[];
}

export async function createAchievement(data: Omit<Achievement, "id">) {
  const id = genId("ach");
  await db.prepare(`INSERT INTO achievements (id, label, value, icon, order_num) VALUES (?, ?, ?, ?, ?)`).run(
    id,
    data.label,
    data.value,
    data.icon,
    data.order_num
  );
  return id;
}

export async function updateAchievement(id: string, data: Partial<Achievement>) {
  const current = await db.prepare("SELECT * FROM achievements WHERE id = ?").get(id) as unknown as Achievement;
  const a = { ...current, ...data };
  await db.prepare(`UPDATE achievements SET label=?, value=?, icon=?, order_num=? WHERE id=?`).run(
    a.label,
    a.value,
    a.icon,
    a.order_num,
    id
  );
}

export async function deleteAchievement(id: string) {
  await db.prepare("DELETE FROM achievements WHERE id = ?").run(id);
}

/* ----------------------------- Admissions ----------------------------- */

export async function getAdmissionPrograms() {
  return await db.prepare("SELECT * FROM admission_programs ORDER BY order_num ASC").all() as unknown as AdmissionProgram[];
}

export async function getAdmissionProgramById(id: string) {
  return await db.prepare("SELECT * FROM admission_programs WHERE id = ?").get(id) as unknown as AdmissionProgram | undefined;
}

export async function createAdmissionProgram(data: Omit<AdmissionProgram, "id">) {
  const id = genId("adprog");
  await db.prepare(
    `INSERT INTO admission_programs (id, name, faculty, seats, isOpen, order_num) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, data.name, data.faculty, data.seats, data.isOpen, data.order_num);
  return id;
}

export async function updateAdmissionProgram(id: string, data: Partial<AdmissionProgram>) {
  const current = await db.prepare("SELECT * FROM admission_programs WHERE id = ?").get(id) as unknown as AdmissionProgram;
  const p = { ...current, ...data };
  await db.prepare(`UPDATE admission_programs SET name=?, faculty=?, seats=?, isOpen=?, order_num=? WHERE id=?`).run(
    p.name,
    p.faculty,
    p.seats,
    p.isOpen,
    p.order_num,
    id
  );
}

export async function deleteAdmissionProgram(id: string) {
  await db.prepare("DELETE FROM admission_programs WHERE id = ?").run(id);
}

/**
 * Programs that are actually accepting applications right now: marked Open
 * by the admin AND with at least one seat announced. This is the single
 * source of truth the public apply form and the admissions hub page check
 * against — if it's empty, nobody can submit an application.
 */
export async function getOpenAdmissionPrograms() {
  return db
    .prepare("SELECT * FROM admission_programs WHERE isOpen = 1 AND seats > 0 ORDER BY order_num ASC")
    .all() as unknown as AdmissionProgram[];
}

export async function isAdmissionOpen() {
  return (await getOpenAdmissionPrograms()).length > 0;
}

export async function getAdmissionFormFields(enabledOnly = false) {
  const sql = enabledOnly
    ? "SELECT * FROM admission_form_fields WHERE enabled = 1 ORDER BY section ASC, order_num ASC"
    : "SELECT * FROM admission_form_fields ORDER BY section ASC, order_num ASC";
  return await db.prepare(sql).all() as unknown as AdmissionFormField[];
}

export async function getAdmissionFormFieldById(id: string) {
  return await db.prepare("SELECT * FROM admission_form_fields WHERE id = ?").get(id) as unknown as AdmissionFormField | undefined;
}

export async function createAdmissionFormField(data: Omit<AdmissionFormField, "id">) {
  const id = genId("field");
  await db.prepare(
    `INSERT INTO admission_form_fields (id, section, label, fieldKey, fieldType, options, required, enabled, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.section, data.label, data.fieldKey, data.fieldType, data.options, data.required, data.enabled, data.order_num);
  return id;
}

export async function updateAdmissionFormField(id: string, data: Partial<AdmissionFormField>) {
  const current = await db.prepare("SELECT * FROM admission_form_fields WHERE id = ?").get(id) as unknown as AdmissionFormField;
  const f = { ...current, ...data };
  await db.prepare(
    `UPDATE admission_form_fields SET section=?, label=?, fieldKey=?, fieldType=?, options=?, required=?, enabled=?, order_num=? WHERE id=?`
  ).run(f.section, f.label, f.fieldKey, f.fieldType, f.options, f.required, f.enabled, f.order_num, id);
}

export async function deleteAdmissionFormField(id: string) {
  await db.prepare("DELETE FROM admission_form_fields WHERE id = ?").run(id);
}

export async function getAdmissionApplications(status?: string) {
  if (status && status !== "ALL") {
    return db
      .prepare("SELECT * FROM admission_applications WHERE status = ? ORDER BY submittedAt DESC")
      .all(status) as unknown as AdmissionApplication[];
  }
  return await db.prepare("SELECT * FROM admission_applications ORDER BY submittedAt DESC").all() as unknown as AdmissionApplication[];
}

export async function getAdmissionApplicationById(id: string) {
  return await db.prepare("SELECT * FROM admission_applications WHERE id = ?").get(id) as unknown as AdmissionApplication | undefined;
}

export async function getAdmissionApplicationByNo(applicationNo: string) {
  return db
    .prepare("SELECT * FROM admission_applications WHERE applicationNo = ?")
    .get(applicationNo) as unknown as AdmissionApplication | undefined;
}

export async function createAdmissionApplication(
  data: Omit<AdmissionApplication, "id" | "applicationNo" | "rejectionReason" | "reviewedAt"> & { applicationNo?: string }
) {
  const id = genId("app");
  const year = new Date().getFullYear();
  const seq = Number((await db.prepare("SELECT COUNT(*) as c FROM admission_applications").get() as { c: string | number }).c) + 1;
  const applicationNo = data.applicationNo || `GBDCSC-${year}-${String(seq).padStart(4, "0")}`;
  await db.prepare(
    `INSERT INTO admission_applications (id, applicationNo, programChoice, admissionProgramId, dataJson, photoUrl, status, submittedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, applicationNo, data.programChoice, data.admissionProgramId || "", data.dataJson, data.photoUrl, data.status, data.submittedAt);
  return applicationNo;
}

/**
 * Advances an application's status and records when/why. `reason` is stored
 * as the rejection reason when moving to REJECTED — the public status
 * checker shows it back to the applicant so they know what to fix or that
 * a decision was made and why. Which transitions are actually allowed is
 * enforced by the caller (the admin action), not here — this is a plain
 * write.
 */
export async function updateAdmissionApplicationStatus(id: string, status: AdmissionApplication["status"], reason = "") {
  await db.prepare("UPDATE admission_applications SET status = ?, rejectionReason = ?, reviewedAt = ? WHERE id = ?").run(
    status,
    status === "REJECTED" ? reason : "",
    nowIso(),
    id
  );
}

/* ----------------------------- Contact messages ----------------------------- */

export async function getContactMessages() {
  return await db.prepare("SELECT * FROM contact_messages ORDER BY submittedAt DESC").all() as unknown as ContactMessage[];
}

export async function createContactMessage(data: Omit<ContactMessage, "id" | "isRead">) {
  const id = genId("msg");
  await db.prepare(
    `INSERT INTO contact_messages (id, name, email, phone, subject, message, isRead, submittedAt) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`
  ).run(id, data.name, data.email, data.phone, data.subject, data.message, data.submittedAt);
  return id;
}

export async function markMessageRead(id: string) {
  await db.prepare("UPDATE contact_messages SET isRead = 1 WHERE id = ?").run(id);
}

export async function deleteContactMessage(id: string) {
  await db.prepare("DELETE FROM contact_messages WHERE id = ?").run(id);
}
