import { Client } from "bento/client";
import { Accessor, createSignal } from "solid-js";
import type { State } from "../types";

const [bento, dispatch] = createSignal<State>();
export const client = new Client<State>(dispatch);

export default bento as Accessor<State>;
