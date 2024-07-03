import { Accessor, createMemo, Show } from "solid-js";
import type { State } from "../types";
import type { Client } from "bento/client";
import clsx from "clsx";

const App = (props: { bento: Accessor<State>; client: Client<State> }) => {
  const bento = props.bento;

  const option = createMemo(() => {
    if (bento().status.option) {
      const config = bento().config[bento().status.option!];
      return {
        ...config,
        name: bento().status.option!,
      };
    } else return undefined;
  });

  return (
    <div class="h-screen w-screen flex items-center justify-center bg-slate-900 text-slate-50">
      <div class="flex flex-col rounded-lg bg-slate-700 max-w-md w-full shadow-lg p-5 gap-5 m-5">
        <div
          class={clsx(
            "flex flex-col rounded-md overflow-clip border-2",
            option()
              ? "border-green-400/20 bg-green-400/20"
              : "border-slate-400/20 bg-slate-400/20"
          )}
        >
          <span
            class={clsx(
              "uppercase font-bold px-1.5 p-2",
              option() ? "text-green-400" : "text-slate-400"
            )}
          >
            Selected Modifier:
          </span>
          <div class="flex flex-col gap-2 p-2 rounded bg-slate-700">
            <Show
              when={option()}
              fallback={<div class="text-lg text-slate-400 italic">none</div>}
            >
              <div class="text-xl">{option()?.name}</div>
              <div>{option()?.desc}</div>
            </Show>
          </div>
        </div>
        <Show
          when={bento().status.state === "spin"}
          fallback={
            <div class="flex gap-5">
              <button
                class="flex-1 px-4 py-1.5 rounded cursor-pointer transition-colors bg-emerald-600 hover:bg-emerald-500"
                onClick={() => props.client.act("setStatus", { state: "spin" })}
              >
                Spin
              </button>
              <Show when={bento().status.option}>
                <button
                  class="flex-1 px-4 py-1.5 rounded cursor-pointer transition-colors bg-yellow-600 hover:bg-yellow-500"
                  onClick={() =>
                    props.client.act("setStatus", { state: "idle" })
                  }
                >
                  Idle
                </button>
              </Show>
            </div>
          }
        >
          <button
            class="px-4 py-1.5 rounded cursor-pointer transition-colors bg-red-600 hover:bg-red-500"
            onClick={() => props.client.act("setStatus", { state: "idle" })}
          >
            Cancel
          </button>
        </Show>
        <div class="flex text-sm uppercase text-slate-400 font-bold tracking-wide gap-5">
          <div>
            total modifiers:{" "}
            <span class="text-slate-50 font-bold tracking-normal">
              {bento().keys}
            </span>
          </div>
          <div>
            current status:{" "}
            <span class="text-slate-50 font-bold tracking-normal">
              {bento().status.state}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
