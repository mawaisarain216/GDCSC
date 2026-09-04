# Govt. Boys Degree College Shahpur Chakar — Website & Admin Panel

A full college website built with **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**, with a complete **admin panel** that lets a non-technical administrator edit almost everything on the site — text, images, menus, notices, admissions, fonts, colors, layout — without touching any code.

The application uses **Neon PostgreSQL** in production (Vercel-compatible/serverless). Local migration tooling can read the original SQLite `data/college.db` and copy its existing data into Neon. Persistent uploads use **Vercel Blob** when `BLOB_READ_WRITE_TOKEN` is configured.

---

## 1. Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Environment variables
#    Copy .env.example to .env.local and set DATABASE_URL to your Neon database.

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3000** for the public website.
Open **http://localhost:3000/admin** for the admin panel.

**Admin login:**
- The existing administrator account is preserved when `data/college.db` is migrated to Neon.
- Configure/rotate the administrator credentials and `JWT_SECRET` through your deployment environment and admin settings before going public.

⚠️ Never commit `.env`, `.env.local`, database passwords, or JWT secrets to GitHub.

---

## 2. What's Editable From the Admin Panel

| Admin section | What it controls |
|---|---|
| **Content** | Homepage hero text, About text, Principal's message, Contact intro |
| **Appearance** | Fonts (heading/body), font sizes, all colors (primary/secondary/accent/header/footer/etc.), corner radius, container width, section spacing, button style, header style, sticky header, homepage section order & visibility, custom CSS |
| **Menus** | Header navigation (with dropdowns) and footer links — add/edit/delete/reorder |
| **Posts → Notices** | General/Admission/Exam/Result/Academic notices, with optional PDF attachment and pin-to-top |
| **Posts → News & Events** | News articles and events with cover images |
| **Media → Slider** | Homepage hero slider images, titles, buttons |
| **Media → Gallery** | Campus photo gallery, categorized |
| **Media → Documents** | Prospectus, syllabi, merit lists, downloadable PDFs |
| **Academics** | Departments, Programs (Intermediate/BS), Faculty & Staff, Achievements/stats band |
| **Admissions → Programs & Seats** | Faculties, seat counts, open/closed status |
| **Admissions → Form Fields** | Every field on the public online admission form — add, edit, remove, reorder, mark required/optional, enable/disable. The form on `/admissions/apply` is built entirely from this config. |
| **Admissions → Applications** | Review submitted applications, view all submitted data, update status (Received → Under Review → Documents Verified → Selected/Waitlisted/Rejected) |
| **Contact Messages** | Messages submitted through the public Contact Us form |
| **Settings** | Site name, tagline, logo, favicon, phone/email/address, Google Maps embed, social links, SEO meta title/description |

Everything above is stored in Neon PostgreSQL and rendered live on the public site — no rebuild/redeploy is needed for content changes.

---

## 3. About the Admission Form

The online admission form (`/admissions/apply`) was built to match the college's actual paper admission form (Choice of Faculty, Educational Details, Personal Details), digitized field-for-field:

- **Choice of Faculty**: Medium (Sindhi/Urdu), Faculty (Pre-Medical / Pre-Engineering / Arts / Computer Science)
- **Educational Details**: 9th/10th seat numbers, passing years, board, province, study group, marks, school names/types, 8th & 5th class details
- **Personal Details**: CNIC/B-Form, name, father's details, contact info, date of birth, domicile, address, etc.
- **Documents**: Photograph upload + declaration checkbox

**No fee fields** are included anywhere — this is a government institution and admission is merit-based with no admission/tuition fee.

All of the above fields are fully editable from **Admin → Admissions → Form Fields** — the college can add, remove or rename fields at any time without a developer.

Submitted applications get an auto-generated reference number (e.g. `GBDCSC-2026-0001`) which applicants can use on `/admissions/status` to track their application.

---

## 4. What's Verified vs. Dummy/Sample Data

The supplied SQLite database contains the project's existing content and can be migrated to Neon with `npm run migrate:neon`.

**Verified and already set correctly:**
- College name: Govt. Boys Degree College Shahpur Chakar
- Tagline: "College of Excellence"
- Address: Govt. Boys Degree College Shahpur Chakar, Nazd Sadawah Bypass, Nawabshah Link Road, Shahpur Chakar, Taluka Shahdadpur, District Sanghar, Sindh
- Phone: 0302-3236079 · Email: gbdcspc2017@gmail.com
- Facebook: facebook.com/gbdcspc2017
- Intermediate streams offered: Pre-Medical, Pre-Engineering, Arts & Commerce (per the college's own site)

**Sample/dummy — replace via the admin panel before going live:**
- Principal's name & message, exact founding year, homepage stats (student/faculty counts)
- Faculty member names (all marked "(Sample)")
- The Computer Science degree department (included as a placeholder — confirm with the college office whether this is actually offered)
- Notices, news/events, gallery photos (stock images), and the generated sample prospectus PDF

Treat all of the above as a starting template, not verified fact about the college, until replaced.

The color palette (deep institutional green `#0B5D46`, teal secondary, warm gold accent `#D4A72C`) was chosen to read as an official Sindh government academic institution while still feeling modern. It's fully changeable from **Admin → Appearance → Colors**.

---

## 5. Tech Stack & Architecture

- **Next.js 16** (App Router, Server Components, Server Actions)
- **React 19**, **TypeScript**, **Tailwind CSS v4**
- **Neon PostgreSQL** via `@neondatabase/serverless` for persistent production data
- **Vercel Blob** via `@vercel/blob` for persistent image/PDF uploads on Vercel
- **Auth**: email/password login, JWT session cookie (`jose`), password hashing (`bcryptjs`)
- `src/lib/repo.ts` — all application database queries/mutations in one place
- `src/lib/db.ts` — Neon database adapter and schema initialization
- `src/lib/upload.ts` — Vercel Blob upload with local filesystem fallback for development
- The original `data/college.db` is migration input only; it is not used by the deployed application.

### Useful commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run migrate:neon
```

## 6. Vercel + Neon deployment

1. Create a Neon PostgreSQL database and copy its `DATABASE_URL`.
2. In Vercel, add `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, and `NEXT_PUBLIC_SITE_URL` to Production (and Preview if desired).
3. Create a Vercel Blob store and add its `BLOB_READ_WRITE_TOKEN` to the same environments so admin image/PDF uploads persist.
4. For the existing `data/college.db`, run `npm run migrate:neon` locally with the Neon `DATABASE_URL` in your local environment. This copies the existing tables and data; it does not change the website design.
5. Deploy the GitHub repository to Vercel. The production app reads/writes Neon instead of the local SQLite file.

Do not commit `.env` or real credentials to GitHub. Use `.env.example` only as a template.
