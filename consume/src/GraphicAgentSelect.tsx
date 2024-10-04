import { createMemo, Index, Show } from "solid-js";
import bento, { findWinner, getSeries } from "./utils";
import clsx from "clsx";

const Teams = () => {
  const match = createMemo(() =>
    bento().currentMatch !== null
      ? bento().matches[bento().currentMatch!]
      : null
  );

  const game = createMemo(() => {
    const games = match()?.games;
    if (games) {
      return [games[2], games[3], games[6]].find((game) => {
        const winner = findWinner(game.scoreline);
        if (typeof winner !== "number") {
          return true;
        }
      });
    }
  });

  const teams = createMemo(() => {
    const series = getSeries(match());
    const teams = [
      {
        team: bento().teams.find((team) => team.name === match()?.teamA),
        series: series[0],
      },
      {
        team: bento().teams.find((team) => team.name === match()?.teamB),
        series: series[1],
      },
    ];
    if (!game()?.swapSides) {
      teams.reverse();
    }
    return teams;
  });

  return (
    <div class="h-full w-full font-['One_Little_Font'] flex text-yellow text-7xl">
      <Index each={teams()}>
        {(team, i) => (
          <>
            <Show when={i}>
              <span class="flex mb-auto">
                <span class="flex flex-col p-7 items-center bg-black/50">
                  {teams()[0].series}
                </span>
                <div class="flex flex-col">
                  <div class="bg-black/50 flex-1"></div>
                  <div class="w-[108px] h-[82px] shrink-0 flex flex-col items-center"></div>
                  <div class="bg-black/50 flex-1"></div>
                </div>
                <span class="flex flex-col p-7 items-center bg-black/50">
                  {teams()[1].series}
                </span>
              </span>
            </Show>
            <div class="flex-1 flex flex-col">
              <div
                class={clsx(
                  "flex items-center gap-7 p-7 bg-black/50",
                  i && "flex-row-reverse"
                )}
              >
                <div class="h-14 w-14">
                  <img src={team().team?.logo_url} class="h-full w-full" />
                </div>
                <div>{team().team?.name}</div>
              </div>
            </div>
          </>
        )}
      </Index>
    </div>
  );
};

export default Teams;
