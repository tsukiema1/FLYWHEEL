# FLYWHEEL architecture

FLYWHEEL is a paper-trading experiment with explicit trust boundaries. The neural layer may propose an action. It cannot authorize risk or transmit a transaction.

```text
RadarAdapter -> MarketEncoder -> BrainAdapter -> Proposal -> RiskGate -> PaperBroker
      |               |              |              |           |            |
  untrusted       deterministic   replaceable   inert data   pure code   simulation
```

## Runtime path

1. `RadarAdapter` yields a normalized signal. Version 0.1 uses committed fixtures because FOMO Radar does not publish a documented API contract.
2. `encodeMarket()` converts five-minute price change, conviction, wallet score, and liquidity into bounded currents.
3. The browser demo uses `stepSurrogate()`. It is deterministic and explicitly labelled as a surrogate.
4. `python/flybrain_bridge.py` is the optional local adapter for the real MaleCNS network through `flybrain 0.1.0`.
5. A descending spike is necessary but insufficient. Momentum, flow, and liquidity gates must also pass.
6. `evaluateRisk()` runs six deterministic checks. Neural output cannot alter them.
7. `PaperBroker` records a simulated fill. There is no signer or broadcaster in the repository.

## Trust boundaries

| Boundary | Rule |
| --- | --- |
| Market input | Treat as untrusted and stale until timestamp and provenance are verified. |
| Neural output | Treat as an experimental feature, never as authority. |
| Risk policy | Versioned configuration evaluated by pure code. |
| Wallet | Out of scope for v0.1. The process accepts no private key. |
| Execution | Paper only. A live adapter would require a separate threat model and approval protocol. |

## Production gaps

- A licensed, documented market and wallet-signal feed
- Token metadata and canonical-address verification
- Independent price source and stale-price handling
- Persistent ledger with tamper evidence
- Backtesting with fees, latency, failed quotes, and survivorship bias
- Random-network controls to test whether connectome structure adds signal
- Human approval and key isolation before any live executor exists
