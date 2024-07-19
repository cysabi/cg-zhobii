import { createMemo, Index } from "solid-js";
import { FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import bento, { client } from "./utils";

const CurrentMatch = () => {
  const currentMatch = createMemo(() => bento().currentMatch);

  return (
    <FormControl fullWidth variant="filled" class="bg-slate-950/75 rounded-t">
      <InputLabel>Select Match</InputLabel>
      <Select
        value={currentMatch()}
        label="Select Match"
        class="min-w-64"
        onChange={(e) => {
          client.act("setCurrentMatch", e.target.value);
        }}
      >
        <Index each={bento().matches}>
          {(match, i) => (
            <MenuItem value={i}>
              {match().teamA} vs {match().teamB}
            </MenuItem>
          )}
        </Index>
      </Select>
    </FormControl>
  );
};

export default CurrentMatch;
