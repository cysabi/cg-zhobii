import { Client } from "bento/client";
import { Accessor, createSignal } from "solid-js";
import type { Match, State } from "../types";

const [bento, dispatch] = createSignal<State>();
export const client = new Client<State>(dispatch);

export const getSeries = (match: Match) => {
  let series = [0, 0];
  [match.games[2], match.games[3], match.games[6]].forEach((game) => {
    game.scoreline.forEach((score, i) => {
      if (score === 13) {
        series[i] += 1;
      }
    });
  });
  return series;
};

export default bento as Accessor<State>;
