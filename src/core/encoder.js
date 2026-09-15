function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function encodeMarket(signal, thresholds) {
  const momentum = clamp(signal.change5m / Math.max(thresholds.minimumChange5m * 2, 0.001));
  const conviction = clamp((signal.conviction - 1) / 10);
  const reputation = clamp((signal.averageScore - 50) / 50);
  const liquidityBand = signal.liquidityUsd >= thresholds.minimumLiquidityUsd && signal.liquidityUsd <= thresholds.maximumLiquidityUsd ? 1 : 0;

  return Object.freeze({
    LC4: Number((momentum * 0.82).toFixed(3)),
    LPLC2: Number((momentum * conviction).toFixed(3)),
    dopamineGate: Number((conviction * reputation).toFixed(3)),
    liquidityGate: liquidityBand,
    rising: signal.change5m > thresholds.minimumChange5m,
    strongFlow: signal.conviction > thresholds.minimumConviction && signal.averageScore > thresholds.minimumAverageScore
  });
}
