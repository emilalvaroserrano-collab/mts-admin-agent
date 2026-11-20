import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  gateEmail,
  NOT_INVITED_MESSAGE,
  requireInviteDecision,
} from "./zendesk-gate.decision.ts";

describe("gateEmail", () => {
  it("normalizes a usable email", () => {
    assert.equal(gateEmail("  Ada@Example.COM  "), "ada@example.com");
  });

  it("rejects values that are not emails", () => {
    for (const value of [undefined, null, "", "   ", 42, "not-an-email"]) {
      assert.throws(() => gateEmail(value), (error: Error) => error.message === NOT_INVITED_MESSAGE);
    }
  });
});

describe("requireInviteDecision", () => {
  it("allows an invited directory user", () => {
    assert.doesNotThrow(() => requireInviteDecision("ada@example.com", true));
  });

  it("blocks anyone outside the directory, including social sign-ins", () => {
    assert.throws(
      () => requireInviteDecision("ada@example.com", false),
      (error: Error) => error.message === NOT_INVITED_MESSAGE,
    );
  });
});
