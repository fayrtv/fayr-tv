import { Provider as InversifyProvider } from "inversify-react";
import { container } from "inversify.config";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from "react-router-dom";
import store from "redux/store";

import End from "components/chimeWeb/End";
import Welcome from "components/chimeWeb/Welcome";

import { applyTheme, ErrorBoundary, VFB_THEME } from "@fayr/common";

import styles from "./App.module.scss";

import * as config from "../config";
import SocketContextProvider from "./chime/SocketContextProvider";
import Join from "./chimeWeb/Intro/Join";
import MeetingContainer from "./chimeWeb/Meeting/MeetingContainer";
import ChatOpenContextProvider from "./contexts/ChatOpenContext";
import IvpTranslationContextProvider from "./contexts/IvpTranslationContext";
import SelectedReactionContextProvider from "./contexts/SelectedReactionContext";
import SettingsViewOpenContext from "./contexts/SettingsViewOpenContext";

const queryClient = new QueryClient();

function MainIvpRouter() {
    let { path } = useRouteMatch();

    if (path === "/") {
        path = "";
    }

    React.useEffect(() => {
        applyTheme(VFB_THEME, document.documentElement);
    }, []);

    return (
        <Router>
            <Switch>
                <Route path={`${path}/end`}>
                    <div className={styles.ArenaBackground}>
                        <End />
                    </div>
                </Route>
                <Route path={`${path}/meeting`}>
                    <Provider store={store}>
                        <ChatOpenContextProvider>
                            <SettingsViewOpenContext>
                                <SocketContextProvider>
                                    <SelectedReactionContextProvider>
                                        <MeetingContainer />
                                    </SelectedReactionContextProvider>
                                </SocketContextProvider>
                            </SettingsViewOpenContext>
                        </ChatOpenContextProvider>
                    </Provider>
                </Route>
                <Route path={`${path}/join`}>
                    <div className={styles.ArenaBackground}>
                        <Join />
                    </div>
                </Route>
                <Route path={`${path}/`}>
                    <ErrorBoundary>
                        <div className={styles.ArenaBackground}>
                            <Welcome />
                        </div>
                    </ErrorBoundary>
                </Route>
            </Switch>
        </Router>
    );
}

function App() {
    const baseHref = config.BASE_HREF;

    return (
        <div className={styles.App}>
            <InversifyProvider container={container}>
                <QueryClientProvider client={queryClient}>
                    <IvpTranslationContextProvider>
                        <Router>
                            <Switch>
                                <Route path={`${baseHref}/preview/:platform`}>
                                    <MainIvpRouter />
                                </Route>

                                <Route path={`${baseHref}`}>
                                    <MainIvpRouter />
                                </Route>
                            </Switch>
                        </Router>
                    </IvpTranslationContextProvider>
                    {/*<ReactQueryDevtools initialIsOpen={false} />*/}
                </QueryClientProvider>
            </InversifyProvider>
        </div>
    );
}

export default App;
