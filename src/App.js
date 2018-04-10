import React, { Component } from 'react';
import './App.css';
import socket from './services/socket.service';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: socket.id,
      message: '',
      messages: []
    };
  }

  componentWillMount() {
    socket.connect();

    socket.onconnect.subscribe(data => {
      console.log('onconnect', data)
      this.setState({ 
        id: data,
        messages: this.state.messages.concat([{
          message: "/The socket connection has been established"
        }])
      });
    });

    socket.onmessage.subscribe(data => {
      this.setState({
        messages: this.state.messages.concat([{
          message: data.content,
          sender: data.sender
        }])
      });
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

  render() {
    const messages = this.state.messages.map((message, index) =>
      message.sender ?
      <p key={index}>
        <span className="sender">{message.sender}</span><br/>
        {message.message}
      </p> :
      <p className="system" key={index}>{message.message.substring(1)}</p>);

    return (
      <div className="container">
        <h2>React Chat App + Golang Websocket Server</h2>

        <div id="id">
          <small>ID: </small>
          <input value={this.state.id}/>
        </div>

        <div id="messages">
          {messages}
        </div>
        <input
          id="chatBox"
          onChange={e => this.setState({message: e.target.value})}
          value={this.state.message} />
        <button onClick={this.send}>Send</button>
      </div>
    );
  }
}

export default App;
