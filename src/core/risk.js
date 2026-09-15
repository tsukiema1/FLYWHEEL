function check(id, label, passed, observed, limit) {
  return Object.freeze({ id, label, passed, observed, limit });
}

export function evaluateRisk(proposal, portfolio, policy) {
  const currentPosition = portfolio.positions[proposal.symbol]?.costUsd ?? 0;
  const resultingWeight = (currentPosition + proposal.amountUsd) / portfolio.cashStartUsd;
  const weightLimit = proposal.assetType === "PONS_TOKEN" ? policy.maxMemePositionWeight : policy.maxStockPositionWeight;
  const checks = [
    check("trade", "Trade size", proposal.amountUsd <= policy.maxTradeUsd, `$${proposal.amountUsd.toFixed(0)}`, `≤ $${policy.maxTradeUsd}`),
    check("position", "Position weight", resultingWeight <= weightLimit, `${(resultingWeight * 100).toFixed(1)}%`, `≤ ${(weightLimit * 100).toFixed(0)}%`),
    check("slippage", "Slippage", proposal.slippage <= policy.maxSlippage, `${(proposal.slippage * 100).toFixed(2)}%`, `≤ ${(policy.maxSlippage * 100).toFixed(2)}%`),
    check("asset", "Asset type", policy.allowedAssetTypes.includes(proposal.assetType), proposal.assetType, "allowlist"),
    check("drawdown", "Daily loss", portfolio.dailyLossUsd < policy.maxDailyLossUsd, `$${portfolio.dailyLossUsd.toFixed(0)}`, `< $${policy.maxDailyLossUsd}`),
    check("approval", "Human approval", proposal.amountUsd <= policy.requireHumanApprovalAboveUsd || proposal.humanApproved, proposal.humanApproved ? "approved" : "not required", `> $${policy.requireHumanApprovalAboveUsd}`)
  ];
  return Object.freeze({ passed: checks.every((item) => item.passed), checks, resultingWeight, weightLimit });
}
