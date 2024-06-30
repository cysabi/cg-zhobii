import bento from "bento";
import { join } from "path";
import { consola } from "consola";
import { parseYAML } from "confbox";

type State = {
  config: Record<string, { weight: number; desc: string }>;
};

bento.box<State>(
  {
    config: {},
    setConfig: async (set, payload) => {
      set((state) => {
        consola.box(`Serving at http://localhost:4400`);
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
