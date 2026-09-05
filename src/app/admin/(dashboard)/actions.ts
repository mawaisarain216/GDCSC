"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { nowIso } from "@/lib/db";
import { saveUploadedFile } from "@/lib/upload";
import { slugify } from "@/lib/format";
import * as repo from "@/lib/repo";
import {
  findAdminById,
  getSession,
  requireAdminSession,
  updateAdminPassword,
} from "@/lib/auth";
import type {
  AdmissionStatus,
  HomepageSection,
  Theme,
} from "@/lib/types";
import { ADMISSION_STATUS_TRANSITIONS } from "@/lib/admissionWorkflow";

function str(fd: FormData, key: string, fallback = "") {
  const v = fd.get(key);
  return typeof v === "string" ? v : fallback;
}

function num(fd: FormData, key: string, fallback = 0) {
  const v = fd.get(key);
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function bool(fd: FormData, key: string) {
  return fd.get(key) ? 1 : 0;
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

/* ----------------------------- Content blocks ----------------------------- */

export async function saveContentBlocks(formData: FormData) {
  await requireAdminSession();
  const blocks = await repo.getAllContentBlocks();

  for (const b of blocks) {
    const value = formData.get(b.key);
    if (typeof value === "string") {
      await repo.setContent(b.key, value);
    }
  }

  revalidateSite();
  redirect("/admin/content?saved=1");
}

/* ----------------------------- Settings (site info / SEO / social) ----------------------------- */

export async function saveSettings(formData: FormData) {
  await requireAdminSession();

  const current = await repo.getSettings();

  const logoFile = formData.get("logoFile") as File | null;
  const faviconFile = formData.get("faviconFile") as File | null;

  const logoUrl =
    (await saveUploadedFile(logoFile, "branding")) || current.logoUrl;

  const faviconUrl =
    (await saveUploadedFile(faviconFile, "branding")) || current.faviconUrl;

  await repo.updateSettings({
    siteName: str(formData, "siteName", current.siteName),
    shortName: str(formData, "shortName", current.shortName),
    tagline: str(formData, "tagline", current.tagline),
    phone: str(formData, "phone", current.phone),
    email: str(formData, "email", current.email),
    address: str(formData, "address", current.address),
    mapEmbedUrl: str(formData, "mapEmbedUrl", current.mapEmbedUrl),
    facebookUrl: str(formData, "facebookUrl", current.facebookUrl),
    twitterUrl: str(formData, "twitterUrl", current.twitterUrl),
    youtubeUrl: str(formData, "youtubeUrl", current.youtubeUrl),
    instagramUrl: str(formData, "instagramUrl", current.instagramUrl),
    metaTitle: str(formData, "metaTitle", current.metaTitle),
    metaDescription: str(formData, "metaDescription", current.metaDescription),
    affiliationText: str(
      formData,
      "affiliationText",
      current.affiliationText
    ),
    logoUrl,
    faviconUrl,
  });

  revalidateSite();
  redirect("/admin/settings?saved=1");
}

/* ----------------------------- Security / Account ----------------------------- */

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .regex(/[A-Z]/, "New password must include an uppercase letter.")
      .regex(/[0-9]/, "New password must include a number."),
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "New password and confirmation do not match.",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ||
        "Please check the form and try again.",
    };
  }

  const user = await findAdminById(session!.sub);

  if (
    !user ||
    !bcrypt.compareSync(parsed.data.currentPassword, user.passwordHash)
  ) {
    return { error: "Current password is incorrect." };
  }

  const newHash = bcrypt.hashSync(parsed.data.newPassword, 10);

  await updateAdminPassword(user.id, newHash);

  return { success: "Password updated successfully." };
}

/* ----------------------------- Appearance / Theme ----------------------------- */

export async function saveTheme(formData: FormData) {
  await requireAdminSession();

  const current = await repo.getTheme();

  const theme: Theme = {
    ...current,
    fontHeading: str(formData, "fontHeading", current.fontHeading),
    fontBody: str(formData, "fontBody", current.fontBody),
    baseFontSize: str(formData, "baseFontSize", current.baseFontSize),
    h1Size: str(formData, "h1Size", current.h1Size),
    h2Size: str(formData, "h2Size", current.h2Size),
    h3Size: str(formData, "h3Size", current.h3Size),
    colorPrimary: str(formData, "colorPrimary", current.colorPrimary),
    colorPrimaryDark: str(
      formData,
      "colorPrimaryDark",
      current.colorPrimaryDark
    ),
    colorSecondary: str(
      formData,
      "colorSecondary",
      current.colorSecondary
    ),
    colorAccent: str(formData, "colorAccent", current.colorAccent),
    colorBg: str(formData, "colorBg", current.colorBg),
    colorSurface: str(formData, "colorSurface", current.colorSurface),
    colorText: str(formData, "colorText", current.colorText),
    colorTextMuted: str(
      formData,
      "colorTextMuted",
      current.colorTextMuted
    ),
    colorHeaderBg: str(
      formData,
      "colorHeaderBg",
      current.colorHeaderBg
    ),
    colorHeaderText: str(
      formData,
      "colorHeaderText",
      current.colorHeaderText
    ),
    colorFooterBg: str(
      formData,
      "colorFooterBg",
      current.colorFooterBg
    ),
    colorFooterText: str(
      formData,
      "colorFooterText",
      current.colorFooterText
    ),
    radius: str(formData, "radius", current.radius),
    containerWidth: str(
      formData,
      "containerWidth",
      current.containerWidth
    ),
    sectionSpacing: str(
      formData,
      "sectionSpacing",
      current.sectionSpacing
    ),
    buttonStyle: str(
      formData,
      "buttonStyle",
      current.buttonStyle
    ) as Theme["buttonStyle"],
    headerStyle: str(
      formData,
      "headerStyle",
      current.headerStyle
    ) as Theme["headerStyle"],
    stickyHeader: !!formData.get("stickyHeader"),
    showTopBar: !!formData.get("showTopBar"),
    darkMode: !!formData.get("darkMode"),
  };

  await repo.updateTheme(theme);

  revalidateSite();
  redirect("/admin/appearance?saved=1");
}

export async function saveCustomCss(formData: FormData) {
  await requireAdminSession();

  await repo.updateSettings({
    customCss: str(formData, "customCss", ""),
  });

  revalidateSite();
  redirect("/admin/appearance?tab=custom&saved=1");
}

export async function saveHomepageSections(formData: FormData) {
  await requireAdminSession();

  const raw = str(formData, "sections", "[]");

  try {
    const sections = JSON.parse(raw) as HomepageSection[];
    await repo.updateHomepageSections(sections);
  } catch {
    /* ignore malformed payload */
  }

  revalidateSite();
  redirect("/admin/appearance?tab=homepage&saved=1");
}

/* ----------------------------- Menus ----------------------------- */

export async function createMenuItemAction(formData: FormData) {
  await requireAdminSession();

  await repo.createMenuItem({
    label: str(formData, "label"),
    url: str(formData, "url", "#"),
    location: str(
      formData,
      "location",
      "HEADER"
    ) as "HEADER" | "FOOTER",
    order_num: num(formData, "order_num", 0),
    openInNewTab: bool(formData, "openInNewTab"),
    parentId: str(formData, "parentId") || null,
  });

  revalidateSite();
  redirect("/admin/menus?saved=1");
}

export async function updateMenuItemAction(
  id: string,
  formData: FormData
) {
  await requireAdminSession();

  await repo.updateMenuItem(id, {
    label: str(formData, "label"),
    url: str(formData, "url"),
    location: str(formData, "location") as "HEADER" | "FOOTER",
    order_num: num(formData, "order_num", 0),
    openInNewTab: bool(formData, "openInNewTab"),
    parentId: str(formData, "parentId") || null,
  });

  revalidateSite();
  redirect("/admin/menus?saved=1");
}

export async function deleteMenuItemAction(formData: FormData) {
  await requireAdminSession();

  const id = str(formData, "id");

  await repo.deleteMenuItem(id);

  revalidateSite();
}

/* ----------------------------- Notices ----------------------------- */

export async function createNoticeAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("file") as File | null;

  const fileUrl =
    (await saveUploadedFile(file, "notices")) || "";

  await repo.createNotice({
    title: str(formData, "title"),
    body: str(formData, "body"),
    category: str(formData, "category", "General"),
    fileUrl,
    isPinned: bool(formData, "isPinned"),
    publishedAt: str(formData, "publishedAt") || nowIso(),
  });

  revalidateSite();
  redirect("/admin/posts/notices?saved=1");
}

export async function updateNoticeAction(
  id: string,
  formData: FormData
) {
  await requireAdminSession();

  const file = formData.get("file") as File | null;

  const uploaded = await saveUploadedFile(file, "notices");

  await repo.updateNotice(id, {
    title: str(formData, "title"),
    body: str(formData, "body"),
    category: str(formData, "category"),
    ...(uploaded ? { fileUrl: uploaded } : {}),
    isPinned: bool(formData, "isPinned"),
    publishedAt: str(formData, "publishedAt") || nowIso(),
  });

  revalidateSite();
  redirect("/admin/posts/notices?saved=1");
}

export async function deleteNoticeAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteNotice(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- News & Events ----------------------------- */

export async function createNewsEventAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("coverImage") as File | null;

  const coverImageUrl =
    (await saveUploadedFile(file, "news")) || "";

  const title = str(formData, "title");

  await repo.createNewsEvent({
    title,
    slug:
      slugify(str(formData, "slug") || title) +
      "-" +
      Date.now().toString(36).slice(-4),
    type: str(formData, "type", "NEWS") as "NEWS" | "EVENT",
    body: str(formData, "body"),
    coverImageUrl,
    eventDate: str(formData, "eventDate") || null,
    publishedAt: str(formData, "publishedAt") || nowIso(),
  });

  revalidateSite();
  redirect("/admin/posts/news-events?saved=1");
}

export async function updateNewsEventAction(
  id: string,
  formData: FormData
) {
  await requireAdminSession();

  const file = formData.get("coverImage") as File | null;

  const uploaded = await saveUploadedFile(file, "news");

  await repo.updateNewsEvent(id, {
    title: str(formData, "title"),
    type: str(formData, "type") as "NEWS" | "EVENT",
    body: str(formData, "body"),
    ...(uploaded ? { coverImageUrl: uploaded } : {}),
    eventDate: str(formData, "eventDate") || null,
    publishedAt: str(formData, "publishedAt") || nowIso(),
  });

  revalidateSite();
  redirect("/admin/posts/news-events?saved=1");
}

export async function deleteNewsEventAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteNewsEvent(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- Slides ----------------------------- */

export async function createSlideAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("image") as File | null;

  const imageUrl =
    (await saveUploadedFile(file, "slides")) || "";

  await repo.createSlide({
    imageUrl,
    title: str(formData, "title"),
    subtitle: str(formData, "subtitle"),
    buttonText: str(formData, "buttonText"),
    buttonUrl: str(formData, "buttonUrl"),
    order_num: num(formData, "order_num", 0),
    isActive: bool(formData, "isActive"),
  });

  revalidateSite();
  redirect("/admin/media/slides?saved=1");
}

export async function updateSlideAction(
  id: string,
  formData: FormData
) {
  await requireAdminSession();

  const file = formData.get("image") as File | null;

  const uploaded = await saveUploadedFile(file, "slides");

  await repo.updateSlide(id, {
    title: str(formData, "title"),
    subtitle: str(formData, "subtitle"),
    buttonText: str(formData, "buttonText"),
    buttonUrl: str(formData, "buttonUrl"),
    order_num: num(formData, "order_num", 0),
    isActive: bool(formData, "isActive"),
    ...(uploaded ? { imageUrl: uploaded } : {}),
  });

  revalidateSite();
  redirect("/admin/media/slides?saved=1");
}

export async function deleteSlideAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteSlide(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- Gallery ----------------------------- */

/*
 * IMPORTANT:
 * Gallery images are uploaded directly from the browser to Vercel Blob.
 * This Server Action receives only the resulting Blob URL.
 *
 * This avoids sending the image file through a Vercel Server Action,
 * which has a request-body size limitation.
 */
export async function createGalleryImageAction(formData: FormData) {
  await requireAdminSession();

  const url = str(formData, "url");

  if (!url) {
    return {
      success: false,
      error: "Image upload URL is missing.",
    };
  }

  await repo.createGalleryImage({
    url,
    caption: str(formData, "caption"),
    category: str(formData, "category", "Campus"),
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  return {
    success: true,
  };
}

export async function deleteGalleryImageAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteGalleryImage(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- Documents ----------------------------- */

export async function createDocumentAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("file") as File | null;

  const fileUrl =
    (await saveUploadedFile(file, "documents")) || "";

  if (!fileUrl) {
    redirect("/admin/media/documents?error=1");
  }

  await repo.createDocument({
    title: str(formData, "title"),
    fileUrl,
    category: str(formData, "category", "General"),
    uploadedAt: nowIso(),
  });

  revalidateSite();

  redirect("/admin/media/documents?saved=1");
}

export async function deleteDocumentAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteDocument(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- Departments ----------------------------- */

export async function createDepartmentAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("image") as File | null;

  const imageUrl =
    (await saveUploadedFile(file, "departments")) || "";

  const name = str(formData, "name");

  await repo.createDepartment({
    name,
    slug: slugify(str(formData, "slug") || name),
    description: str(formData, "description"),
    headName: str(formData, "headName"),
    imageUrl,
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  redirect("/admin/academics/departments?saved=1");
}

export async function updateDepartmentAction(
  id: string,
  formData: FormData
) {
  await requireAdminSession();

  const file = formData.get("image") as File | null;

  const uploaded = await saveUploadedFile(file, "departments");

  await repo.updateDepartment(id, {
    name: str(formData, "name"),
    slug: slugify(str(formData, "slug")),
    description: str(formData, "description"),
    headName: str(formData, "headName"),
    order_num: num(formData, "order_num", 0),
    ...(uploaded ? { imageUrl: uploaded } : {}),
  });

  revalidateSite();

  redirect("/admin/academics/departments?saved=1");
}

export async function deleteDepartmentAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteDepartment(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- Programs ----------------------------- */

export async function createProgramAction(formData: FormData) {
  await requireAdminSession();

  const title = str(formData, "title");

  await repo.createProgram({
    title,
    slug:
      slugify(str(formData, "slug") || title) +
      "-" +
      Date.now().toString(36).slice(-4),
    level: str(formData, "level", "Intermediate"),
    duration: str(formData, "duration", "2 Years"),
    description: str(formData, "description"),
    departmentId: str(formData, "departmentId") || null,
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  redirect("/admin/academics/programs?saved=1");
}

export async function updateProgramAction(
  id: string,
  formData: FormData
) {
  await requireAdminSession();

  await repo.updateProgram(id, {
    title: str(formData, "title"),
    level: str(formData, "level"),
    duration: str(formData, "duration"),
    description: str(formData, "description"),
    departmentId: str(formData, "departmentId") || null,
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  redirect("/admin/academics/programs?saved=1");
}

export async function deleteProgramAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteProgram(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- Faculty ----------------------------- */

export async function createFacultyAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("photo") as File | null;

  const photoUrl =
    (await saveUploadedFile(file, "faculty")) || "";

  await repo.createFaculty({
    name: str(formData, "name"),
    designation: str(formData, "designation", "Lecturer"),
    qualification: str(formData, "qualification"),
    photoUrl,
    email: str(formData, "email"),
    departmentId: str(formData, "departmentId") || null,
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  redirect("/admin/academics/faculty?saved=1");
}

export async function updateFacultyAction(
  id: string,
  formData: FormData
) {
  await requireAdminSession();

  const file = formData.get("photo") as File | null;

  const uploaded = await saveUploadedFile(file, "faculty");

  await repo.updateFaculty(id, {
    name: str(formData, "name"),
    designation: str(formData, "designation"),
    qualification: str(formData, "qualification"),
    email: str(formData, "email"),
    departmentId: str(formData, "departmentId") || null,
    order_num: num(formData, "order_num", 0),
    ...(uploaded ? { photoUrl: uploaded } : {}),
  });

  revalidateSite();

  redirect("/admin/academics/faculty?saved=1");
}

export async function deleteFacultyAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteFaculty(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- Achievements ----------------------------- */

export async function createAchievementAction(formData: FormData) {
  await requireAdminSession();

  await repo.createAchievement({
    label: str(formData, "label"),
    value: str(formData, "value"),
    icon: str(formData, "icon", "Users"),
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  redirect("/admin/academics/achievements?saved=1");
}

export async function deleteAchievementAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteAchievement(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- Admission Programs ----------------------------- */

export async function createAdmissionProgramAction(
  formData: FormData
) {
  await requireAdminSession();

  await repo.createAdmissionProgram({
    name: str(formData, "name"),
    faculty: str(formData, "faculty", "Arts"),
    seats: num(formData, "seats", 0),
    isOpen: bool(formData, "isOpen"),
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  redirect("/admin/admissions/programs?saved=1");
}

export async function updateAdmissionProgramAction(
  id: string,
  formData: FormData
) {
  await requireAdminSession();

  await repo.updateAdmissionProgram(id, {
    name: str(formData, "name"),
    faculty: str(formData, "faculty"),
    seats: num(formData, "seats", 0),
    isOpen: bool(formData, "isOpen"),
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  redirect("/admin/admissions/programs?saved=1");
}

export async function deleteAdmissionProgramAction(formData: FormData) {
  await requireAdminSession();

  await repo.deleteAdmissionProgram(str(formData, "id"));

  revalidateSite();
}

/* ----------------------------- Admission Form Fields ----------------------------- */

export async function createAdmissionFieldAction(formData: FormData) {
  await requireAdminSession();

  const optionsRaw = str(formData, "options", "");

  const options = optionsRaw
    ? JSON.stringify(
        optionsRaw
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean)
      )
    : "[]";

  await repo.createAdmissionFormField({
    section: str(
      formData,
      "section",
      "PERSONAL"
    ) as "FACULTY" | "EDUCATIONAL" | "PERSONAL" | "DOCUMENTS",
    label: str(formData, "label"),
    fieldKey: slugify(
      str(formData, "fieldKey") || str(formData, "label")
    ).replace(/-/g, "_"),
    fieldType: str(
      formData,
      "fieldType",
      "text"
    ) as never,
    options,
    required: bool(formData, "required"),
    enabled: bool(formData, "enabled") || 1,
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  redirect("/admin/admissions/form-fields?saved=1");
}

export async function updateAdmissionFieldAction(
  id: string,
  formData: FormData
) {
  await requireAdminSession();

  const optionsRaw = str(formData, "options", "");

  const options = optionsRaw
    ? JSON.stringify(
        optionsRaw
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean)
      )
    : "[]";

  await repo.updateAdmissionFormField(id, {
    section: str(
      formData,
      "section"
    ) as "FACULTY" | "EDUCATIONAL" | "PERSONAL" | "DOCUMENTS",
    label: str(formData, "label"),
    fieldType: str(formData, "fieldType") as never,
    options,
    required: bool(formData, "required"),
    enabled: bool(formData, "enabled"),
    order_num: num(formData, "order_num", 0),
  });

  revalidateSite();

  redirect("/admin/admissions/form-fields?saved=1");
}

export async function deleteAdmissionFieldAction(
  formData: FormData
) {
  await requireAdminSession();

  await repo.deleteAdmissionFormField(str(formData, "id"));

  revalidateSite();
}

export async function toggleAdmissionFieldAction(
  formData: FormData
) {
  await requireAdminSession();

  const id = str(formData, "id");
  const enabled = str(formData, "enabled") === "1";

  await repo.updateAdmissionFormField(id, {
    enabled: enabled ? 1 : 0,
  });

  revalidatePath("/admin/admissions/form-fields");
  revalidateSite();
}

/* ----------------------------- Admission Applications ----------------------------- */

export async function updateApplicationStatusAction(
  formData: FormData
) {
  await requireAdminSession();

  const id = str(formData, "id");
  const nextStatus = str(formData, "status") as AdmissionStatus;
  const reason = str(formData, "reason", "").trim();

  const current = await repo.getAdmissionApplicationById(id);

  if (!current) {
    redirect("/admin/admissions/applications");
  }

  const allowed =
    ADMISSION_STATUS_TRANSITIONS[current.status] || [];

  if (!allowed.includes(nextStatus)) {
    redirect(
      `/admin/admissions/applications/${id}?error=invalid-transition`
    );
  }

  if (nextStatus === "REJECTED" && !reason) {
    redirect(
      `/admin/admissions/applications/${id}?error=reason-required`
    );
  }

  await repo.updateAdmissionApplicationStatus(
    id,
    nextStatus,
    reason
  );

  revalidatePath("/admin/admissions/applications");
  revalidatePath(`/admin/admissions/applications/${id}`);

  redirect(
    `/admin/admissions/applications/${id}?updated=1`
  );
}

/* ----------------------------- Contact messages ----------------------------- */

export async function markMessageReadAction(
  formData: FormData
) {
  await requireAdminSession();

  await repo.markMessageRead(str(formData, "id"));

  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(
  formData: FormData
) {
  await requireAdminSession();

  await repo.deleteContactMessage(str(formData, "id"));

  revalidatePath("/admin/messages");
}