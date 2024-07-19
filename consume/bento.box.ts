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
  setMatchTeams(set, payload) {
    set((state) => {
      if (payload.teamA) {
        if (payload.teamA === -1) {
          state.matches[payload.match].teamA = null;
        } else {
          state.matches[payload.match].teamA = payload.teamA;
        }
      }
      if (payload.teamB) {
        if (payload.teamB === -1) {
          state.matches[payload.match].teamB = null;
        } else {
          state.matches[payload.match].teamB = payload.teamB;
        }
      }
    });
  },
  setCurrentMatch(set, payload) {
    set((state) => {
      if (payload === -1) {
        state.currentMatch = null;
      } else {
        state.currentMatch = payload;
      }
    });
  },
  setTimer(set, payload) {
    set((state) => {
      if (payload.on !== undefined) {
        state.timer.on = payload.on;
      }
      if (payload.value !== undefined) {
        state.timer.value = payload.value;
      }
    });
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
    });
  },
});
