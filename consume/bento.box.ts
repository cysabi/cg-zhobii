import bento from "bento";
import { join } from "path";
import { consola } from "consola";
import { parseYAML } from "confbox";
import type { State } from "./types";

bento.box<State>(
  {
    config: {},
    settings: {
      size: 2800 / 3,
      spinBase: 8,
      spinRandom: 4,
      maxSpeed: 2,
      idleSpeed: -0.0005,
      friction: 0.00075,
    },
    status: { state: "idle" },
    setStatus: (set, payload: State["status"]) => {
      set((state) => {
        state.status = payload;
        consola.info(` Set status to ${JSON.stringify(payload)}`);
      });
    },
    setSetting: (set, payload: [keyof State["settings"], number]) => {
      set((state) => {
        state.settings[payload[0]] = payload[1];
        consola.info(` Set setting '${payload[0]}' to ${payload[1]}`);
      });
    },
    setConfig: async (set, payload) => {
      set((state) => {
        consola.box(
          `Serving at http://localhost:4400\nDashboard at http://localhost:4400/#/dashboard`
        );
        state.config = payload;
        consola.success(` Loaded ${Object.keys(payload).length} modifiers!`);
      });
    },
  },
  async (act) => {
    const text = await Bun.file(join(process.cwd(), "config.yaml")).text();
    act("setConfig", parseYAML<State["config"]>(text));
  }
);
