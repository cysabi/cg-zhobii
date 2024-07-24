/* @refresh reload */
import { render, Show } from "solid-js/web";
import { Route, HashRouter } from "@solidjs/router";

import "./index.css";
import App from "./App";

import bento from "./utils";
import Sidebar from "./GraphicSidebar";
import Maps from "./GraphicMaps";
import AgentSelect from "./GraphicAgentSelect";
import Rosters from "./GraphicRosters";
import Bracket from "./GraphicBracket";
import { ParentProps } from "solid-js";
import MapsFlavor from "./GraphicMapsFlavor";

const Graphic = (props: ParentProps) => (
  <div class="absolute inset-0 m-auto h-[1080px] w-[1920px] outline-red-500 outline-dashed outline-2 outline-offset-2">
    <div class="relative h-full w-full">{props.children}</div>
  </div>
);

render(
  () => (
    <HashRouter>
      <Route path="/" component={App} />
      <Route
        path="/sidebar"
        component={() => (
          <Show when={bento() !== undefined}>
            <Graphic>
              <Sidebar />
            </Graphic>
          </Show>
        )}
      />
      <Route
        path="/maps"
        component={() => (
          <Show when={bento() !== undefined}>
            <Graphic>
              <Maps />
            </Graphic>
          </Show>
        )}
      />
      <Route
        path="/maps-flavor"
        component={() => (
          <Show when={bento() !== undefined}>
            <Graphic>
              <MapsFlavor />
            </Graphic>
          </Show>
        )}
      />
      <Route
        path="/rosters"
        component={() => (
          <Show when={bento() !== undefined}>
            <Graphic>
              <Rosters />
            </Graphic>
          </Show>
        )}
      />
      <Route
        path="/agent-select"
        component={() => (
          <Show when={bento() !== undefined}>
            <Graphic>
              <AgentSelect />
            </Graphic>
          </Show>
        )}
      />
      <Route
        path="/bracket"
        component={() => (
          <Show when={bento() !== undefined}>
            <Graphic>
              <Bracket />
            </Graphic>
          </Show>
        )}
      />
    </HashRouter>
  ),
  document.getElementById("root")!
);
