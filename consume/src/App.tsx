import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";
import wheeeeeeel from "./wheeeeeeel.png";
import type { State } from "../types";
import type { Client } from "bento/client";

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
    setRotation((rotation() + distance) % (2 * Math.PI));
    if (props.bento().status.state === "spin" && distance < 0.0001) {
      velocity = 0;
      const i = breakpoints()
        .map((bp) => bp - ((Math.PI + rotation()) % (2 * Math.PI)))
        .findLastIndex((bp) => bp > 0);
      props.client.act("setStatus", {
        state: "done",
        option: segments()[i].name,
      });
    }

    prevDelta = delta;
    window.requestAnimationFrame(process);
  }
  window.requestAnimationFrame(process);

  return (
    <div class="h-screen w-screen flex flex-col gap-10 items-center justify-center">
      <OptionBox bento={props.bento} />
      <div
        class="relative flex items-center justify-center bg-center bg-cover p-[75px]"
        style={{ "background-image": `url('${wheeeeeeel}')` }}
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
                    class="absolute flex items-center justify-center text-center p-8 translate-x-[-50%] left-[50%] top-0 origin-top"
                    style={{
                      "background-color": `#${Math.floor(
                        Math.random() * 256 ** 3
                      ).toString(16)}`,
                      height: `${props.bento().settings.size / 2}px`,
                      width: `${
                        props.bento().settings.size *
                        Math.tan(segment.angle / 2)
                      }px`,
                      rotate: `${segment.rotate}rad`,
                      "clip-path": "polygon(50% 0%, 0% 100%, 100% 100%)",
                    }}
                  >
                    <div class="font-bold text-white rotate-90 text-xl">
                      {segment.name}
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};

const OptionBox = (props: { bento: Accessor<State> }) => {
  const option = createMemo(() => {
    const status = props.bento().status;
    return status.state === "done" ? status.option : "";
  });
  return (
    <div>
      <div class="text-4xl font-semibold">{option()}</div>
    </div>
  );
};

export default App;
