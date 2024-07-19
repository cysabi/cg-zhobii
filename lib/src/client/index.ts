import { pack, unpack } from "msgpackr";

export class Client<S> {
  #dispatch;
  #ws: WebSocket;

  act(action: string, payload: any) {
    this.#ws.send(pack({ type: "action", action, payload }));
  }

  constructor(dispatch: (state: S) => void) {
    this.#dispatch = dispatch;

    this.#ws = new WebSocket(`ws://${window.location.hostname}:4400/_ws`);
    this.#ws.binaryType = "arraybuffer";
    this.#ws.onopen = () => {
      this.#ws.send(pack({ type: "init" }));
    };
    this.#ws.onmessage = (event) => {
      const data = unpack(event.data);

      switch (data.type) {
        case "emit": {
          this.#dispatch(data.state);
        }
      }
    };
  }
}
