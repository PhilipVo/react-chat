import { Observable } from 'rxjs';

class SocketService {
  constructor() {
    this.socket = new WebSocket("ws://localhost:12345/ws");
    this.event = new Observable();

    this.onopen = new Observable(observer => {
      this.socket.onopen = event => {
        observer.next(event)
      }
    });

    this.onclose = new Observable(observer => {
      this.socket.onclose = event => {
        observer.next(event)
      }
    });
    
    this.onmessage = new Observable(observer => {
      this.socket.onmessage = event => {
        observer.next(JSON.parse(event.data))
      }
    });
  }

  connect() {
    
  }

  close() {
    this.socket.close();
  }

  send(data) {
    this.socket.send(data);
  }
}

export default new SocketService();