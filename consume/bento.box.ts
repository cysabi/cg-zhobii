import bento from "bento";
import type { State } from "./types";

let interval: Timer | null = null;

bento.box<State>({
  teams: [],
  matches: [
    {
      teamA: null,
      teamB: null,
      games: [
        { map: null },
        { map: null },
        { map: null, swapSides: false, scoreline: [0, 0] },
        { map: null, swapSides: false, scoreline: [0, 0] },
        { map: null },
        { map: null },
        { map: null, swapSides: false, scoreline: [0, 0] },
      ],
    },
    {
      teamA: null,
      teamB: null,
      games: [
        { map: null },
        { map: null },
        { map: null, swapSides: false, scoreline: [0, 0] },
        { map: null, swapSides: false, scoreline: [0, 0] },
        { map: null },
        { map: null },
        { map: null, swapSides: false, scoreline: [0, 0] },
      ],
    },
  ],
  currentMatch: null,
  timer: {
    value: 0,
    on: false,
  },
  setTimer(set, payload) {
    set((state) => {
      if (interval) {
        clearInterval(interval);
      }
      if (state.timer.on) {
        interval = setInterval(() => {
          if (state.timer.value <= 0) {
            if (interval) clearInterval(interval);
            set((state) => {
              state.timer.value = 0;
            });
          } else {
            set((state) => {
              state.timer.value -= 1;
            });
          }
        }, 1000);
      }
      state.timer = payload;
    });
  },
});
