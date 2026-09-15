import { encodeMarket } from "./encoder.js";
import { stepSurrogate } from "./brain.js";
import { evaluateRisk } from "./risk.js";

export class FlywheelEngine {
  constructor({ config, radar, broker, brain = stepSurrogate }) {
    this.config = config;
    this.radar = radar;
    this.broker = broker;
    this.brain = brain;
    this.tick = 0;
    this.ledger = [];
  }

  step() {
    const signal = this.radar.next();
    this.broker.mark(signal.symbol, signal.price);
    const encoded = encodeMarket(signal, this.config.signal);
    const neural = this.brain(encoded, this.tick);
    const proposal = { symbol: signal.symbol, assetType: signal.assetType, amountUsd: signal.assetType === "PONS_TOKEN" ? 5 : 50, slippage: 0.005, humanApproved: false };
    const risk = evaluateRisk(proposal, this.broker.snapshot(), this.config.risk);
    const eligible = neural.descendingSpike && encoded.rising && encoded.strongFlow && encoded.liquidityGate === 1;
    let order = null;
    let verdict = "NO_SPIKE";

    if (eligible && !risk.passed) verdict = "RISK_BLOCKED";
    if (eligible && risk.passed) {
      try {
        order = this.broker.buy(proposal, signal.price);
        verdict = "PAPER_BUY";
      } catch (error) {
        verdict = "CASH_BLOCKED";
      }
    }

    const event = Object.freeze({ id: `tick-${String(this.tick + 1).padStart(3, "0")}`, tick: this.tick + 1, signal, encoded, neural, risk, proposal, order, verdict, portfolio: this.broker.snapshot(), timestamp: new Date().toISOString() });
    this.ledger.unshift(event);
    this.tick += 1;
    return event;
  }
}
