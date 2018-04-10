import React, { Component } from 'react';
import './App.css';
import socket from './services/socket.service';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: []
    };
  }

  componentWillMount() {
    socket.onopen.subscribe(data => {
      console.log("on open ", data)
    });
    socket.onmessage.subscribe(data => {
      console.log("on message ", data)
    });
  }

  componentWillUnmount() {
    socket.close();
  }

  send = () => {
    if (this.state.message) {
      socket.send(this.state.message);
      this.setState({message: ''});
    }
  }

  displayMessages = () => {
    const messages = [];
    
    this.state.messages.forEach((message, index) => {
      if (message.startsWith("/"))
        messages.push(`<strong id={${index}}>${message.substring(1)}</strong>`)
      else
        messages.push(`<p id={${index}}>${message.substring(1)}</p>`)
    });
    
    return messages;
  }

  render() {
    return (
      <div className="App">
        <ul id="messages">
            <li>
              <span></span>
            </li>
        </ul>
        <input onChange={e => this.setState({message: e.target.value})} />
        <button onClick={this.send}>Send</button>
      </div>
    );
  }
}

export default App;
