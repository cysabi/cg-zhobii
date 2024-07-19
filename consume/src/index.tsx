/* @refresh reload */
import { render, Show } from "solid-js/web";
import { Route, HashRouter } from "@solidjs/router";

import "./index.css";
import App from "./App";

import bento from "./utils";

render(
  () => (
    <HashRouter>
      <Route
        path="/"
        component={() => (
          <Show when={bento() !== undefined}>
            <App />
          </Show>
        )}
      />
      {/* <Route
        path="/graphic/thing"
        component={() => (
          <Show when={bento() !== undefined}>
          <Controls bento={bento as Accessor<State>} client={client} />
          </Show>
          )}
          /> */}
    </HashRouter>
  ),
  document.getElementById("root")!
);
