import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
} from "solid-js";
import pointer from "./pointer.png";
import wheel from "./wheel.png";
import line from "./line.png";
import type { State } from "../types";
import type { Client } from "bento/client";
import clsx from "clsx";

const App = (props: { bento: Accessor<State>; client: Client<State> }) => {
  const segments = createMemo(() => {
    const totalWeight = Object.values(props.bento()?.config || {})
      .filter((v) => v)
      .reduce((sum, modifier) => sum + modifier.weight, 0);
    let total = 0;
    return Object.entries(props.bento()?.config || {})
      .filter((v) => v[1])
      .map(([key, value]) => {
        const angle = (value.weight / totalWeight) * (2 * Math.PI);
        const segment = {
          name: key,
          ...value,
          angle: angle,
          rotate: total + angle / 2,
        };
        total = total + angle;
        return segment;
      });
  });

  const breakpoints = createMemo(() => {
    let breakpoints = [0] as number[];
    segments().reduceRight((total, seg) => {
      const next = total + seg.angle;
      breakpoints.push(next);
      return next;
    }, 0);
    return breakpoints.toReversed();
  });

  const findOption = () => {
    console.log(
      breakpoints(),
      breakpoints().map(
        (bp) => bp - ((Math.PI / 2 + rotation()) % (2 * Math.PI))
      ),
      breakpoints()
        .map((bp) => bp - ((Math.PI / 2 + rotation()) % (2 * Math.PI)))
        .findLastIndex((bp) => bp > 0)
    );
    const i = breakpoints()
      .map((bp) => bp - ((Math.PI / 2 + rotation()) % (2 * Math.PI)))
      .findLastIndex((bp) => bp > 0);
    return segments()[i];
  };

  const [rotation, setRotation] = createSignal(0);

  let velocity = 0;
  let prevDelta = 0;
  createEffect(() => {
    const state = props.bento().status.state;
    if (state === "spin") {
      velocity =
        props.bento().settings.spinBase +
        (Math.random() - 0.5) * props.bento().settings.spinRandom;
    }
    return state;
  });
  function process(delta: number) {
    const t = delta - prevDelta;
    velocity = Math.max(
      velocity - velocity * props.bento().settings.friction * t,
      0
    );
    let distance = Math.min(velocity / t, props.bento().settings.maxSpeed);
    if (props.bento().status.state === "idle") {
      distance = props.bento().settings.idleSpeed;
    }
    setRotation((rotation() + distance + 2 * Math.PI) % (2 * Math.PI));
    if (props.bento().status.state === "spin" && distance < 0.0001) {
      velocity = 0;
      props.client.act("setStatus", {
        state: "done",
        option: findOption().name,
      });
    }

    prevDelta = delta;
    window.requestAnimationFrame(process);
  }
  window.requestAnimationFrame(process);

  return (
    <div class="h-screen w-screen flex flex-col gap-10 items-center justify-center overflow-clip">
      <div
        class="relative flex items-center justify-center bg-center bg-cover"
        style={{ "background-image": `url('${wheel}')` }}
      >
        <div
          class="overflow-clip rounded-full flex items-center justify-center"
          style={{
            height: `${props.bento().settings.size}px`,
            width: `${props.bento().settings.size}px`,
            rotate: `${rotation()}rad`,
          }}
        >
          <div class="relative">
            <For each={segments()}>
              {(segment) => {
                return (
                  <div
                    class={
                      "absolute flex flex-col items-center justify-end translate-x-[-50%] origin-top"
                    }
                    style={{
                      height: `${props.bento().settings.size / 2}px`,
                      width: `${
                        props.bento().settings.size *
                        Math.tan(segment.angle / 2)
                      }px`,
                      rotate: `${segment.rotate}rad`,
                      "clip-path": "polygon(50% 0%, 0% 100%, 100% 100%)",
                    }}
                  >
                    <div
                      class={clsx(
                        "h-full w-full flex items-center justify-end pb-14 text-xl",
                        props.bento().status.option
                          ? props.bento().status.option === segment.name
                            ? "text-white font-bold tracking-wide"
                            : "text-slate-400"
                          : "text-white"
                      )}
                      style={{ "writing-mode": "vertical-lr" }}
                    >
                      {segment.name}
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
          <div class="absolute pointer-events-none inset-0">
            <For each={breakpoints()}>
              {(bp) => (
                <img
                  src={line}
                  class="absolute origin-center"
                  style={{ rotate: `-${bp}rad` }}
                />
              )}
            </For>
          </div>
        </div>
        <div class="absolute inset-0">
          <img class="h-full w-full rotate-90" src={pointer} />
        </div>
        <div class="absolute right-0 translate-x-[100%]">
          <div
            class={clsx(
              "flex flex-col w-md text-4xl",
              props.bento().status.option
                ? "text-black font-bold tracking-wide"
                : "text-slate-400"
            )}
          >
            <div>{props.bento().status.option || findOption()?.name}</div>
            <Show when={props.bento().status.option}>
              <div class="text-3xl font-normal text-slate-800">
                {props.bento().config[props.bento().status.option!].desc}
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
