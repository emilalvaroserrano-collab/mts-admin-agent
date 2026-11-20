import { findZendeskInvite } from "./zendesk-invite";
import {
  gateEmail,
  notInvited,
  requireInviteDecision,
} from "./zendesk-gate.decision";

export {
  NOT_INVITED_MESSAGE,
  gateEmail,
  notInvited,
  requireInviteDecision,
} from "./zendesk-gate.decision";

/**
 * The MTS admin portal / user portal in Zendesk is the single source of truth
 * for who may use this frontend. Every sign-in path — email/password, Google,
 * Microsoft, or any future provider — has to resolve to an *active* user in
 * that directory before a local Better Auth identity or session exists.
 *
 * This replaces the old social-sign-in bypass: a Google/Microsoft identity on
 * its own no longer mints a local account. `findZendeskInvite` checks the
 * Zendesk directory first and falls back to the local customer/staff tables
 * when Zendesk is not configured, so local development still works.
 */
export async function requireZendeskInvite(email: unknown): Promise<void> {
  const normalized = gateEmail(email);
  const invited = await findZendeskInvite(normalized).catch(() => null);
  requireInviteDecision(normalized, Boolean(invited));
}

/** Re-exported so callers can build the same FORBIDDEN response if needed. */
export { notInvited as forbiddenInvite };
