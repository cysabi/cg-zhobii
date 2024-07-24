import {
  createEffect,
  createMemo,
  createSignal,
  Index,
  onCleanup,
} from "solid-js";
import bento from "./utils";
import clsx from "clsx";
import gsap from "gsap";

const Teams = () => {
  const match = createMemo(() =>
    bento().currentMatch !== null
      ? bento().matches[bento().currentMatch!]
      : null
  );
  const teams = createMemo(() => {
    return [
      bento().teams.find((team) => team.name === match()?.teamA),
      bento().teams.find((team) => team.name === match()?.teamB),
    ];
  });

  createEffect(() => {
    let ctx = gsap.context(() => {
      if (play()) {
        refs.forEach((refs) => {
          gsap
            .timeline()
            .fromTo(
              refs[0],
              { opacity: 0, y: -256, scale: 0.67, height: 0 },
              {
                ease: "expo.out",
                opacity: 1,
                y: 0,
                scale: 1,
                height: "auto",
                duration: 1,
              }
            )
            .fromTo(
              refs.slice(1),
              { opacity: 0, y: -256 / 4 },
              { ease: "expo.out", opacity: 1, y: 0, duration: 1, stagger: 0.1 },
              "<+0.5"
            );
        });
      } else {
        gsap.timeline().to([refs[0][0], refs[1][0]], {
          opacity: 0,
          y: -256,
          scale: 0.3,
          height: 0,
          ease: "back.in(1)",
        });
      }
    });
    onCleanup(() => ctx.kill());
  });

  let refs: HTMLDivElement[][] = [[], []];
  const [play, setPlay] = createSignal(true as false | number);
  document.addEventListener("keypress", (e) => {
    if (e.key === "1") {
      setPlay(Date.now());
    } else if (e.key === "2") {
      setPlay(false);
    }
  });

  return (
    <div class="h-full w-full font-['One_Little_Font'] flex text-yellow text-7xl">
      <Index each={teams()}>
        {(team, i) => (
          <>
            <div class="flex-1 flex flex-col">
              <div
                class={clsx(
                  "flex items-center gap-7 p-7 bg-black/50",
                  i && "flex-row-reverse"
                )}
              >
                <div class="h-14 w-14">
                  <img src={team()?.logo_url} class="h-full w-full" />
                </div>
                <div>{team()?.name}</div>
              </div>
              <div class="h-full overflow-clip">
                <div
                  ref={refs[i][0]}
                  class={clsx(
                    "-z-10 flex flex-col m-14 gap-14 p-14 bg-yellow/50 relative text-6xl text-white",
                    i ? "origin-top-right" : "origin-top-left"
                  )}
                >
                  <div
                    class={clsx(
                      "absolute inset-0 -z-20 border-4 -translate-y-2 border-dashed border-yellow/50",
                      i ? "-translate-x-2" : "translate-x-2"
                    )}
                  />
                  <Index each={team()?.rosters || []}>
                    {(player, p) => (
                      <div
                        ref={refs[i][p + 1]}
                        class={clsx(
                          "flex gap-7 items-center",
                          i && "flex-row-reverse text-right"
                        )}
                      >
                        <div class="h-14 w-14">
                          <img
                            class="h-full w-full"
                            src={
                              {
                                c: "/role-c.webp",
                                d: "/role-d.webp",
                                i: "/role-i.webp",
                                s: "/role-s.webp",
                                f: "/role-f.webp",
                              }[player().role]
                            }
                          />
                        </div>
                        <div class="flex-1">{player().name}</div>
                      </div>
                    )}
                  </Index>
                </div>
              </div>
            </div>
          </>
        )}
      </Index>
    </div>
  );
};

export default Teams;
