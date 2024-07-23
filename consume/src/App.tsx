import { Show, type ParentProps } from "solid-js";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@suid/material";
import colors from "tailwindcss/colors";
import CurrentMatch from "./AppCurrentMatch";
import Matches from "./AppMatches";
import Timer from "./AppTimer";
import Teams from "./AppTeams";
import bento from "./utils";
const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <main class="min-h-screen text-slate-50 bg-slate-900 font-[K2D]">
          <Show
            when={bento() !== undefined}
            fallback={
              <div class="p-1 text-slate-700">
                loading... shouldn't take longer than a couple seconds!
              </div>
            }
          >
            <div class="flex gap-10 p-10">
              <div class="flex-1 flex">
                <CurrentMatch />
              </div>
              <div class="flex-1 flex flex-col gap-10">
                <Section title="Matches">
                  <Matches />
                </Section>
                <Section title="Timer">
                  <Timer />
                </Section>
                <Section title="Teams">
                  <Teams />
                </Section>
              </div>
            </div>
          </Show>
        </main>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const Section = (props: ParentProps<{ title: string }>) => (
  <div class="flex flex-col w-full gap-5 p-5 rounded-lg bg-slate-800">
    <div class="text-xl uppercase tracking-wide text-slate-500 font-semibold">
      {props.title}
    </div>
    {props.children}
  </div>
);

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
    fontFamily: "K2D",
  },
});

export default App;
