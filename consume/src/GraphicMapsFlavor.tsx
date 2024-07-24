import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";
import bento, { maps } from "./utils";
import { State } from "../types";
import clsx from "clsx";
import gsap from "gsap";

const MapsFlavor = () => {
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
            refs.map((r) => r[0]),
            { opacity: 0, y: 320 },
            { ease: "expo.out", opacity: 1, y: 0, duration: 2, stagger: 0.1 }
          )
          .fromTo(
            refs.map((r) => r.slice(1)),
            { y: 320 },
            {
              ease: "expo.out",
              y: 0,
              duration: 1,
              stagger: 0.1 / 3,
            },
            "<+0.5"
          )
          .fromTo(
            refs.map((r) => r.slice(1)),
            { opacity: 0 },
            {
              ease: "expo.out",
              opacity: 1,
              duration: 2,
              stagger: 0.1 / 3,
            },
            "<"
          );
      } else {
        gsap.timeline().to(refs, { opacity: 0, duration: 0.5 });
      }
    });
    onCleanup(() => ctx.kill());
  });

  let refs: HTMLDivElement[][] = [[], [], [], [], [], [], []];
  const [play, setPlay] = createSignal(false as false | number);
  document.addEventListener("keypress", (e) => {
    if (e.key === "1") {
      setPlay(Date.now());
    } else if (e.key === "2") {
      setPlay(false);
    }
  });

  return (
    <div class="h-full w-full flex items-center justify-center">
      <div class="grid grid-rows-2 grid-cols-5 font-['One_Little_Font'] text-white">
        <div class="col-start-1 h-80 w-80">
          <Game refs={refs[0]} i={0} teams={teams()} game={games()[0]} />
        </div>
        <div class="col-start-2 h-80 w-80">
          <Game refs={refs[1]} i={1} teams={teams()} game={games()[1]} />
        </div>
        <div class="row-span-2 w-80">
          <Game refs={refs[2]} i={2} teams={teams()} game={games()[2]} />
        </div>
        <div class="row-span-2 w-80">
          <Game refs={refs[3]} i={3} teams={teams()} game={games()[3]} />
        </div>
        <div class="col-start-1 h-80 w-80">
          <Game refs={refs[4]} i={4} teams={teams()} game={games()[4]} />
        </div>
        <div class="col-start-2 h-80 w-80">
          <Game refs={refs[5]} i={5} teams={teams()} game={games()[5]} />
        </div>
        <div class="row-start-1 col-start-5 row-span-2 w-80">
          <Game refs={refs[6]} i={6} teams={teams()} game={games()[6]} />
        </div>
      </div>
    </div>
  );
};

const Game = (props: {
  refs: HTMLDivElement[];
  i: number;
  teams: State["teams"];
  game: State["matches"][number]["games"][number];
}) => {
  const mapImg = createMemo(() => maps[props.game.map!]?.img);
  const ban = createMemo(() => {
    if ("scoreline" in props.game) {
      return null;
    }
    return props.i % 2 ? props.teams[1] : props.teams[0];
  });

  const pick = createMemo(() => {
    if (!("scoreline" in props.game)) {
      return null;
    }
    const done = props.game.scoreline.findIndex((score) => score === 13);
    return {
      done: done === -1 ? null : (done as 0 | 1),
      scoreline: props.game.scoreline,
      atk: props.game.swapSides ? props.teams[1] : props.teams[0],
      def: props.game.swapSides ? props.teams[0] : props.teams[1],
      team:
        props.i === 6
          ? "decider"
          : props.i % 2
          ? `${props.teams[1].name} pick`
          : `${props.teams[0].name} pick`,
    };
  });

  const scoreline = createMemo(() => pick()?.scoreline.sort((b, a) => a - b));

  return (
    <div class="h-full w-full relative text-4xl overflow-clip">
      <div ref={props.refs[0]} class="absolute inset-0 bg-black/75" />
      <div ref={props.refs[1]} class="absolute inset-0">
        <img
          class={clsx("h-full w-full object-cover", {
            "brightness-[33%] grayscale-[67%]": ban(),
          })}
          src={mapImg()}
        />
      </div>
      <Show
        when={ban()}
        fallback={
          <>
            <div
              ref={props.refs[2]}
              class={clsx(
                "absolute inset-0 flex flex-col gap-7 pb-10 items-center justify-center",
                pick()?.done !== null && "bg-neutral-900/75"
              )}
            >
              <Show when={pick()?.done !== null}>
                <div class="h-16 w-16">
                  <img
                    src={props.teams[pick()?.done!].logo_url}
                    class="h-full w-full object-center"
                  />
                </div>
                <div class="text-5xl">
                  {scoreline()?.[0]}-{scoreline()?.[1]}
                </div>
              </Show>
            </div>
            <div
              ref={props.refs[3]}
              class="absolute inset-0 flex flex-col justify-end"
            >
              <div class="h-40 from-black/50 via-black/35 to-transparent bg-gradient-to-t flex flex-col justify-end leading-none uppercase">
                <div class="text-xl px-2 py-1">
                  <Show when={pick()?.done === null}>
                    <div class="my-3.5">
                      <div class="leading-none uppercase flex">
                        <div class="w-11">atk:</div>
                        <div>{pick()?.atk.name}</div>
                      </div>
                    </div>
                  </Show>
                  <div class="leading-none uppercase flex justify-between">
                    <div>{props.game.map}</div>
                  </div>
                  <div class="text-2xl leading-none uppercase">
                    {pick()?.team}
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      >
        <div
          ref={props.refs[2]}
          class="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div class="text-red-500 text-8xl flex items-center">x</div>
        </div>
        <div
          ref={props.refs[3]}
          class="absolute inset-0 bg-gradient-to-t from-red-500/90 via-transparent to-transparent flex flex-col justify-end px-2 py-1 uppercase text-xl"
        >
          <div class="text-xl leading-none uppercase">{props.game.map}</div>
          <div class="text-2xl leading-none uppercase">{ban()?.name} ban</div>
        </div>
      </Show>
    </div>
  );
};

export default MapsFlavor;
