"""JSON-lines bridge from FLYWHEEL market currents to flybrain 0.1.0.

This process never receives keys, quotes, or transactions. It only turns an
encoded stimulus into observable connectome activity.
"""

from __future__ import annotations

import json
import sys

from flybrain import FlyBrain


def main() -> None:
    brain = FlyBrain(device="auto")
    lc4 = brain.cells(["LC4"], side="L")
    lplc2 = brain.cells(["LPLC2"], side="L")
    dnp01 = set(brain.cells(["DNp01"], side="L"))
    dna02 = set(brain.cells(["DNa02"], side="L"))

    for line in sys.stdin:
        payload = json.loads(line)
        fired_total: set[int] = set()
        for _ in range(int(payload.get("steps", 10))):
            fired = brain.step(
                inject=[
                    (lc4, float(payload.get("LC4", 0.0))),
                    (lplc2, float(payload.get("LPLC2", 0.0))),
                ]
            )
            fired_total.update(int(index) for index in fired)

        response = {
            "mode": "connectome",
            "descendingSpike": bool((dnp01 | dna02) & fired_total),
            "DNp01": len(dnp01 & fired_total),
            "DNa02": len(dna02 & fired_total),
            "firedTotal": len(fired_total),
        }
        print(json.dumps(response), flush=True)


if __name__ == "__main__":
    main()
