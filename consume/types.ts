export type State = {
  config: Record<string, { weight: number; desc: string }>;
  settings: {
    size: number;
    spinBase: number;
    spinRandom: number;
    maxSpeed: number;
    idleSpeed: number;
    friction: number;
  };
  status: { state: "idle" | "spin" | "done"; option?: string };
};
