/* @refresh reload */
import { render, Show } from "solid-js/web";
import { Route, HashRouter } from "@solidjs/router";

import "./index.css";
import App from "./App";

import bento from "./utils";
import Sidebar from "./GraphicSidebar";
import Maps from "./GraphicMaps";
import Teams from "./GraphicTeams";
import Bracket from "./GraphicBracket";
import { ParentProps } from "solid-js";

const Graphic = (props: ParentProps) => (
  <div class="absolute inset-0 m-auto h-[1080px] w-[1920px] outline-red-500 outline-dashed outline-2 outline-offset-2">
    <div class="relative h-full w-full">{props.children}</div>
  </div>
);

render(
  () => (
    <Show when={bento() !== undefined}>
      <HashRouter>
        <Route path="/" component={App} />
        <Route
          path="/sidebar"
          component={() => (
            <Graphic>
              <Sidebar />
            </Graphic>
          )}
        />
        <Route
          path="/maps"
          component={() => (
            <Graphic>
              <Maps />
            </Graphic>
          )}
        />
        <Route
          path="/teams"
          component={() => (
            <Graphic>
              <Teams />
            </Graphic>
          )}
        />
        <Route
          path="/bracket"
          component={() => (
            <Graphic>
              <Bracket />
            </Graphic>
          )}
        />
      </HashRouter>
    </Show>
  ),
  document.getElementById("root")!
);
