import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as config from '../../config';

class End extends Component {

  constructor() {
    super();
    this.baseHref = config.BASE_HREF;
  }

  render() {
    return (
      <div className="welcome form-grid">
        <div className="welcome__intro">
          <div className="intro__inner formatted-text">
            <h1>FAYR TV</h1>
            <h3>Erstelle eine WatchParty und verbringe mit deinen Freunden eine geile Zeit!</h3>
          </div>
        </div>

        <div className="welcome__content pd-4">
          <div className="content__inner formatted-text">
            <h2 className="mg-b-2">WatchParty geschlossen</h2>
            <p>Der Host hat die WatchParty beendet und für alle geschlossen.</p>
            <a href={`${this.baseHref}/`} className="mg-t-3 btn btn--primary">Create a new room</a>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(End);
