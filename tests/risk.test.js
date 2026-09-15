import test from "node:test";
import assert from "node:assert/strict";
import config from "../config.json" with { type: "json" };
import { evaluateRisk } from "../src/core/risk.js";

const portfolio = { cashStartUsd: 500, cashUsd: 500, dailyLossUsd: 0, positions: {} };

test("a bounded stock-token paper proposal passes", () => {
  const result = evaluateRisk({ symbol: "NVDAx", assetType: "STOCK_TOKEN", amountUsd: 50, slippage: 0.005, humanApproved: false }, portfolio, config.risk);
  assert.equal(result.passed, true);
  assert.equal(result.checks.length, 6);
});

test("meme exposure above one percent is blocked", () => {
  const result = evaluateRisk({ symbol: "LARVA", assetType: "PONS_TOKEN", amountUsd: 6, slippage: 0.005, humanApproved: false }, portfolio, config.risk);
  assert.equal(result.passed, false);
  assert.equal(result.checks.find((item) => item.id === "position").passed, false);
});

test("daily kill switch cannot be bypassed by a neural spike", () => {
  const result = evaluateRisk({ symbol: "NVDAx", assetType: "STOCK_TOKEN", amountUsd: 50, slippage: 0.005, humanApproved: false }, { ...portfolio, dailyLossUsd: 750 }, config.risk);
  assert.equal(result.passed, false);
  assert.equal(result.checks.find((item) => item.id === "drawdown").passed, false);
});
