import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as config from '../../config';
import Error from './Error';


class Welcome extends Component {

  state = {
    role: 'host',
    username: '',
    title: config.RANDOM,
    playbackURL: config.DEFAULT_VIDEO_STREAM,
    errorMsg: '',
    showError: false,
  }

  constructor() {
    super ();
    this.baseHref = config.BASE_HREF;
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    const qs = new URLSearchParams(this.props.location.search);
    const action = qs.get('action');
    if (action === 'join') {
      const title = qs.get('room');
      this.props.history.push(`${this.baseHref}/join?room=${title}`);
    }
    this.inputRef.current.focus();
  }

  handleNameChange = e => {
    this.setState({ username: e.target.value })
  }

  handleRoomChange = e => {
    this.setState({ title: e.target.value })
  }

  handlePlaybackURLChange = e => {
    this.setState({ playbackURL: e.target.value })
  }

  handleCreateRoom = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.createRoom();
  }

  setErrorMsg = errorMsg => {
    this.setState({ errorMsg, showError: true });
  }

  closeError = () => {
    this.setState({ showError: false });
  }

  async createRoom() {
    const { title, username, playbackURL } = this.state;
    const data = {
      username,
      title,
      playbackURL,
      role: this.state.role
    }
    sessionStorage.setItem(`chime[${title}]`, JSON.stringify(data));
    this.props.history.push(`${this.baseHref}/meeting?room=${title}`);
  }

  render() {
    const { username, title, playbackURL, } = this.state;
    const createRoomDisabled = !username || !title || !playbackURL;
    return (
      <>
        <div className="welcome form-grid">

          <div className="welcome__intro">
            <div className="intro__inner formatted-text">
              <img src="https://i.ibb.co/jGzKGYw/fayrtv-logo.png" alt="fayrtv-logo" border="0" height="200"></img>
              <h2>Erlebe Live- und Sportevents wie noch nie zuvor!</h2>
              <h3>Erstelle eine Watch Party oder trete einer bei und verbringe mit deinen Freunden eine geile Zeit!</h3>
            </div>
          </div>

          <div className="welcome__content pd-4">
            <div className="content__inner">
              <h2 className="mg-b-2">Starte eine Watch Party</h2>
              <h3>Fiebere zusammen mit deinen Freunden mit und schaue dir Live- und Sportevents online an!</h3>
              <form action="">
                <fieldset className="mg-b-2">
                  <input className="mg-b-2" type="text" placeholder="Dein Name" value={username} ref={this.inputRef} onChange={this.handleNameChange} />
                  <input type="text" placeholder="Code" value={title} onChange={this.handleRoomChange} />
                  {/* <input type="text" placeholder="Playback URL" value={playbackURL} onChange={this.handlePlaybackURLChange} /> */}
                  <button className="mg-t-2 btn btn--primary" disabled={createRoomDisabled} onClick={this.handleCreateRoom} >Watch Party</button>
                </fieldset>
              </form>
            </div>
          </div>

        </div>
        {this.state.showError && (
          <Error
            closeError={this.closeError}
            errorMsg={this.state.errorMsg}
          />
        )}
      </>
    )
  }
}

export default withRouter(Welcome);
