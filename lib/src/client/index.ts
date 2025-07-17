export class Client<S> {
  #dispatch;
  #ws: WebSocket;

  act(action: string, payload: any) {
    this.#ws.send(JSON.stringify({ type: "action", action, payload }));
  }

  constructor(dispatch: (state: S) => void) {
    this.#dispatch = dispatch;

    this.#ws = new WebSocket(`ws://${window.location.hostname}:4400/_ws`);
    this.#ws.binaryType = "arraybuffer";
    this.#ws.onopen = () => {
      this.#ws.send(JSON.stringify({ type: "init" }));
    };
    this.#ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "emit": {
          this.#dispatch(data.state);
        }
      }
    };
  }
}
