import { createMemo, createSignal, Index, Show } from "solid-js";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@suid/material";
import bento from "./utils";
import { Match } from "../types";
import { encodeTime } from "./Timer";

const MapsFlavor = () => {
  const timer = createMemo(() => encodeTime(bento().timer.value));

  return (
    <div class="flex flex-col gap-8">
      <div class="p-4 bg-yellow-800 flex items-center justify-center font-mono text-4xl font-medium">
        {timer()}
      </div>
      <div class="p-4 bg-yellow-800 flex flex-col">
        <div class="flex items-center">
          <div>team a</div>
          <div>VS</div>
          <div>team b</div>
        </div>
        <div class="flex items-center">
          <div>team a</div>
          <div>VS</div>
          <div>team b</div>
        </div>
      </div>
    </div>
  );
};

export default MapsFlavor;
