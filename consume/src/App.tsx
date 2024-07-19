import { ParentProps } from "solid-js";
import CurrentMatch from "./CurrentMatch";
import Matches from "./Matches";
import Timer from "./Timer";

const App = () => {
  return (
    <div class="flex gap-10 p-10 text-slate-50 bg-slate-900 font-xl min-h-screen">
      <div class="flex flex-col gap-5 p-5 rounded-lg bg-slate-800">
        <Section title="Current Match">
          <CurrentMatch />
        </Section>
      </div>
      <div class="flex flex-col gap-10">
        <Section title="Matches">
          <Matches />
        </Section>
        <Section title="Timer">
          <Timer />
        </Section>
      </div>
    </div>
  );
};

const Section = (props: ParentProps<{ title: string }>) => (
  <div class="flex flex-col gap-5 p-5 rounded-lg bg-slate-800">
    <div class="text-xl uppercase tracking-wide text-slate-500 font-semibold">
      {props.title}
    </div>
    {props.children}
  </div>
);

export default App;
