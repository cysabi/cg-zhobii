import {
  createEffect,
  createMemo,
  createSignal,
  Index,
  onCleanup,
  Show,
} from "solid-js";
import bento from "./utils";
import clsx from "clsx";
import gsap from "gsap";

const Bracket = () => {
  createEffect(() => {
    let ctx = gsap.context(() => {
      if (play()) {
        gsap
          .timeline()
          .fromTo(
            [".gsap-match", ".gsap-match-lines"],
            { opacity: 0, x: "-20%" },
            { ease: "expo.out", opacity: 1, x: 0, duration: 1, stagger: 0.05 }
          );
      } else {
        gsap.timeline().to([".gsap-match", ".gsap-match-lines"], {
          opacity: 0,
          duration: 0.5,
        });
      }
    });
    onCleanup(() => ctx.kill());
  });

  const [play, setPlay] = createSignal(false as false | number);
  document.addEventListener("keypress", (e) => {
    if (e.key === "1") {
      setPlay(Date.now());
    } else if (e.key === "2") {
      setPlay(false);
    }
  });

  const bracket = createMemo(() => bento().bracket);

  return (
    <div class="w-full h-full flex font-['One_Little_Font'] text-white text-3xl">
      <Index each={bracket()}>
        {(round, i) => (
          <div class="flex flex-col">
            <Index each={round()}>
              {(match) => {
                const winner = createMemo(() => {
                  if (match()[0][1] >= 2) return 0;
                  if (match()[1][1] >= 2) return 1;
                });

                return (
                  <div class="flex-1 flex items-center">
                    <Show when={i}>
                      <div class="gsap-match-lines mx-3.5 flex my-auto h-[calc(50%+4px)]">
                        <div class="w-7 border-y-[4px] border-white">
                          dsfadsf
                        </div>
                        <div class="h-full border-l-[4px] border-white" />
                        <div class="w-7 border-t-[4px] border-white my-auto" />
                      </div>
                    </Show>
                    <div class="gsap-match flex flex-col gap-0.5">
                      <Index each={match()}>
                        {(team, t) => {
                          const teamData = createMemo(() =>
                            bento().teams.find((t) => t.name === team()[0])
                          );
                          return (
                            <div
                              class={clsx(
                                "flex",
                                t === winner() ? "bg-black/50" : "bg-yellow"
                              )}
                            >
                              <div class="flex items-center py-1 px-2 gap-2 w-80">
                                <div class="h-7 w-7">
                                  <Show when={teamData()?.logo_url}>
                                    <img
                                      src={teamData()?.logo_url}
                                      class="h-full w-full"
                                    />
                                  </Show>
                                </div>
                                <div class="truncate">{teamData()?.name}</div>
                              </div>
                              <div class="flex items-center py-1 px-2 justify-center bg-black/25 w-10 text-center">
                                {team()[1]}
                              </div>
                            </div>
                          );
                        }}
                      </Index>
                    </div>
                  </div>
                );
              }}
            </Index>
          </div>
        )}
      </Index>
    </div>
  );
};

export default Bracket;
