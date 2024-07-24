import {
  createEffect,
  createMemo,
  createSignal,
  Index,
  onCleanup,
  Show,
} from "solid-js";
import bento, { maps } from "./utils";
import { State } from "../types";
import clsx from "clsx";
import gsap from "gsap";

const Maps = () => {
  const match = createMemo(() =>
    bento().currentMatch !== null
      ? bento().matches[bento().currentMatch!]
      : null
  );
  const games = createMemo(() => match()?.games || []);
  const teams = createMemo(() => {
    return [
      bento().teams.find((team) => team.name === match()?.teamA)!,
      bento().teams.find((team) => team.name === match()?.teamB)!,
    ];
  });

  createEffect(() => {
    let ctx = gsap.context(() => {
      if (play()) {
        gsap
          .timeline()
          .fromTo(
            refs[0],
            { opacity: 0, y: 72 },
            { ease: "expo.out", opacity: 1, y: 0, duration: 1, stagger: 0.1 }
          )
          .fromTo(
            refs[1],
            { opacity: 0, scale: 1.5, rotate: 360 * 1.5 },
            {
              ease: "back.out(1)",
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 1.5,
              stagger: 1,
            }
          );
      } else {
        gsap.timeline().to(refs, { opacity: 0, duration: 0.5 });
      }
    });
    onCleanup(() => ctx.kill());
  });

  let refs: HTMLDivElement[][] = [[], []];
  const [play, setPlay] = createSignal(false as false | number);
  document.addEventListener("keypress", (e) => {
    if (e.key === "1") {
      setPlay(Date.now());
    } else if (e.key === "2") {
      setPlay(false);
    }
  });

  return (
    <div class="h-full w-full flex items-center p-[42px] gap-[42px] font-['One_Little_Font'] text-white">
      <Index each={games()}>
        {(game, i) => (
          <Map
            refs={refs}
            i={i}
            teams={teams()}
            match={match()}
            game={game()}
          />
        )}
      </Index>
    </div>
  );
};

const Map = (props: {
  teams: State["teams"];
  refs: HTMLDivElement[][];
  i: number;
  match: State["matches"][number] | null;
  game: State["matches"][number]["games"][number];
}) => {
  const team = createMemo(() => {
    if (props.i === 6) {
      return null;
    }
    return props.teams[props.i % 2];
  });
  const map = createMemo(() => ({
    name: props.game.map,
    img: maps[props.game.map!]?.img,
  }));
  const pick = createMemo(() => {
    if (!("scoreline" in props.game)) {
      return;
    }
    return {
      atk: props.game.swapSides ? props.teams[1] : props.teams[0],
      def: props.game.swapSides ? props.teams[0] : props.teams[1],
    };
  });

  return (
    <div
      ref={props.refs[0][props.i]}
      class={clsx(
        "h-[640px] flex-1 relative py-7 flex items-center justify-center font-medium",
        pick() === undefined ? "bg-black/50" : "bg-yellow/50"
      )}
    >
      <div class="absolute inset-0">
        <div
          class={clsx("relative h-[460px] -translate-y-3.5 translate-x-3.5")}
        >
          <div
            ref={props.refs[1][props.i]}
            class="absolute inset-0 overflow-clip"
          >
            <Show when={map().img}>
              <img
                class={clsx(
                  "h-full w-full object-cover",
                  pick() === undefined && "brightness-50 grayscale"
                )}
                src={map().img}
              />
              <div class="absolute inset-0 text-4xl flex flex-col justify-start text-center">
                <div
                  class={clsx(
                    "mt-7 py-3.5",
                    pick() === undefined
                      ? "bg-yellow/50 line-through opacity-75"
                      : "bg-black/50"
                  )}
                >
                  {map().name}
                </div>
              </div>
              <Show when={pick()}>
                <div class="absolute inset-0 text-4xl flex flex-col justify-end text-center">
                  <div class="bg-gradient-to-t from-yellow/50 to-transparent flex pb-1">
                    <div class="flex-1 flex flex-col gap-1 items-center">
                      <div class="h-7 w-7">
                        <img
                          src={pick()?.atk?.logo_url}
                          class="h-full w-full"
                        />
                      </div>
                      <div>ATK</div>
                    </div>
                    <div class="flex-1 flex flex-col gap-1 items-center">
                      <div class="h-7 w-7">
                        <img
                          src={pick()?.def?.logo_url}
                          class="h-full w-full"
                        />
                      </div>
                      <div>DEF</div>
                    </div>
                  </div>
                </div>
              </Show>
            </Show>
          </div>
          <div
            class={clsx(
              "absolute inset-0",
              pick() === undefined
                ? "bg-yellow/25 z-10 mix-blend-overlay"
                : "bg-black/25 -z-10"
            )}
          />
          <div
            class={clsx(
              "absolute inset-0 z-10 border-4 border-dashed",
              pick() === undefined ? "border-yellow/50" : "border-black/50"
            )}
          />
        </div>
      </div>
      <div class="absolute inset-0 flex flex-col gap-3.5 mt-auto w-full items-center justify-center h-[calc(640px-460px+14px)]">
        <div class="h-14 w-14">
          <Show when={props.i !== 6}>
            <img src={team()?.logo_url} class="h-full w-full" />
          </Show>
        </div>
        <Show
          when={pick()}
          fallback={<div class="text-5xl text-red-500 uppercase">ban</div>}
        >
          <div class="text-5xl uppercase">
            {props.i === 6 ? "decider" : "pick"}
          </div>
        </Show>
      </div>
    </div>
  );
};

export default Maps;
