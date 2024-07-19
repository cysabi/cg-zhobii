import { ParentProps } from "solid-js";
import CurrentMatch from "./CurrentMatch";
import Matches from "./Matches";
import Timer from "./Timer";
import Teams from "./Teams";

const App = () => {
  return (
    <main class="min-h-screen text-slate-50 bg-slate-900 font-xl">
      <div class="flex gap-10 p-10">
        <div class="flex-1 flex">
          <Section title="Current Match">
            <CurrentMatch />
          </Section>
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
    </main>
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

export default App;
