import { Observable, Subject } from 'rxjs';

class SocketService {
  constructor() {
    this._id = '';
    this.onconnect;
    this.onclose;
    this.onmessage;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this.socket.send(JSON.stringify({
      action: "SET_ID",
      data: id
    }));
    this._id = id;
  }

  connect() {
    this.socket = new WebSocket("ws://localhost:12345/ws");

    this.socket.onopen = event => {
      this.socket.send(JSON.stringify({ action: "GET_ID" }));
    }

    this.onclose = new Observable(observer => {
      this.socket.onclose = event => {
        observer.next(event);
      }
    });

    this.onconnect = new Subject();
    this.onmessage = new Subject();
    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);
      data.recipient ? this.onconnect.next(data.recipient) : this.onmessage.next(data);
    }
  }

  close() {
    this.socket.close();
  }

  send(data) {
    console.log(data)
    this.socket.send(data);
  }
}

export default new SocketService();