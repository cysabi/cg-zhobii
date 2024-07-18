type TeamName = string;
export type Match = {
  teamA: TeamName | null;
  teamB: TeamName | null;
  games: [
    { map: string | null },
    { map: string | null },
    { map: string | null; swapSides: boolean; scoreline: [number, number] },
    { map: string | null; swapSides: boolean; scoreline: [number, number] },
    { map: string | null },
    { map: string | null },
    { map: string | null; swapSides: boolean; scoreline: [number, number] }
  ];
};

export type State = {
  teams: {
    name: TeamName;
    logo_url: string;
    rosters: {
      name: string;
      role: "s" | "c" | "i" | "d" | "f";
    }[];
  }[];
  matches: [Match, Match];
  currentMatch: null | 0 | 1;
  timer: {
    value: number;
    on: boolean;
  };
};
