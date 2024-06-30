import { Client } from "bento/client";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import "./index.css";
import wheeeeeeel from "./wheeeeeeel.png";

const initial = { config: {} } as {
  config: Record<string, { weight: number; desc: string }>;
};
const client = new Client({ initial });
const [state, setState] = createSignal<typeof initial>();
client.dispatch = setState;

const size = 720;
const spinBase = 5;
const spinRandom = 0;
const maxSpeed = 5;
const friction = 0.003;

const [option, setOption] = createSignal<string | null>(null);

const totalWeight = createMemo(() => {
  return Object.values(state()?.config || {})
    .filter((v) => v)
    .reduce((sum, modifier) => sum + modifier.weight, 0);
});
const segments = createMemo(() => {
  let total = 0;
  return Object.entries(state()?.config || {})
    .filter((v) => v[1])
    .map(([key, value]) => {
      const angle = (value.weight / totalWeight()) * (2 * Math.PI);
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

const findCursor = (spin: number) => {
  let breakpoints = [0] as number[];
  segments().reduceRight((total, seg) => {
    const next = total + seg.angle;
    breakpoints.push(next);
    return next;
  }, 0);
  return breakpoints
    .toReversed()
    .map((bp) => bp - ((Math.PI + spin) % (2 * Math.PI)))
    .findLastIndex((bp) => bp > 0);
};

const App = () => {
  let wheelRef: HTMLDivElement;

  let prevDelta = 0;
  let rotation = 0;
  let velocity = spinBase + (Math.random() - 0.5) * spinRandom;

  function process(delta: number) {
    const t = delta - prevDelta;
    velocity = Math.max(velocity - velocity * friction * t, 0);
    const distance = Math.min(velocity / t, maxSpeed);
    rotation = (rotation + distance) % (2 * Math.PI);
    wheelRef.style.rotate = `${rotation}rad`;
    if (distance < 0.0001) {
      velocity = 0;
      setOption(segments()[findCursor(rotation)].name);
    } else {
      window.requestAnimationFrame(process);
    }

    prevDelta = delta;
  }

  window.requestAnimationFrame(process);

  return (
    <div class="h-screen w-screen flex flex-col gap-10 items-center justify-center">
      <div>
        <div class="text-4xl font-semibold">{option()}</div>
      </div>
      <div
        class="relative flex items-center justify-center bg-center bg-cover p-[75px]"
        style={{ "background-image": `url('${wheeeeeeel}')` }}
      >
        <div
          ref={wheelRef!}
          class="overflow-clip rounded-full flex items-center justify-center"
          style={{ height: `${size}px`, width: `${size}px` }}
        >
          <div class="relative">
            <For each={segments()}>
              {(segment) => {
                console.log(segment);
                return (
                  <div
                    class="absolute flex items-center justify-center text-center p-8 translate-x-[-50%] left-[50%] top-0 origin-top"
                    style={{
                      "background-color": `#${Math.floor(
                        Math.random() * 256 ** 3
                      ).toString(16)}`,
                      height: `${size / 2}px`,
                      width: `${size * Math.tan(segment.angle / 2)}px`,
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

export default App;
