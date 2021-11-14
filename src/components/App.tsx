import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import * as config from "../config";
import ChatOpenContextProvider from "./contexts/ChatOpenContext";
// import './App.css';

import ChimeSdkWrapper from "./chime/ChimeSdkWrapper";
import store from "redux/store";

import Home from "./chimeWeb/Welcome";
import Join from "./chimeWeb/Intro/Join";
import MeetingContainer from "./chimeWeb/Meeting/MeetingContainer";
import End from "./chimeWeb/End";
import SocketContextProvider from "./chime/SocketContextProvider";
import SelectedReactionContextProvider from "./contexts/SelectedReactionContext";
import VotingOpenContextProvider from "./contexts/VotingOpenContext";

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
                                <VotingOpenContextProvider>
                                    <SocketContextProvider>
                                        <SelectedReactionContextProvider>
                                            <MeetingContainer chime={chime} />
                                        </SelectedReactionContextProvider>
                                    </SocketContextProvider>
                                </VotingOpenContextProvider>
                            </ChatOpenContextProvider>
                        </Provider>
                    </Route>
                    <Route path={`${baseHref}/join`}>
                        <Join />
                    </Route>
                    <Route path={`${baseHref}`}>
                        <Home chime={chime} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
