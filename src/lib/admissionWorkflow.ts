import type { AdmissionStatus } from "./types";

/**
 * The admission review process is a deliberate sequence, not a freeform
 * status dropdown: an application must be reviewed, then have its documents
 * verified, before it can be selected or waitlisted. REJECTED is reachable
 * from any non-terminal step (with a required reason). Shared between the
 * server action that enforces it and the admin UI that renders the allowed
 * next steps.
 */
export const ADMISSION_STATUS_TRANSITIONS: Record<AdmissionStatus, AdmissionStatus[]> = {
  RECEIVED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["DOCS_VERIFIED", "REJECTED"],
  DOCS_VERIFIED: ["SELECTED", "WAITLISTED", "REJECTED"],
  WAITLISTED: ["SELECTED", "REJECTED"],
  SELECTED: [],
  REJECTED: [],
};
