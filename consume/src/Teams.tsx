import { createMemo, createSignal, For, Show } from "solid-js";
import { fileUploader, UploadFile } from "@solid-primitives/upload";
import { Button } from "@suid/material";
import bento, { client } from "./utils";
import cImg from "./static/role-c.webp";
import dImg from "./static/role-d.webp";
import iImg from "./static/role-i.webp";
import sImg from "./static/role-s.webp";

const Teams = () => {
  const teams = createMemo(() => bento().teams);
  const [files, setFiles] = createSignal<UploadFile[]>([]);
  const [file, setFile] = createSignal<string>();

  return (
    <>
      <div class="border-2 p-3 rounded-md border-slate-700 flex flex-col gap-3">
        <For each={teams()}>
          {(team) => (
            <div class="flex gap-3 items-center">
              <div class="h-10 w-10 shrink-0">
                <img class="h-full w-full object-contain" src={team.logo_url} />
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
                                c: cImg,
                                d: dImg,
                                i: iImg,
                                s: sImg,
                                f: "",
                              }[player.role]
                            }
                          />
                        </div>
                        <div class="text-sm text-slate-400">{player.name}</div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
      <div class="border-2 p-3 rounded-md border-slate-700 flex flex-col gap-5">
        <div class="flex gap-5 items-center">
          <input
            type="file"
            class="text-slate-300 flex-1"
            use:fileUploader={{
              userCallback(fs) {
                fs.forEach((f) => f.file.text().then((text) => setFile(text)));
              },
              setFiles,
            }}
          ></input>
          <Button
            disabled={!files().length}
            variant="contained"
            class="font-bold tracking-wider"
            onClick={() => {
              client.act("setTeams", file());
            }}
          >
            Upload Teams
          </Button>
        </div>
        <Show when={file()}>
          <div class="font-mono text-sm w-0 min-w-full overflow-x-scroll border-l-2 pl-3 border-indigo-400">
            {file()}
          </div>
        </Show>
      </div>
    </>
  );
};

fileUploader;
export default Teams;
