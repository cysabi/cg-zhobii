import { createMemo, createSignal, Index } from "solid-js";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@suid/material";
import bento, { client } from "./utils";
import clsx from "clsx";

const Bracket = () => {
  const bracket = createMemo(() => bento().bracket);

  return (
    <div class="flex gap-2">
      <Index each={bracket()}>
        {(round, r) => (
          <div class="flex-1 flex flex-col justify-around gap-2">
            <Index each={round()}>
              {(match, m) => {
                const winner = createMemo(() => {
                  if (match()[0][1] >= 2) return 0;
                  if (match()[1][1] >= 2) return 1;
                });

                return (
                  <div class="flex flex-col bg-slate-900/50 p-2 pt-1 rounded-md">
                    <Index each={match()}>
                      {(team, t) => {
                        const [input, setInput] = createSignal<
                          number | string | null
                        >(null);

                        return (
                          <div class="flex items-end gap-2">
                            <FormControl
                              class="overflow-clip rounded-t min-w-16"
                              fullWidth
                              variant="standard"
                              size="small"
                            >
                              <Select
                                value={team()[0]}
                                class="w-0 min-w-full"
                                onChange={(e) => {
                                  client.act("setBracket", [
                                    r,
                                    m,
                                    t,
                                    { team: e.target.value },
                                  ]);
                                }}
                              >
                                <MenuItem value={-1}>
                                  <div class="text-slate-500 italic">empty</div>
                                </MenuItem>
                                <Index each={bento().teams}>
                                  {(team) => (
                                    <MenuItem
                                      value={team().name}
                                      class="items-end"
                                    >
                                      <div
                                        class={clsx(
                                          "pt-[2px] flex items-end",
                                          winner() === t
                                            ? "text-indigo-300 font-extrabold tracking-wide"
                                            : "text-slate-300"
                                        )}
                                      >
                                        <div class="text-sm truncate">
                                          {team().name}
                                        </div>
                                      </div>
                                    </MenuItem>
                                  )}
                                </Index>
                              </Select>
                            </FormControl>
                            <TextField
                              value={input() === null ? team()[1] : input()}
                              class="w-16 shrink-0"
                              size="small"
                              variant="standard"
                              onChange={(e) => {
                                setInput(
                                  e.currentTarget.value.replace(/[^-?\d]+/g, "")
                                );
                              }}
                              onBlur={() => {
                                client.act("setBracket", [
                                  r,
                                  m,
                                  t,
                                  { score: input() },
                                ]);
                                setInput(null);
                              }}
                              InputProps={{
                                class: clsx(
                                  "text-lg",
                                  winner() === t
                                    ? "text-indigo-300 font-extrabold"
                                    : "text-slate-300 font-medium"
                                ),
                                endAdornment: (
                                  <div class="flex gap-1">
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      class="px-1 py-0.5 min-w-0"
                                      color="secondary"
                                      onClick={() =>
                                        client.act("setBracket", [
                                          r,
                                          m,
                                          t,
                                          { score: "+" },
                                        ])
                                      }
                                    >
                                      <div class="text-xs font-mono">+</div>
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      class="px-1 py-0.5 min-w-0"
                                      color="secondary"
                                      onClick={() =>
                                        client.act("setBracket", [
                                          r,
                                          m,
                                          t,
                                          { score: "-" },
                                        ])
                                      }
                                    >
                                      <div class="text-xs font-mono">-</div>
                                    </Button>
                                  </div>
                                ),
                              }}
                            />
                          </div>
                        );
                      }}
                    </Index>
                  </div>
                );
              }}
            </Index>
          </div>
        )}
      </Index>
    </div>
  );
};

export default Bracket;
