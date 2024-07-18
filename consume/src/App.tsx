import { Accessor, createMemo, createSignal } from "solid-js";
import type { State } from "../types";
import type { Client } from "bento/client";
import clsx from "clsx";

const App = (props: { bento: State; client: Client<State> }) => {
  return (
    <div class="flex gap-10 p-10 bg-slate-950">
      <div class="flex flex-col gap-10 p-10 rounded-lg bg-slate-900"></div>
      <div class="flex flex-col gap-10 p-10 rounded-lg bg-slate-900"></div>
    </div>
  );
};

export default App;
