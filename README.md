# FLYWHEEL

**A connectome-gated paper trading simulator for Robinhood Chain.**

FLYWHEEL maps market momentum and wallet conviction into a fly-inspired sensory circuit. A descending spike can propose a trade, but a deterministic risk gate has the final word. Version 0.1 is simulation-only and contains no wallet signer or transaction broadcaster.

[Open the live console](https://tsukiema1.github.io/flywheel/) · [Architecture](docs/ARCHITECTURE.md) · [Claims and evidence](docs/CLAIMS.md) · [Security](SECURITY.md)

## What is real

- A deterministic market encoder with explicit thresholds
- A neural surrogate for instant browser demos, clearly labelled in the UI
- An optional bridge to the real 166,700-neuron MaleCNS network through `flybrain 0.1.0`
- Six pure-code risk checks
- A stateful `$500` paper portfolio
- An append-only in-session decision ledger
- Fixture scenarios that exercise buy, no-spike, liquidity rejection, and position-limit rejection

## What is not real

- The `$500 -> $19,400` hook is not presented as performance. It is an unverified narrative simulation number.
- The default browser animation is not the complete connectome.
- There is no undocumented FOMO API call hidden in the code.
- There is no live trading path.

## Run the console

Requirements: Node.js 20 or newer.

```bash
npm run dev
```

Open `http://127.0.0.1:4173`, then press **Advance 20 seconds**. No package installation is required.

Run the complete fixture tape in the terminal:

```bash
npm run simulate
```

Run tests:

```bash
npm test
```

## Use the real connectome

The browser defaults to `surrogate` so the project opens instantly on GitHub Pages. The optional local bridge uses the published package and downloads the MaleCNS files on first use.

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements-connectome.txt
flybrain download
python python/flybrain_bridge.py
```

Send one JSON object per line:

```json
{"LC4": 0.8, "LPLC2": 0.7, "steps": 10}
```

The bridge returns observed descending-neuron activity as JSON. It never receives a private key or transaction payload.

## Decision path

```text
fixture radar
    ↓
market encoder: momentum + conviction + reputation + liquidity
    ↓
neural adapter: browser surrogate OR local MaleCNS bridge
    ↓
descending spike?
    ↓
hard risk gate: size / position / slippage / asset / drawdown / approval
    ↓
paper broker only
```

The neural signal is experimental input, not authority. Even a spike cannot bypass `config.json`.

## Robinhood Chain

The checked network values are:

| Field | Value |
| --- | --- |
| Mainnet chain ID | `4663` |
| Gas token | `ETH` |
| Public RPC | `https://rpc.mainnet.chain.robinhood.com` |
| Explorer | `https://robinhoodchain.blockscout.com` |

The public RPC is rate-limited and not intended for production. FLYWHEEL does not call it in v0.1.

## Repository map

```text
src/core/                 deterministic domain logic
src/adapters/             replaceable input adapters and fixtures
python/flybrain_bridge.py optional MaleCNS process bridge
tests/                    encoder, risk, and end-to-end tests
docs/ARCHITECTURE.md      boundaries and production gaps
docs/CLAIMS.md            verified facts and explicit non-claims
config.json               network, signal, and risk policy
index.html                static product console
```

## Why a fly brain

This is an experiment in using a fixed biological wiring diagram as a reservoir between noisy observations and a conventional decision system. It is not a claim that a fly understands markets. The correct comparison is not "AI versus fly". The useful question is whether activity from real wiring contributes anything beyond deterministic thresholds or randomized networks.

## Credits

The MaleCNS v1.0 connectome is credited to FlyEM at HHMI Janelia, the University of Cambridge, the MRC Laboratory of Molecular Biology, Google Research, and collaborators. The dataset is available under CC BY 4.0. The `flybrain` code is maintained separately and released under MIT.

- [Google Research: complete male fruit fly brain](https://research.google/blog/a-connectomics-milestone-mapping-the-complete-male-fruit-fly-brain/)
- [flybrain on PyPI](https://pypi.org/project/flybrain/)
- [fly.ai source](https://github.com/alextitonis/fly.ai)
- [Robinhood Chain documentation](https://docs.robinhood.com/chain/connecting/)
- [FOMO Radar](https://fomoradar.app/)

## License

MIT. Connectome data remains under its own CC BY 4.0 terms and is not redistributed by this repository.
