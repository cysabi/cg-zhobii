import { createMemo, Index, Show } from "solid-js";
import { FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import bento, { client } from "./utils";

const Matches = () => {
  const teams = createMemo(() => bento().teams);
  const matches = createMemo(() => bento().matches);

  const getSeries = (match: ReturnType<typeof matches>[0]) => {
    let series = [0, 0];
    [match.games[2], match.games[3], match.games[6]].forEach((game) => {
      game.scoreline.forEach((score, i) => {
        if (score === 13) {
          series[i] += 1;
        }
      });
    });
    return series;
  };

  return (
    <div class="flex flex-col gap-5">
      <Index each={matches()}>
        {(match, matchI) => (
          <div class="p-5 border-2 rounded-md border-slate-700">
            <div class="flex justify-between items-center gap-5">
              {(["teamA", "teamB"] as const).map((teamI, i) => (
                <>
                  <Show when={i}>
                    <div class="font-bold text-3xl tabular-nums">
                      {getSeries(match())[0]}
                    </div>
                    <div class="uppercase text-2xl font-semibold text-slate-500 tracking-wider">
                      VS
                    </div>
                    <div class="font-bold text-3xl tabular-nums">
                      {getSeries(match())[1]}
                    </div>
                  </Show>
                  <FormControl
                    fullWidth
                    variant="filled"
                    class="bg-slate-950/75 rounded-t"
                  >
                    <InputLabel>
                      {{ teamA: "Team A", teamB: "Team B" }[teamI]}
                    </InputLabel>
                    <Select
                      value={match()[teamI]}
                      label={teamI}
                      class="w-full"
                      onChange={(e) => {
                        client.act("setMatchTeams", {
                          match: matchI,
                          [teamI]: e.target.value,
                        });
                      }}
                    >
                      <Index each={teams()}>
                        {(team) => (
                          <MenuItem value={team().name}>{team().name}</MenuItem>
                        )}
                      </Index>
                      <MenuItem value={-1}>
                        <div class="text-slate-500 italic">none</div>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </>
              ))}
            </div>
          </div>
        )}
      </Index>
    </div>
  );
};

export default Matches;
