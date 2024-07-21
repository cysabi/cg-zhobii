/* @refresh reload */
import { render, Show } from "solid-js/web";
import { Route, HashRouter } from "@solidjs/router";

import "./index.css";
import App from "./App";

import bento from "./utils";
import Sidebar from "./GraphicSidebar";
import Maps from "./GraphicMaps";
import MapsFlavor from "./GraphicMapsFlavor";

render(
  () => (
    <Show when={bento() !== undefined}>
      <HashRouter>
        <Route path="/" component={() => <App />} />
        <Route
          path="/sidebar"
          component={() => (
            <div class="absolute inset-0 m-auto h-[1080px] w-[1920px] outline-red-500 outline-dashed outline-2 outline-offset-2 font-rubik text-white text-xl">
              <div class="relative h-full w-full">
                <Sidebar />
              </div>
            </div>
          )}
        />
        <Route
          path="/maps"
          component={() => (
            <div class="absolute inset-0 m-auto h-[1080px] w-[1920px] outline-red-500 outline-dashed outline-2 outline-offset-2 font-rubik text-white text-xl">
              <div class="relative h-full w-full">
                <Maps />
              </div>
            </div>
          )}
        />
        <Route
          path="/maps-flavor"
          component={() => (
            <div class="absolute inset-0 m-auto h-[1080px] w-[1920px] outline-red-500 outline-dashed outline-2 outline-offset-2 font-rubik text-white text-xl">
              <div class="relative h-full w-full">
                <MapsFlavor />
              </div>
            </div>
          )}
        />
      </HashRouter>
    </Show>
  ),
  document.getElementById("root")!
);
