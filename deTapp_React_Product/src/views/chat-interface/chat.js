// src/Chat.js
import React, { Component } from 'react';
import './chat.css';
import PageContainer from '../../components/container/PageContainer';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      newMessage: ''
    };
  }

  componentDidMount() {
    console.log("Entered into component Didmount");
    this.fetchMessages();
  }

  fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/messages');
      const data = await response.json();
      console.log(data);
      this.setState({ messages: data });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
        this.handleMessageChange(e);
        this.handleSendMessage(e);
    }
  };

  handleMessageChange = (event) => {
    this.setState({ newMessage: event.target.value });
  }

  handleSendMessage = async () => {
    const { newMessage } = this.state;
    if (newMessage.trim()) {
      try {
        await fetch('http://localhost:5000/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: newMessage })
        });
        this.setState({ newMessage: '' });
        this.fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  render() {
    const { messages, newMessage } = this.state;
    return (
        <PageContainer title="Dashboard" description="this is Dashboard">
            <div className="chat-container">
                <div className="messages">
                {messages.map((msg, index) => (
                    <div>
                        <div key={index} className="right-message">
                        {msg.message}
                        </div>
                        <div key={index} className="left-message">
                        {msg.message}
                        </div>
                    </div>
                ))}
                </div>
                <div className="input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={this.handleMessageChange}
                    onKeyDown={this.handleKeyPress}
                />
                <button onClick={this.handleSendMessage}>Send</button>
                </div>
            </div>
      </PageContainer>
    );
  }
}

export default Chat;
