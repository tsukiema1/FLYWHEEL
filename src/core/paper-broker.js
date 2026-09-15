export class PaperBroker {
  constructor(cashUsd = 500) {
    this.portfolio = { cashStartUsd: cashUsd, cashUsd, dailyLossUsd: 0, positions: {}, realizedPnlUsd: 0 };
  }

  buy(proposal, price) {
    if (proposal.amountUsd > this.portfolio.cashUsd) throw new Error("paper broker: insufficient cash");
    const quantity = proposal.amountUsd / price;
    const existing = this.portfolio.positions[proposal.symbol] ?? { quantity: 0, costUsd: 0, markPrice: price };
    existing.quantity += quantity;
    existing.costUsd += proposal.amountUsd;
    existing.markPrice = price;
    this.portfolio.positions[proposal.symbol] = existing;
    this.portfolio.cashUsd -= proposal.amountUsd;
    return { side: "BUY", symbol: proposal.symbol, quantity, price, amountUsd: proposal.amountUsd, status: "PAPER_FILLED" };
  }

  mark(symbol, price) {
    if (this.portfolio.positions[symbol]) this.portfolio.positions[symbol].markPrice = price;
  }

  value() {
    const positionsUsd = Object.values(this.portfolio.positions).reduce((sum, position) => sum + position.quantity * position.markPrice, 0);
    return this.portfolio.cashUsd + positionsUsd;
  }

  snapshot() {
    return structuredClone({ ...this.portfolio, totalValueUsd: this.value(), unrealizedPnlUsd: this.value() - this.portfolio.cashStartUsd - this.portfolio.realizedPnlUsd });
  }
}
