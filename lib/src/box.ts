import type { Actions, ServerConfig } from "./types";
import {
  createApp,
  defineEventHandler,
  defineWebSocketHandler,
  serveStatic,
  fromNodeMiddleware,
  toNodeListener,
  toWebHandler,
} from "h3";
import { createServer } from "node:http";
import wsAdapter from "crossws/adapters/bun";
import { Server as BentoServer } from "./server";
import { join } from "path";

export type BentoBoxModel<S> = S | Actions<S>;

export const box = async <S extends Record<string, unknown>>(
  model: BentoBoxModel<S>,
  init?: (act: (action: string, payload: any) => void) => void
) => {
  const config: ServerConfig<S> = {
    state: {} as S,
    actions: {},
  };

  Object.entries(model).forEach(([key, value]) => {
    // TODO: deep search for an external lib
    if (typeof value === "function") {
      config.actions[key] = value as Actions<S>[keyof Actions<S>];
    } else {
      config.state[key as keyof S] = value as S[keyof S];
    }
  });

  const app = createApp();

  // // set up vite dev server or vite static
  if (false) {
    // const createViteServer = (await import("vite")).createServer;
    // const vite = await createViteServer({ server: { middlewareMode: true } });
    // app.use(fromNodeMiddleware(vite.middlewares));
  } else {
    app.use(
      "/",
      defineEventHandler((event) =>
        serveStatic(event, {
          getContents: (id) => Bun.file(join("dist", id)),
          getMeta: async (id) => {
            const file = Bun.file(join("dist", id));
            if (await file.exists())
              return { size: file.size, mtime: file.lastModified };
          },
        })
      )
    );
  }

  // set up websocket server
  const server = new BentoServer(config);
  if (init) init(server.act.bind(server));
  app.use("/_ws", defineWebSocketHandler(server.wss));

  // bun serve
  const { handleUpgrade, websocket } = wsAdapter(app.websocket);
  const handleHttp = toWebHandler(app);
  return Bun.serve({
    port: 4400,
    websocket,
    async fetch(req, server) {
      if (await handleUpgrade(req, server)) {
        return;
      }
      return handleHttp(req);
    },
  });

  // // serve from node listener
  // const serve = createServer(toNodeListener(app));
  // const { handleUpgrade } = wsAdapter(app.websocket);
  // serve.listen(4400);
  // serve.on("upgrade", handleUpgrade);
  // return serve;

  // // serve from node listener with listhen
  // return listen(toNodeListener(app), { ws: app.websocket, port: 4400 });
};
