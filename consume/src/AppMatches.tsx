import { createMemo, Index, Show } from "solid-js";
import { FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import bento, { client, getSeries } from "./utils";

const Matches = () => {
  const teams = createMemo(() => bento().teams);
  const matches = createMemo(() => bento().matches);

  return (
    <div class="flex flex-col gap-5">
      <Index each={matches()}>
        {(match, matchI) => (
          <div class="p-5 border-2 rounded-md border-slate-700">
            <div class="flex justify-between items-center gap-5">
              {(["teamA", "teamB"] as const).map((teamI, i) => (
                <>
                  <Show when={i}>
                    <div class="font-bold text-3xl">
                      {getSeries(match())[0]}
                    </div>
                    <div class="uppercase text-2xl font-medium text-slate-500 tracking-wider">
                      VS
                    </div>
                    <div class="font-bold text-3xl">
                      {getSeries(match())[1]}
                    </div>
                  </Show>
                  <FormControl
                    fullWidth
                    variant="filled"
                    class="bg-slate-950/75 rounded-t overflow-clip"
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
                      <MenuItem value={-1}>
                        <div class="text-slate-500 italic">empty</div>
                      </MenuItem>
                      <Index each={teams()}>
                        {(team) => (
                          <MenuItem value={team().name}>{team().name}</MenuItem>
                        )}
                      </Index>
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
