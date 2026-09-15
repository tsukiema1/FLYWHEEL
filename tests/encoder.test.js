import test from "node:test";
import assert from "node:assert/strict";
import config from "../config.json" with { type: "json" };
import { encodeMarket } from "../src/core/encoder.js";
import { stepSurrogate } from "../src/core/brain.js";

test("strong rising flow activates the sensory gate", () => {
  const encoded = encodeMarket({ change5m: 0.031, conviction: 8.2, averageScore: 83, liquidityUsd: 90000 }, config.signal);
  assert.equal(encoded.rising, true);
  assert.equal(encoded.strongFlow, true);
  assert.equal(encoded.liquidityGate, 1);
  assert.equal(stepSurrogate(encoded).descendingSpike, true);
});

test("a falling market cannot produce a buy spike", () => {
  const encoded = encodeMarket({ change5m: -0.04, conviction: 9.5, averageScore: 91, liquidityUsd: 90000 }, config.signal);
  assert.equal(encoded.rising, false);
  assert.equal(stepSurrogate(encoded).descendingSpike, false);
});

test("out-of-band liquidity closes the sensory gate", () => {
  const encoded = encodeMarket({ change5m: 0.05, conviction: 9.5, averageScore: 91, liquidityUsd: 22000 }, config.signal);
  assert.equal(encoded.liquidityGate, 0);
  assert.equal(stepSurrogate(encoded).descendingSpike, false);
});
