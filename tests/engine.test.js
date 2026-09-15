import test from "node:test";
import assert from "node:assert/strict";
import config from "../config.json" with { type: "json" };
import { FixtureRadar } from "../src/adapters/fixture-radar.js";
import { FlywheelEngine } from "../src/core/engine.js";
import { PaperBroker } from "../src/core/paper-broker.js";

test("the fixture run exercises buy, quiet, and risk-blocked states", () => {
  const engine = new FlywheelEngine({ config, radar: new FixtureRadar(), broker: new PaperBroker(500) });
  const verdicts = Array.from({ length: 8 }, () => engine.step().verdict);
  assert.equal(verdicts[0], "NO_SPIKE");
  assert.equal(verdicts[1], "PAPER_BUY");
  assert.equal(verdicts[7], "RISK_BLOCKED");
  assert.equal(engine.ledger.length, 8);
});

test("the MVP exposes no live transaction executor", async () => {
  await assert.rejects(import("../src/adapters/live-executor.js"));
});
