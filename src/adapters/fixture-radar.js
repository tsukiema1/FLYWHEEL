export const fixtureSignals = Object.freeze([
  { symbol: "MOTH", address: "0x0a11...beef", price: 0.082, change5m: 0.011, conviction: 4.2, averageScore: 71, liquidityUsd: 68000, assetType: "PONS_TOKEN" },
  { symbol: "NVDAx", address: "0x4663...01a7", price: 184.12, change5m: 0.026, conviction: 7.8, averageScore: 81, liquidityUsd: 128000, assetType: "STOCK_TOKEN" },
  { symbol: "THORN", address: "0x0b13...dead", price: 0.014, change5m: 0.041, conviction: 6.4, averageScore: 77, liquidityUsd: 22000, assetType: "PONS_TOKEN" },
  { symbol: "AAPLx", address: "0x4663...09f2", price: 237.48, change5m: -0.018, conviction: 8.1, averageScore: 84, liquidityUsd: 141000, assetType: "STOCK_TOKEN" },
  { symbol: "LARVA", address: "0x0c14...cafe", price: 0.031, change5m: 0.033, conviction: 9.2, averageScore: 86, liquidityUsd: 93000, assetType: "PONS_TOKEN" },
  { symbol: "MSFTx", address: "0x4663...14c8", price: 512.3, change5m: 0.024, conviction: 5.9, averageScore: 76, liquidityUsd: 146000, assetType: "STOCK_TOKEN" },
  { symbol: "MOTH", address: "0x0a11...beef", price: 0.074, change5m: -0.097, conviction: 2.1, averageScore: 69, liquidityUsd: 61000, assetType: "PONS_TOKEN" },
  { symbol: "NVDAx", address: "0x4663...01a7", price: 189.86, change5m: 0.031, conviction: 10.4, averageScore: 88, liquidityUsd: 134000, assetType: "STOCK_TOKEN" }
]);

export class FixtureRadar {
  constructor(signals = fixtureSignals) {
    this.signals = signals;
    this.cursor = 0;
  }

  next() {
    const signal = this.signals[this.cursor % this.signals.length];
    this.cursor += 1;
    return structuredClone(signal);
  }
}
