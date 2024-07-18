import icepick from "icepick";
import { pack, unpack } from "msgpackr";

export class Client<S> {
  dispatch: null | ((state: S) => void) = null;
  #state: S;
  #ws: WebSocket;

  act(action: string, payload: any) {
    this.#ws.send(pack({ type: "action", action, payload }));
  }

  constructor({ initial }: { initial?: S } = {}) {
    this.#state = icepick.freeze(initial || ({} as S));

    this.#ws = new WebSocket(`ws://${window.location.host}/_ws`);
    this.#ws.binaryType = "arraybuffer";
    this.#ws.onopen = () => {
      this.#ws.send(pack({ type: "init" }));
    };
    this.#ws.onmessage = (event) => {
      const data = unpack(event.data);

      switch (data.type) {
        case "emit": {
          this.#state = data.state;
          if (this.dispatch) {
            this.dispatch(this.#state);
          }
        }
      }
    };
  }
}
