/* @refresh reload */
import { render, Show } from "solid-js/web";
import { Route, HashRouter } from "@solidjs/router";

import "./index.css";
import App from "./App";

import bento from "./utils";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@suid/material";
import colors from "tailwindcss/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: colors.indigo[300] },
    secondary: { main: colors.slate[500] },
    error: { main: colors.pink[400] },
    warning: { main: colors.amber[400] },
    info: { main: colors.sky[400] },
    success: { main: colors.green[400] },
    grey: {
      ...colors.slate,
      A100: colors.slate[100],
      A200: colors.slate[200],
      A400: colors.slate[400],
      A700: colors.slate[700],
    },
    text: {
      primary: colors.slate[50],
      secondary: colors.slate[400],
      disabled: colors.slate[600],
    },
    background: { paper: colors.slate[950] },
  },
  typography: {
    fontFamily: "unset",
  },
});

render(
  () => (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
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
        path="/dashboard"
        component={() => (
          <Show when={bento() !== undefined}>
          <Controls bento={bento as Accessor<State>} client={client} />
          </Show>
          )}
          /> */}
        </HashRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  ),
  document.getElementById("root")!
);
