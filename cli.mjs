import config from "./config.json" with { type: "json" };
import { FixtureRadar } from "./src/adapters/fixture-radar.js";
import { FlywheelEngine } from "./src/core/engine.js";
import { PaperBroker } from "./src/core/paper-broker.js";

const engine = new FlywheelEngine({ config, radar: new FixtureRadar(), broker: new PaperBroker(500) });
console.log("FLYWHEEL · paper simulation · chain 4663\n");
for (let index = 0; index < 8; index += 1) {
  const event = engine.step();
  console.log(`${event.id}  ${event.signal.symbol.padEnd(6)} ${(event.signal.change5m * 100).toFixed(2).padStart(6)}%  drive=${event.neural.drive.toFixed(3)}  ${event.verdict.padEnd(12)}  $${event.portfolio.totalValueUsd.toFixed(2)}`);
}
