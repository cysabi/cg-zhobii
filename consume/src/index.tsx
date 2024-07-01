/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import { Client } from "bento/client";
import { Accessor, createSignal, Show } from "solid-js";
import type { State } from "../types";

import "./index.css";
import App from "./App";
import Controls from "./Controls";

const root = document.getElementById("root");

const client = new Client<State>();
const [bento, dispatch] = createSignal<State>();
client.dispatch = dispatch;

render(
  () => (
    <Router>
      <Route
        path="/"
        component={() => (
          <Show when={bento() !== undefined}>
            <App bento={bento as Accessor<State>} client={client} />
          </Show>
        )}
      />

      <Route
        path="/dashboard"
        component={() => (
          <Show when={bento() !== undefined}>
            <Controls bento={bento as Accessor<State>} client={client} />
          </Show>
        )}
      />
    </Router>
  ),
  root!
);
