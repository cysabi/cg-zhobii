import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
} from "solid-js";
import pointer from "./pointer.png";
import ring from "./ring.png";
import back from "./back.png";
import line from "./line.png";
import up from "./up.png";
import down from "./down.png";
import gradient from "./gradient.png";
// import bg from "./bg.png";
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
    return breakpoints.reverse();
  });

  const findOption = () => {
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
      velocity -
        Math.min(velocity, props.bento().settings.maxSpeed) *
          props.bento().settings.friction *
          t,
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
    <div
      class="h-screen w-screen flex gap-10 items-center justify-center overflow-clip"
      // style={{ "background-image": `url('${bg}')` }}
    >
      <div class="relative flex items-center justify-center">
        <img class="absolute inset-0" src={back} />
        <img class="absolute inset-0" src={ring} />
        <div
          class="overflow-clip rounded-full flex items-center justify-center"
          style={{
            height: `${props.bento().settings.size}px`,
            width: `${props.bento().settings.size}px`,
            transform: `rotate(${rotation()}rad)`,
          }}
        >
          <div class="relative">
            <For each={segments()}>
              {(segment) => {
                return (
                  <div
                    class={
                      "absolute flex flex-col items-center justify-end origin-top"
                    }
                    style={{
                      height: `${props.bento().settings.size / 2}px`,
                      width: `${
                        props.bento().settings.size *
                        Math.tan(segment.angle / 2)
                      }px`,
                      transform: `translateX(-50%) rotate(${segment.rotate}rad)`,
                      "clip-path": "polygon(50% 0%, 0% 100%, 100% 100%)",
                    }}
                  >
                    <div
                      class={clsx(
                        "h-full w-full flex items-center justify-end pb-14 text-xl",
                        props.bento().status.option
                          ? props.bento().status.option === segment.name
                            ? "text-theme-white"
                            : "text-theme-subtle"
                          : "text-theme-text"
                      )}
                      style={{
                        "writing-mode": "vertical-lr",
                        ...(props.bento().status.option === segment.name
                          ? {
                              "text-shadow": "var(--color-theme-glow) 0 0 5px",
                            }
                          : {}),
                      }}
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
                  style={{ transform: `rotate(-${bp}rad)` }}
                />
              )}
            </For>
          </div>
        </div>
        <div class="absolute inset-0">
          <img
            class="h-full w-full"
            style={{ transform: `rotate(90deg)` }}
            src={pointer}
          />
        </div>
        <div class="absolute right-0" style={{ transform: `translateX(100%)` }}>
          <div class="w-3xl ml-12 flex flex-col gap-6">
            <div class="relative font-['Harlowsi'] text-7xl p-4">
              <Show
                when={props.bento().status.option}
                fallback={
                  <div class="text-theme-subtle">{findOption()?.name}</div>
                }
              >
                <div
                  class="absolute inset-0 p-4 overflow-visible text-transparent bg-cover bg-center"
                  style={{
                    transform:
                      "translateY(9px) translateX(9px) scaleX(1.0125) scaleY(1.025)",
                    "background-image": `url('${gradient}')`,
                    "-webkit-background-clip": "text",
                  }}
                >
                  {props.bento().status.option}
                </div>
                <div
                  class="absolute inset-0 p-4 overflow-visible text-transparent bg-[#160094]/85"
                  style={{
                    transform: "translateY(4px) translateX(4px)",
                    "-webkit-background-clip": "text",
                  }}
                >
                  {props.bento().status.option}
                </div>
                <div
                  class="text-theme-white"
                  style={{ transform: "translateY(0px)" }}
                >
                  {props.bento().status.option}
                </div>
              </Show>
            </div>
            <Show when={props.bento().status.option}>
              <div class="flex flex-col">
                <img
                  src={up}
                  class="w-full z-10"
                  style={{
                    transform: "translateY(8px)",
                  }}
                />
                <div class="text-3xl mx-4 p-11 leading-relaxed text-theme-text bg-[#01002b]/70">
                  {props.bento().config[props.bento().status.option!].desc}
                </div>
                <img
                  src={down}
                  class="w-full z-10"
                  style={{
                    transform: "translateY(-8px)",
                  }}
                />
              </div>
            </Show>
          </div>
        </div>
      </div>
      <div class="w-3xl ml-12" />
    </div>
  );
};

export default App;
