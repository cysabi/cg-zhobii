import { Client } from "bento/client";
import { Accessor, createSignal } from "solid-js";
import type { Match, State } from "../types";

const [bento, dispatch] = createSignal<State>();
export const client = new Client<State>(dispatch);

export const fullReload = () => {
  setTimeout(() => {
    const data = bento();
    dispatch(undefined);
    setTimeout(() => {
      dispatch(data);
    }, 0);
  }, 0);
};

export const findWinner = (scoreline: [number, number]) => {
  const winner = [scoreline, scoreline.slice().reverse()].findIndex(
    (scoreline) => {
      if (scoreline[0] === 13 && scoreline[1] < 13) {
        return true;
      }
      if (scoreline[0] > 13 && scoreline[0] - scoreline[1] >= 2) {
        return true;
      }
    }
  ) as 0 | 1;
  if (winner > -1) {
    return winner;
  }
  return null;
};

export const getSeries = (match: Match | null) => {
  let series = [0, 0];
  if (match === null) {
    return series;
  }
  [match.games[2], match.games[3], match.games[6]].forEach((game) => {
    const winner = findWinner(game.scoreline);
    if (typeof winner === "number") {
      series[winner] += 1;
    }
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
