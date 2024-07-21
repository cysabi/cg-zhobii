import type {
  Message,
  Emit,
  Clients,
  ServerWebSocket,
  Setter,
  Handler,
  Actions,
  ServerConfig,
} from "../types";
import { pack, unpack } from "msgpackr";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import consola from "consola";

export class Server<S extends Record<string, unknown>> {
  #state;
  #actions: Actions<S>;
  #clients: Clients;
  wss: Handler;

  constructor(config: ServerConfig<S>) {
    this.#state = new LowSync<S>(
      new JSONFileSync("bento.db.json"),
      config.state
    );
    this.#state.read();
    this.#state.write();
    this.#actions = config.actions;
    this.#clients = new Map();

    this.wss = {
      message: (ws, msg) => {
        const data: Message = unpack(msg.rawData);

        consola.log(`ws ~ message ~ ${JSON.stringify(data)}`);

        switch (data.type) {
          case "init":
            return this.#handleInit(ws);
          case "action":
            return this.#handleAction(data.action, data.payload);
        }
      },
      open: (ws) => {
        consola.log("ws ~ open");
      },
      close: (ws) => {
        consola.log("ws ~ close");
        this.#clients.delete(ws);
      },
    };
  }

  act(action: string, payload: any) {
    return this.#handleAction(action, payload);
  }

  #handleInit(ws: ServerWebSocket) {
    this.#clients.set(ws, [[]]);
    this.#emit({ ws });
  }

  #handleAction(action: string, payload: any) {
    const mutate = this.#actions?.[action];
    if (!mutate) return;
    mutate(this.#handleActionStream.bind(this), payload);
  }
  #handleActionStream(setter: Setter<S>) {
    this.#state.update(setter);
    Array.from(this.#clients.keys()).forEach((ws) => {
      this.#emit({ ws });
    });
  }

  #emit({ ws }: Emit) {
    return ws.send(pack({ type: "emit", state: this.#state.data }));
  }
}
