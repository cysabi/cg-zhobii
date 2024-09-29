import { createMemo, Index, Show } from "solid-js";
import bento, { getSeries } from "./utils";
import { encodeTime } from "./AppTimer";
import { State } from "../types";

const Sidebar = () => {
  const timer = createMemo(() => encodeTime(bento().timer.value));

  return (
    <div class="h-full w-full max-w-2xl ml-auto flex flex-col p-8 gap-8 font-['One_Little_Font'] text-white">
      <div class="relative py-8 bg-yellow/75 flex items-center justify-center text-8xl font-medium">
        <div class="z-10 absolute inset-0 border-[4px] translate-x-1.5 -translate-y-1.5 border-dashed border-yellow/50"></div>
        <Index each={timer().split("")}>
          {(digit) => (
            <span class="w-[1ch] flex flex-col items-center">{digit()}</span>
          )}
        </Index>
      </div>
      <div class="relative flex-1 p-8 gap-8 bg-black/50 flex flex-col justify-evenly">
        <div class="z-10 absolute inset-0 border-[4px] translate-x-1.5 -translate-y-1.5 border-dashed border-black/25"></div>
        <Index each={bento().matches}>
          {(match) => {
            const series = createMemo(() => {
              let series = getSeries(match());
              if (series[0] === 0 && series[1] === 0) {
                return null;
              }
              return series;
            });

            const teams = createMemo(() => {
              return [
                bento().teams.find((team) => team.name === match().teamA),
                bento().teams.find((team) => team.name === match().teamB),
              ].sort((a, b) => (a?.seed ?? 0) - (b?.seed ?? 0));
            });

            return (
              <div class="flex items-center justify-between">
                <TeamBox team={teams()[0]} />
                <div class="w-32 flex flex-col items-center">
                  <Show
                    when={series() !== null}
                    fallback={
                      <div class="font-bold text-7xl tracking-wider">VS</div>
                    }
                  >
                    <div class="font-bold text-7xl tracking-wider">
                      {series()![0]}-{series()![1]}
                    </div>
                  </Show>
                </div>
                <TeamBox team={teams()[1]} />
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
};

const TeamBox = (props: { team?: State["teams"][number] }) => {
  return (
    <div class="flex-1 flex flex-col items-center gap-4">
      <Show
        when={props.team}
        fallback={<div class="text-5xl opacity-50">(tbd)</div>}
      >
        <div class="h-32 w-32">
          <img src={props.team?.logo_url} class="h-full w-full" />
        </div>
        <div class="text-3xl text-center uppercase h-20 flex items-center">
          {props.team?.name}
        </div>
      </Show>
    </div>
  );
};

export default Sidebar;
