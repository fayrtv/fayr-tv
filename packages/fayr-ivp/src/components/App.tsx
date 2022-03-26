import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from "react-router-dom";
import store from "redux/store";

import End from "components/chimeWeb/End";
import Welcome from "components/chimeWeb/Welcome";

import styles from "./App.module.scss";

import * as config from "../config";
import ChimeSdkWrapper from "./chime/ChimeSdkWrapper";
import SocketContextProvider from "./chime/SocketContextProvider";
import Join from "./chimeWeb/Intro/Join";
import MeetingContainer from "./chimeWeb/Meeting/MeetingContainer";
import ChatOpenContextProvider from "./contexts/ChatOpenContext";
import IvpTranslationContextProvider from "./contexts/IvpTranslationContext";
import SelectedReactionContextProvider from "./contexts/SelectedReactionContext";
import VotingOpenContextProvider from "./contexts/VotingOpenContext";

function MainIvpRouter(props: { chime: ChimeSdkWrapper; from: string }) {
    let { path } = useRouteMatch();

    if (path === "/") {
        path = "";
    }

    return (
        <Router>
            <Switch>
                <Route path={`${path}/end`}>
                    <End />
                </Route>
                <Route path={`${path}/meeting`}>
                    <Provider store={store}>
                        <ChatOpenContextProvider>
                            <VotingOpenContextProvider>
                                <SocketContextProvider>
                                    <SelectedReactionContextProvider>
                                        <MeetingContainer chime={props.chime} />
                                    </SelectedReactionContextProvider>
                                </SocketContextProvider>
                            </VotingOpenContextProvider>
                        </ChatOpenContextProvider>
                    </Provider>
                </Route>
                <Route path={`${path}/join`}>
                    <Join />
                </Route>
                <Route path={`${path}/`}>
                    <Welcome chime={props.chime} />
                </Route>
            </Switch>
        </Router>
    );
}

function App() {
    const chime = new ChimeSdkWrapper();
    const baseHref = config.BASE_HREF;

    return (
        <div className={styles.App}>
            <IvpTranslationContextProvider>
                <Router>
                    <Switch>
                        <Route path={`${baseHref}/preview/:platform`}>
                            <MainIvpRouter chime={chime} from={"preview"} />
                        </Route>

                        <Route path={`${baseHref}`}>
                            <MainIvpRouter chime={chime} from={"root"} />
                        </Route>
                    </Switch>
                </Router>
            </IvpTranslationContextProvider>
        </div>
    );
}

export default App;
