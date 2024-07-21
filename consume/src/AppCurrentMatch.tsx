import { createMemo, createSignal, Index, Show } from "solid-js";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@suid/material";
import bento, { client, getSeries, maps } from "./utils";
import { Match, State } from "../types";
import clsx from "clsx";

const CurrentMatch = () => {
  const currentMatch = createMemo(() => bento().currentMatch);
  const match = createMemo(() =>
    bento().currentMatch !== null
      ? bento().matches[bento().currentMatch!]
      : null
  );

  const series = createMemo(() => {
    if (match() === null) return null;
    return getSeries(match()!);
  });

  return (
    <div class="flex flex-col w-full gap-5 p-5 rounded-lg bg-slate-800">
      <div class="text-xl uppercase tracking-wide text-slate-500 font-semibold">
        {match() === null ? "Bracket" : "Match Pick/Bans"}
      </div>
      <div class="flex flex-col gap-5">
        <div class="flex gap-5 items-center">
          <FormControl fullWidth variant="outlined" class="bg-slate-900/50">
            <InputLabel>Current Match</InputLabel>
            <Select
              value={currentMatch()}
              label="Current Match"
              class="w-full"
              onChange={(e) => {
                client.act("setCurrentMatch", e.target.value);
              }}
            >
              <MenuItem value={-1}>
                <div class="text-slate-500 italic">empty</div>
              </MenuItem>
              <Index each={bento().matches}>
                {(match, i) => (
                  <MenuItem value={i}>
                    {match().teamA} vs {match().teamB}
                  </MenuItem>
                )}
              </Index>
            </Select>
          </FormControl>
          <Show when={series()}>
            <div class="font-bold whitespace-nowrap tracking-wide text-3xl tabular-nums">
              {series()![0]} <span class="text-slate-500">-</span>{" "}
              {series()![1]}
            </div>
          </Show>
        </div>
        <Show
          when={match() !== null}
          fallback={
            <div class="border-2 rounded-md p-5 border-slate-700 flex gap-2">
              <SetBracket bracket={bento().bracket} />
            </div>
          }
        >
          <SetPickBans match={match()!} />
        </Show>
      </div>
    </div>
  );
};

const SetPickBans = (props: { match: Match }) => {
  const names = createMemo(() => [
    <span>
      <span class="font-semibold tracking-wide">Ban </span>
      <span class="text-slate-400">{props.match.teamA}</span>
    </span>,
    <span>
      <span class="font-semibold tracking-wide">Ban </span>
      <span class="text-slate-400">{props.match.teamB}</span>
    </span>,
    <span>
      <span class="font-semibold tracking-wide">Pick </span>
      <span class="text-slate-400">{props.match.teamA}</span>
    </span>,
    <span>
      <span class="font-semibold tracking-wide">Pick </span>
      <span class="text-slate-400">{props.match.teamB}</span>
    </span>,
    <span>
      <span class="font-semibold tracking-wide">Ban </span>
      <span class="text-slate-400">{props.match.teamA}</span>
    </span>,
    <span>
      <span class="font-semibold tracking-wide">Ban </span>
      <span class="text-slate-400">{props.match.teamB}</span>
    </span>,
    <span class="font-semibold tracking-wide">Last Pick</span>,
  ]);

  return (
    <div class="border-2 rounded-md p-5 border-slate-700 flex flex-col gap-3">
      <Index each={props.match.games}>
        {(game, i) => {
          const winner = createMemo(() => {
            const g = game();
            if (!("scoreline" in g)) return null;
            return (
              [props.match.teamA, props.match.teamB][
                g.scoreline.findIndex((score) => score === 13)
              ] ?? null
            );
          });

          return (
            <>
              <Show when={i}>
                <div class="border-t-2 border-slate-700 -mx-5"></div>
              </Show>
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-5">
                    <div class="uppercase text-xl">{names()[i]}</div>
                    <Show when={winner() !== null}>
                      <div class="bg-indigo-500/25 text-sm flex gap-1.5 rounded-md px-2.5 py-0.5 uppercase">
                        <span class="text-indigo-400">WIN:</span>
                        <span class="text-indigo-200 tracking-wide font-bold">
                          {winner()}
                        </span>
                      </div>
                    </Show>
                  </div>
                  <FormControl
                    class="max-w-44 w-full bg-slate-950/75 rounded-t overflow-clip"
                    fullWidth
                    variant="filled"
                    size="small"
                  >
                    <div class="relative">
                      <div
                        class="absolute inset-0 bg-center bg-cover opacity-25"
                        style={{
                          "background-image": `url('${
                            maps[game().map!]?.img
                          }')`,
                        }}
                      ></div>
                      <InputLabel>Map</InputLabel>
                      <Select
                        value={game().map}
                        onChange={(e) =>
                          client.act("setGame", { i, map: e.target.value })
                        }
                        label="Map"
                        class="w-full"
                      >
                        <MenuItem value={-1}>
                          <div class="text-slate-500 italic">empty</div>
                        </MenuItem>
                        <Index each={Object.keys(maps)}>
                          {(map) => (
                            <MenuItem value={map()}>
                              <div class="capitalize">{map()}</div>
                            </MenuItem>
                          )}
                        </Index>
                      </Select>
                    </div>
                  </FormControl>
                </div>
                <Show when={"swapSides" in game()}>
                  <AdditionalGameSettings
                    i={i}
                    match={props.match}
                    game={game() as any}
                  />
                </Show>
              </div>
            </>
          );
        }}
      </Index>
    </div>
  );
};

const SetBracket = (props: { bracket: State["bracket"] }) => (
  <Index each={props.bracket}>
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
                          class="overflow-clip rounded-t"
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
                                <MenuItem value={team().name} class="items-end">
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
);

const AdditionalGameSettings = (props: {
  i: number;
  match: Match;
  game: { map: string | null; swapSides: boolean; scoreline: [number, number] };
}) => {
  const sides = createMemo(() => {
    let sides = [props.match.teamA, props.match.teamB];
    if (props.game.swapSides) {
      sides.reverse();
    }
    return sides;
  });

  return (
    <div class="flex items-center justify-between gap-3">
      <Index each={props.game.scoreline}>
        {(score, i) => {
          const [input, setInput] = createSignal<number | string | null>(null);
          const value = createMemo(() =>
            input() === null ? score() : input()
          );

          return (
            <TextField
              value={value()}
              class="w-24"
              variant="standard"
              onChange={(e) => {
                setInput(e.currentTarget.value.replace(/[^-?\d]+/g, ""));
              }}
              onBlur={() => {
                client.act("setGame", {
                  i: props.i,
                  ["score" + i]: input(),
                });
                setInput(null);
              }}
              label={
                <span>
                  <span class="brightness-150 font-medium">
                    {[props.match.teamA, props.match.teamB][i]}
                  </span>{" "}
                  Score
                </span>
              }
              InputProps={{
                class: "text-lg font-bold tabular-nums",
                endAdornment: (
                  <ScoreButtons
                    onClick={(set) =>
                      client.act("setGame", {
                        i: props.i,
                        ["score" + i]: set(score()),
                      })
                    }
                  />
                ),
              }}
            ></TextField>
          );
        }}
      </Index>
      <div class="mx-auto" />
      <Button
        variant="outlined"
        color="secondary"
        class="shrink-0 px-2"
        onClick={() => {
          client.act("setGame", { i: props.i, swap: true });
        }}
      >
        <div class="flex flex-col text-sm text-left">
          <div class="flex">
            <div class="text-slate-400 w-10">ATK:</div>
            <div class="font-medium text-slate-50">{sides()[0]}</div>
          </div>
          <div class="flex">
            <div class="text-slate-400 w-10">DEF:</div>
            <div class="font-medium text-slate-50">{sides()[1]}</div>
          </div>
        </div>
      </Button>
    </div>
  );
};

const ScoreButtons = (props: {
  onClick: (set: (val: number) => void) => void;
}) => {
  return (
    <div class="flex gap-1.5 py-2">
      <Button
        variant="outlined"
        size="small"
        class="p-0 min-w-0 w-6"
        color="secondary"
        onClick={() => props.onClick(() => 0)}
      >
        0
      </Button>
      <Button
        variant="outlined"
        size="small"
        class="p-0 min-w-0 w-6"
        color="secondary"
        onClick={() => props.onClick(() => 13)}
      >
        13
      </Button>
    </div>
  );
};

export default CurrentMatch;
