import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Provider } from 'react-redux';
import * as config from '../config';
import ChatOpenContextProvider from "./contexts/ChatOpenContext";
// import './App.css';

import ChimeSdkWrapper from './chime/ChimeSdkWrapper';
import store from "redux/store";

import Home from './chimeWeb/Welcome';
import Join from './chimeWeb/Join';
import Meeting from './chimeWeb/Meeting';
import End from './chimeWeb/End';
import SocketContextProvider from './chime/SocketContextProvider';
import SelectedReactionContextProvider from './contexts/SelectedReactionContext';

function App() {
  const chime = new ChimeSdkWrapper();
  const baseHref = config.BASE_HREF;

  return (
    <div className="App full-width full-height">
      <Router>
        <Switch>
          <Route path={`${baseHref}/end`}>
            <End />
          </Route>
          <Route path={`${baseHref}/meeting`}>
			<Provider store={store}>
				<ChatOpenContextProvider>
					<SocketContextProvider>
						<SelectedReactionContextProvider>
							<Meeting
								chime={chime}/>
						</SelectedReactionContextProvider>
					</SocketContextProvider>
				</ChatOpenContextProvider>
			</Provider>
          </Route>
          <Route path={`${baseHref}/join`}>
            <Join
              chime={chime}
            />
          </Route>
          <Route path={`${baseHref}`}>
            <Home
              chime={chime}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
