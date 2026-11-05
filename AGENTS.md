# Agent instructions — Government Boys Degree College Shahpur Chakar

## Hallmark design skill
Use Nutlope/Hallmark v2 (MIT) for new pages, explicitly requested redesigns, and UI audits when available. Install in this checkout with `npx skills add nutlope/hallmark`; global install is `npx skills add nutlope/hallmark -g`. Read the existing design tokens and college identity before proposing visual changes.

## Project-specific design scope
- Improve public college pages and admin interfaces for content, appearance, menus, notices, news/events, media galleries, academics, admissions, applications, and settings.
- Keep admin editing workflows clear for non-technical staff. Improve image previews, upload/replace/remove states, gallery ordering, form validation, navigation, and responsive dashboard layouts where relevant.
- Preserve Sindhi/Urdu/English content, accessibility, SEO, current database behavior, and all existing admin capabilities.
- Never fabricate college statistics, admissions seats, notices, results, staff credentials, testimonials, or image credits.

## Non-negotiable change controls
- Hallmark is not permission to change authentication, authorization, admission rules, database migration, upload storage, or custom CSS behavior without explicit task scope.
- Record existing routes, fields, actions, and content wiring before redesign; verify they remain afterward.
- Run ESLint, TypeScript, production build, and relevant admin/public workflow checks. Do not claim checks passed unless actually run.
- Use a feature branch and PR. Do not merge to `main` or deploy without explicit approval.
