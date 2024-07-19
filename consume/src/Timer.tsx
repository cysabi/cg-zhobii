import { Accessor, createMemo, createSignal } from "solid-js";
import { Button, TextField } from "@suid/material";
import bento, { client } from "./utils";
import clsx from "clsx";
import { State } from "../types";

const Timer = () => {
  const timer = createMemo(() => bento().timer);

  const [input, setInput] = createSignal<string | null>(null);
  const value = createMemo(() =>
    input() === null ? encodeTime(timer().value) : input()
  );

  return (
    <div class="flex gap-3">
      <Button
        variant="contained"
        class={clsx({
          "bg-green-400 hover:bg-green-400/80": !timer().on,
          "bg-red-400 hover:bg-red-400/80": timer().on,
        })}
        onClick={() => client.act("setTimer", { on: !timer().on })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class={clsx("h-8 w-8", {
            "text-green-950": !timer().on,
            "text-red-950": timer().on,
          })}
        >
          {timer().on ? (
            <path
              fill="currentColor"
              d="M9 16h6q.425 0 .713-.288T16 15V9q0-.425-.288-.712T15 8H9q-.425 0-.712.288T8 9v6q0 .425.288.713T9 16m3 6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
            ></path>
          ) : (
            <path
              fill="currentColor"
              d="m10.65 15.75l4.875-3.125q.35-.225.35-.625t-.35-.625L10.65 8.25q-.375-.25-.763-.038t-.387.663v6.25q0 .45.388.663t.762-.038M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
            ></path>
          )}
        </svg>
      </Button>
      <TextField
        class="bg-grey-900 rounded flex-1"
        label="Timer"
        value={value()}
        onChange={(e) =>
          setInput(e.currentTarget.value.replace(/[^\d:]+/g, ""))
        }
        onBlur={(e) => {
          client.act("setTimer", { value: decodeTime(e.currentTarget.value) });
          setInput(null);
        }}
        InputProps={{
          class: "font-mono",
          endAdornment: <InputChanges timer={timer} />,
        }}
      />
    </div>
  );
};

const InputChanges = ({ timer }: { timer: Accessor<State["timer"]> }) => (
  <div class="flex gap-2 whitespace-nowrap">
    {timer().on ? (
      <>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => client.act("setTimer", { value: timer().value + 30 })}
        >
          +0:30
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => client.act("setTimer", { value: timer().value + 60 })}
        >
          +1:00
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() =>
            client.act("setTimer", { value: timer().value + 60 * 5 })
          }
        >
          +5:00
        </Button>
      </>
    ) : (
      <>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => client.act("setTimer", { value: 60 })}
        >
          1 min
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => client.act("setTimer", { value: 60 * 5 })}
        >
          5 min
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => client.act("setTimer", { value: 60 * 10 })}
        >
          10 min
        </Button>
      </>
    )}
  </div>
);

const decodeTime = (time: string) => {
  const chunks = time.split(":");
  chunks.reverse();

  let total = 0;
  for (const [i, chunk] of chunks.entries()) {
    let seconds = parseInt(chunk);
    if (isNaN(seconds)) {
      seconds = 0;
    }
    total += seconds * 60 ** i;
  }
  return total;
};

const encodeTime = (time: number | null) => {
  if (time === null) {
    return "00";
  }

  const hrs = Math.floor(time / 3600);
  const min = Math.floor((time % 3600) / 60);
  const sec = Math.floor(time % 60);

  const chunks = [
    hrs.toString().padStart(2, "0"),
    min.toString().padStart(2, "0"),
    sec.toString().padStart(2, "0"),
  ];

  if (hrs > 0) {
    return chunks.join(":");
  } else {
    return chunks.slice(1).join(":");
  }
};

export default Timer;
