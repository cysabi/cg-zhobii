import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { fileUploader, UploadFile } from "@solid-primitives/upload";
import { Button } from "@suid/material";
import bento, { client, fullReload } from "./utils";
import { State } from "../types";
import Papa from "papaparse";

const Teams = () => {
  const teams = createMemo(() => bento().teams);
  const [files, setFiles] = createSignal<UploadFile[]>([]);
  const [data, setData] = createSignal<
    { teams?: State["teams"]; errors?: Papa.ParseError[] } | undefined
  >();

  createEffect((prev) => {
    if (prev !== teams() && files().length) {
      fullReload();
    }
    return teams();
  });

  return (
    <>
      <Show
        when={teams().length}
        fallback={
          <div class="p-3 rounded-md bg-slate-700/50 flex flex-col gap-3 italic text-slate-400">
            no teams uploaded yet!
          </div>
        }
      >
        <div class="border-2 p-3 rounded-md border-slate-700 flex flex-col gap-3">
          <For each={teams()}>
            {(team) => (
              <div class="flex gap-3 items-center">
                <div class="h-10 w-10 shrink-0">
                  <img
                    class="h-full w-full object-contain"
                    src={team.logo_url}
                  />
                </div>
                <div class="flex-1 flex flex-col">
                  <div>{team.name}</div>
                  <div class="flex flex-wrap justify-between">
                    <For each={team.rosters}>
                      {(player) => (
                        <div class="flex flex-1 shrink-0 gap-1 items-center">
                          <div class="h-3 w-3">
                            <img
                              class="h-full w-full opacity-75"
                              src={
                                {
                                  c: "/role-c.webp",
                                  d: "/role-d.webp",
                                  i: "/role-i.webp",
                                  s: "/role-s.webp",
                                  f: "",
                                }[player.role]
                              }
                            />
                          </div>
                          <div class="text-sm text-slate-400">
                            {player.name}
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
      <div class="border-2 p-3 rounded-md border-slate-700 flex flex-col gap-3">
        <div class="flex gap-3 items-center">
          <input
            type="file"
            class="text-slate-300 flex-1"
            use:fileUploader={{
              userCallback(fs) {
                fs.forEach((f) => {
                  Papa.parse<string[]>(f.file, {
                    complete(csv) {
                      const newTeams: State["teams"] = [];
                      const team = {
                        [Symbol.for("data")]: null as
                          | State["teams"][number]
                          | null,
                        setTeam(name: string, logo_url: string) {
                          team[Symbol.for("data")] = {
                            name,
                            logo_url,
                            rosters: [],
                          };
                        },
                        addPlayer(
                          player: State["teams"][number]["rosters"][number]
                        ) {
                          const t = team[Symbol.for("data")];
                          if (t !== null) {
                            t.rosters.push(player);
                          }
                        },
                        flushTeam() {
                          const t = team[Symbol.for("data")];
                          if (t !== null) {
                            newTeams.push(t);
                          }
                        },
                      };
                      if (csv.errors) {
                        setData({ errors: csv.errors });
                      }

                      const headers = {
                        "Team Name": 0,
                        "Team Logo": 1,
                        "Team Players": 2,
                        "Player Roles": 3,
                      };

                      csv.data.forEach((row, i) => {
                        if (i === 0) {
                          (row as (keyof typeof headers)[]).forEach(
                            (header, i) => {
                              headers[header] = i;
                            }
                          );
                        } else {
                          if (row[headers["Team Name"]].length) {
                            team.flushTeam();
                            team.setTeam(
                              row[headers["Team Name"]],
                              row[headers["Team Logo"]]
                            );
                          }
                          team.addPlayer({
                            name: row[headers["Team Players"]],
                            role: row[headers["Player Roles"]]
                              .charAt(0)
                              .toLowerCase() as any,
                          });
                        }
                      });
                      team.flushTeam();
                      setData({ teams: newTeams });
                    },
                  });
                });
              },
              setFiles,
            }}
          ></input>
          <Button
            disabled={!files().length || !data()?.teams}
            variant="contained"
            class="font-bold tracking-wider"
            onClick={() => {
              client.act("setTeams", data()?.teams);
            }}
          >
            Upload Teams
          </Button>
        </div>
        <Show when={data()?.errors}>
          <div class="h-full w-full bg-red-400/20 p-3 rounded">
            <For each={data()?.errors}>
              {(error) => (
                <div class="text-red-400">
                  <span class="text-red-400 font-mono font-semibold">
                    {error.code}:{" "}
                  </span>
                  {error.message}
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </>
  );
};

fileUploader;
export default Teams;
