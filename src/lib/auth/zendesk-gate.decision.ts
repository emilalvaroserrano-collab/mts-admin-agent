import { APIError } from "better-auth/api";

/**
 * Pure, dependency-free part of the Zendesk sign-in gate. Kept separate from
 * the directory lookup so the invite rules can be unit tested without loading
 * the server-only `zendesk-invite` module.
 */

export const NOT_INVITED_MESSAGE = "This email is not invited to Manage Tech Service.";

export function notInvited(): APIError {
  return new APIError("FORBIDDEN", { message: NOT_INVITED_MESSAGE });
}

/** Normalize an email before it is checked. Throws when unusable. */
export function gateEmail(value: unknown): string {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!email.includes("@")) throw notInvited();
  return email;
}

/** Pure decision, so the "social identities are gated too" rule is testable. */
export function requireInviteDecision(email: string, invited: boolean): void {
  void email;
  if (!invited) throw notInvited();
}
