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

export const maps: Record<string, { img: string }> = {
  bind: {
    img: "/Loading_Screen_Bind.webp",
  },
  haven: {
    img: "/Loading_Screen_Haven.webp",
  },
  split: {
    img: "/Loading_Screen_Split.webp",
  },
  ascent: {
    img: "/Loading_Screen_Ascent.webp",
  },
  icebox: {
    img: "/Loading_Screen_Icebox.webp",
  },
  breeze: {
    img: "/Loading_Screen_Breeze.webp",
  },
  fracture: {
    img: "/Loading_Screen_Fracture.webp",
  },
  pearl: {
    img: "/Loading_Screen_Pearl.webp",
  },
  lotus: {
    img: "/Loading_Screen_Lotus.webp",
  },
  sunset: {
    img: "/Loading_Screen_Sunset.webp",
  },
  abyss: {
    img: "/Loading_Screen_Abyss.webp",
  },
};

export default bento as Accessor<State>;
