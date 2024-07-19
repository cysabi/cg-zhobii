import { createSignal, Show } from "solid-js";
import { fileUploader, UploadFile } from "@solid-primitives/upload";
import { Button } from "@suid/material";
import { client } from "./utils";
fileUploader;

const Teams = () => {
  const [files, setFiles] = createSignal<UploadFile[]>([]);
  const [file, setFile] = createSignal<string>();

  return (
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
          class="font-bold tracking-wide"
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
  );
};

export default Teams;
