import bento from "bento";
import type { State } from "./types";
import consola from "consola";

let interval: Timer | null = null;

bento
  .box<State>({
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
    // prettier-ignore
    bracket: [
      [ [[null, 0], [null, 0]],
        [[null, 0], [null, 0]],
        [[null, 0], [null, 0]],
        [[null, 0], [null, 0]],
        [[null, 0], [null, 0]],
        [[null, 0], [null, 0]],
        [[null, 0], [null, 0]],
        [[null, 0], [null, 0]] ],
      [ [[null, 0], [null, 0]],
        [[null, 0], [null, 0]],
        [[null, 0], [null, 0]],
        [[null, 0], [null, 0]] ],
      [ [[null, 0], [null, 0]],
        [[null, 0], [null, 0]] ],
      [ [[null, 0], [null, 0]] ],
    ],
    setGame(set, payload) {
      set((state) => {
        if (payload.i === undefined) {
          return console.error("setGame: `i` is undefined!");
        }
        if (state.currentMatch === null) {
          return console.error("setGame: `currentMatch` is null!");
        }
        const game = state.matches[state.currentMatch].games[payload.i];
        if (payload.map) {
          game.map = payload.map === -1 ? null : payload.map;
        }
        if (payload.swap) {
          if ("swapSides" in game) {
            game.swapSides = !game.swapSides;
          } else {
            console.error("setGame: no property `swapSides`");
          }
        }
        if (payload.score0 !== undefined) {
          let score = parseInt(payload.score0);
          if (!("scoreline" in game)) {
            console.error("setGame: no property `scoreline`");
          } else if (isNaN(score)) {
            console.error("setGame: invalid `score0`");
          } else {
            game.scoreline[0] = Math.max(score, 0);
          }
        }
        if (payload.score1 !== undefined) {
          let score = parseInt(payload.score1);
          if (!("scoreline" in game)) {
            console.error("setGame: no property `scoreline`");
          } else if (isNaN(score)) {
            console.error("setGame: invalid `score1`");
          } else {
            game.scoreline[1] = Math.max(score, 0);
          }
        }
      });
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
    setBracket(
      set,
      payload: [
        number,
        number,
        number,
        { team?: string | -1; score?: number | "+" | "-" }
      ]
    ) {
      set((state) => {
        const match = state.bracket[payload[0]][payload[1]][payload[2]];
        const data = payload[3];
        if (typeof data.score === "number") {
          match[1] = data.score;
        } else if (data.score === "+") {
          match[1] += 1;
        } else if (data.score === "-") {
          match[1] -= 1;
        }
        if (data.team) {
          if (data.team === -1) {
            match[0] = null;
          } else {
            match[0] = data.team;
          }
        }
      });
    },
    setTeams(set, payload) {
      set((state) => {
        state.teams = payload;
      });
    },
  })
  .then(() => {
    consola.box(`Serving at http://localhost:4400`);
    [
      "sidebar",
      "maps",
      "maps-flavor",
      "rosters",
      "agent-select",
      "bracket",
    ].forEach((val) => {
      consola.info(
        `Browser Source [1920x1080] :: http://localhost:4400/#/${val}`
      );
    });
  });
