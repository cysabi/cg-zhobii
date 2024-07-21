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
    img: "https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png",
  },
  haven: {
    img: "https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png",
  },
  split: {
    img: "https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png",
  },
  ascent: {
    img: "https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png",
  },
  icebox: {
    img: "https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png",
  },
  breeze: {
    img: "https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png",
  },
  fracture: {
    img: "https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png",
  },
  pearl: {
    img: "https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png",
  },
  lotus: {
    img: "https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png",
  },
  sunset: {
    img: "https://static.wikia.nocookie.net/valorant/images/5/5c/Loading_Screen_Sunset.png",
  },
  abyss: {
    img: "https://static.wikia.nocookie.net/valorant/images/6/61/Loading_Screen_Abyss.png",
  },
};

export default bento as Accessor<State>;
