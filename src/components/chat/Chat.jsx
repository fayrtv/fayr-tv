import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DefaultPromisedWebSocketFactory,
  DefaultDOMWebSocketFactory,
  FullJitterBackoff,
  ReconnectingPromisedWebSocket
} from 'amazon-chime-sdk-js';
import * as config from '../../config';

// Styles
import './Chat.css';

class Chat extends Component {
  constructor() {
    super ();

    this.WEB_SOCKET_TIMEOUT_MS = 10000;

    this.state = {
      message: '',
      messages: [],
      connection: null,
      showPopup: false
    }
    this.chatRef = React.createRef();
    this.messagesEndRef = React.createRef();
  }

  componentDidMount() {
    this.initChatConnection();
  }

  async initChatConnection() {
    const { Meeting, Attendee } = this.props.joinInfo;
    const messagingUrl = `${config.CHAT_WEBSOCKET}?MeetingId=${Meeting.MeetingId}&AttendeeId=${Attendee.AttendeeId}&JoinToken=${Attendee.JoinToken}`
    const connection = new ReconnectingPromisedWebSocket(
      messagingUrl,
      [],
      'arraybuffer',
      new DefaultPromisedWebSocketFactory(new DefaultDOMWebSocketFactory()),
      new FullJitterBackoff(1000, 0, 10000)
    );

    if (config.DEBUG) console.log(connection);

    await connection.open(this.WEB_SOCKET_TIMEOUT_MS);

    connection.addEventListener('message', event => {
      const messages = this.state.messages;
      const data = event.data.split('::');
      const username = data[0];
      const message = data.slice(1).join('::'); // in case the message contains the separator '::'

      messages.push({
        timestamp: Date.now(),
        username,
        message
      });

      this.setState({ messages });
    });

    this.setState({ connection });

    this.chatRef.current.focus();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  handleChange = e => {
    this.setState({ message: e.target.value })
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) { // keyCode 13 is carriage return
      const { message, connection } = this.state;
      const { username } = this.props;
      if (message) {
        const data = `{
          "message": "sendmessage",
          "data": "${username}::${message.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
        }`;
        connection.send(data);

        this.setState({ message: '' });
      }
    }
  }

  handleRoomClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { title } = this.props;
    const link = `${window.location.origin}${window.location.pathname.replace('meeting', 'index.html')}?action=join&room=${title}`;
    if (config.DEBUG) console.log(link);
    this.copyTextToClipboard(encodeURI(link));
  }

  parseUrls = (userInput) => {
    var urlRegExp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g;
    let formattedMessage = userInput.replace(urlRegExp, (match) => {
      let formattedMatch = match;
      if (!match.startsWith('http')) {
        formattedMatch = `http://${match}`;
      }
      return `<a href=${formattedMatch} class="chat-line__link" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });
    return formattedMessage;
  }

  renderMessages = () => {
    const { messages } = this.state;
    return (
      messages.map(message => {
        let formattedMessage = this.parseUrls(message.message);
        return (
          <div className="chat-line" key={message.timestamp}>
            <p><span className="username">{message.username}</span><span dangerouslySetInnerHTML={{__html: formattedMessage}} /></p>
          </div>
        )
      })
    )
  }

  render() {
    const { message } = this.state;
    // const popup = showPopup ? 'show' : '';
    return (
      <div className="chat full-height pos-relative">
        <div className="chat__wrapper full-width pos-relative">
          <div className="messages pd-x-1 pos-absolute">
            {this.renderMessages()}
            <div ref={this.messagesEndRef} />
          </div>
        </div>
        <div className="composer chime-web-composer full-width">
          <input
            ref={this.chatRef}
            type="text"
            placeholder="Hier chatten ..."
            value={message}
            maxLength={510}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
        </div>
      </div>
    )
  }
}

Chat.propTypes = {
  chime: PropTypes.object,
  title: PropTypes.string,
  username: PropTypes.string,
  joinInfo: PropTypes.object
};

export default Chat;
