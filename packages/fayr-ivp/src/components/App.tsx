import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from "react-router-dom";
import store from "redux/store";

import { usePlatformConfig } from "hooks/usePlatformConfig";

import End from "components/chimeWeb/End";
import Welcome from "components/chimeWeb/Welcome";

import { applyTheme } from "@fayr/shared-components";

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

const queryClient = new QueryClient();

function MainIvpRouter(props: { chime: ChimeSdkWrapper }) {
    let { path } = useRouteMatch();

    if (path === "/") {
        path = "";
    }

    const { platformConfig } = usePlatformConfig();

    React.useEffect(() => {
        if (!platformConfig?.styling?.theme) {
            return;
        }
        applyTheme(platformConfig.styling.theme, document.documentElement);
    }, [platformConfig?.styling?.theme]);

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
            <QueryClientProvider client={queryClient}>
                <IvpTranslationContextProvider>
                    <Router>
                        <Switch>
                            <Route path={`${baseHref}/preview/:platform`}>
                                <MainIvpRouter chime={chime} />
                            </Route>

                            <Route path={`${baseHref}`}>
                                <MainIvpRouter chime={chime} />
                            </Route>
                        </Switch>
                    </Router>
                </IvpTranslationContextProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </div>
    );
}

export default App;
