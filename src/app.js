import { FixtureRadar } from "./adapters/fixture-radar.js";
import { FlywheelEngine } from "./core/engine.js";
import { PaperBroker } from "./core/paper-broker.js";

const config = await fetch("./config.json").then((response) => response.json());
const engine = new FlywheelEngine({ config, radar: new FixtureRadar(), broker: new PaperBroker(500) });
const canvas = document.querySelector("#brain-canvas");
const context = canvas.getContext("2d");
const stepButton = document.querySelector("#step-button");
const autoButton = document.querySelector("#auto-button");
let lastEvent = null;
let autoTimer = null;
let frame = 0;

const groups = [
  { name: "LC4", x: 0.2, y: 0.48, count: 36 },
  { name: "LPLC2", x: 0.43, y: 0.4, count: 28 },
  { name: "DNp01", x: 0.68, y: 0.47, count: 1 },
  { name: "DNa02", x: 0.84, y: 0.58, count: 8 }
];

function pseudo(index, salt) {
  const value = Math.sin(index * 91.733 + salt * 17.17) * 43758.5453;
  return value - Math.floor(value);
}

function pointFor(group, index) {
  const radius = 24 + pseudo(index, group.x * 10) * 68;
  const angle = pseudo(index, group.y * 10) * Math.PI * 2;
  return { x: canvas.width * group.x + Math.cos(angle) * radius, y: canvas.height * group.y + Math.sin(angle) * radius * 0.72 };
}

function drawBrain() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(116, 123, 112, .13)";
  context.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 40) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke(); }
  for (let y = 0; y <= canvas.height; y += 40) { context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke(); }

  const active = lastEvent?.neural.circuits ?? {};
  for (let groupIndex = 0; groupIndex < groups.length - 1; groupIndex += 1) {
    const from = groups[groupIndex];
    const to = groups[groupIndex + 1];
    for (let edge = 0; edge < 12; edge += 1) {
      const a = pointFor(from, edge);
      const b = pointFor(to, edge * 2 + 3);
      const lit = lastEvent?.neural.descendingSpike && (edge + frame) % 7 === 0;
      context.strokeStyle = lit ? "rgba(185,244,66,.7)" : "rgba(95,112,91,.2)";
      context.beginPath(); context.moveTo(a.x, a.y); context.bezierCurveTo((a.x + b.x) / 2, a.y - 50, (a.x + b.x) / 2, b.y + 50, b.x, b.y); context.stroke();
    }
  }

  groups.forEach((group) => {
    const fired = new Set(active[group.name] ?? []);
    for (let index = 0; index < group.count; index += 1) {
      const point = pointFor(group, index);
      const flicker = fired.has(index) && (frame + index) % 5 !== 0;
      context.fillStyle = flicker ? "#b9f442" : "#3b4638";
      context.beginPath(); context.arc(point.x, point.y, flicker ? 3.2 : 1.45, 0, Math.PI * 2); context.fill();
      if (flicker) {
        context.strokeStyle = "rgba(185,244,66,.22)";
        context.beginPath(); context.arc(point.x, point.y, 8, 0, Math.PI * 2); context.stroke();
      }
    }
  });
  frame += 1;
  window.requestAnimationFrame(drawBrain);
}

function currency(value, decimals = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}

function setBoolean(id, value) {
  const node = document.querySelector(`#${id}`);
  node.textContent = value ? "TRUE" : "FALSE";
  node.classList.toggle("true", value);
}

function renderChecks(checks) {
  const rows = document.querySelectorAll("#checks > div");
  checks.forEach((check, index) => {
    rows[index].querySelector("small").textContent = `${check.observed} / ${check.limit}`;
    const state = rows[index].querySelector("b");
    state.textContent = check.passed ? "PASS" : "BLOCK";
    state.className = check.passed ? "pass" : "block";
  });
}

function renderLedger() {
  const ledger = document.querySelector("#ledger");
  ledger.innerHTML = engine.ledger.map((event) => {
    const neural = event.neural.descendingSpike ? "DN SPIKE" : "NO SPIKE";
    const risk = event.risk.passed ? "PASS" : "BLOCK";
    const className = event.verdict === "PAPER_BUY" ? "paper-buy" : event.verdict.includes("BLOCKED") ? "risk-blocked" : "";
    return `<tr><td>${event.id.toUpperCase()}</td><td>${event.signal.symbol} · ${(event.signal.change5m * 100).toFixed(2)}%</td><td>${neural}</td><td>${risk}</td><td class="${className}">${event.verdict.replaceAll("_", " ")}</td><td>${currency(event.portfolio.totalValueUsd)}</td></tr>`;
  }).join("");
  document.querySelector("#event-count").textContent = `${engine.ledger.length} EVENTS`;
}

function render(event) {
  lastEvent = event;
  const { signal, encoded, neural, risk, portfolio, verdict } = event;
  document.querySelector("#tick").textContent = String(event.tick).padStart(3, "0");
  document.querySelector("#symbol").textContent = signal.symbol;
  const change = document.querySelector("#change");
  change.textContent = `${signal.change5m >= 0 ? "+" : ""}${(signal.change5m * 100).toFixed(2)}%`;
  change.className = signal.change5m >= 0 ? "positive" : "negative";
  document.querySelector("#conviction").textContent = signal.conviction.toFixed(1);
  document.querySelector("#score").textContent = signal.averageScore;
  document.querySelector("#liquidity").textContent = currency(signal.liquidityUsd, 0);
  [["lc4", encoded.LC4], ["lplc2", encoded.LPLC2], ["dopamine", encoded.dopamineGate]].forEach(([id, value]) => { document.querySelector(`#${id}`).value = value; document.querySelector(`#${id}-value`).textContent = value.toFixed(3); });
  setBoolean("rising", encoded.rising); setBoolean("flow", encoded.strongFlow); setBoolean("liq-gate", encoded.liquidityGate === 1);
  document.querySelector("#encoder-state").textContent = neural.sensoryActive ? "DRIVING" : "QUIET";
  document.querySelector("#drive-value").textContent = neural.drive.toFixed(3);
  const spike = document.querySelector("#spike-state"); spike.textContent = neural.descendingSpike ? "SPIKE" : "NO SPIKE"; spike.className = neural.descendingSpike ? "fired" : "";
  document.querySelector("#risk-state").textContent = risk.passed ? "6 / 6 PASS" : `${risk.checks.filter((item) => item.passed).length} / 6 PASS`;
  renderChecks(risk.checks);
  const verdictMark = document.querySelector("#verdict-mark");
  verdictMark.className = `verdict-mark ${verdict === "PAPER_BUY" ? "buy" : verdict.includes("BLOCKED") ? "blocked" : ""}`;
  document.querySelector("#verdict").textContent = verdict.replaceAll("_", " ");
  document.querySelector("#verdict-detail").textContent = verdict === "PAPER_BUY" ? `${currency(event.order.amountUsd)} paper filled` : verdict === "RISK_BLOCKED" ? "Neural spike denied by policy" : "Descending circuit stayed quiet";
  document.querySelector("#portfolio-value").textContent = currency(portfolio.totalValueUsd);
  const pnl = document.querySelector("#pnl"); pnl.textContent = `${portfolio.unrealizedPnlUsd >= 0 ? "+" : ""}${currency(portfolio.unrealizedPnlUsd)}`; pnl.className = portfolio.unrealizedPnlUsd >= 0 ? "positive" : "negative";
  renderLedger();
}

function step() { render(engine.step()); }
stepButton.addEventListener("click", step);
autoButton.addEventListener("click", () => {
  if (autoTimer) { window.clearInterval(autoTimer); autoTimer = null; autoButton.textContent = "Start loop"; autoButton.classList.remove("running"); return; }
  step(); autoTimer = window.setInterval(step, config.loopIntervalMs); autoButton.textContent = "Stop loop"; autoButton.classList.add("running");
});
drawBrain();
