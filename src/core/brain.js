function seededSpikes(seed, count, active) {
  let state = seed >>> 0;
  return Array.from({ length: count }, (_, index) => {
    state = (state * 1664525 + 1013904223) >>> 0;
    const noise = state / 4294967296;
    const threshold = active ? 0.46 : 0.86;
    return noise > threshold ? index : -1;
  }).filter((index) => index >= 0);
}

export function stepSurrogate(encoded, tick = 0) {
  const sensoryActive = encoded.rising && encoded.strongFlow && encoded.liquidityGate === 1;
  const drive = encoded.LC4 * 0.46 + encoded.LPLC2 * 0.34 + encoded.dopamineGate * 0.2;
  const normalizedDrive = Number(drive.toFixed(3));
  const descendingSpike = sensoryActive && normalizedDrive >= 0.48;
  const seed = Math.round((drive + tick + 1) * 100003);

  return Object.freeze({
    mode: "surrogate",
    sensoryActive,
    descendingSpike,
    drive: normalizedDrive,
    circuits: {
      LC4: seededSpikes(seed, 36, sensoryActive),
      LPLC2: seededSpikes(seed + 17, 28, sensoryActive),
      DNp01: descendingSpike ? [0] : [],
      DNa02: descendingSpike ? seededSpikes(seed + 41, 8, true) : []
    }
  });
}
