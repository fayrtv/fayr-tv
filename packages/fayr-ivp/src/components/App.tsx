import { PlatformConfig } from "@fayr/api-contracts";
import React from "react";
import { Provider } from "react-redux";
import {
    BrowserRouter as Router,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch,
    withRouter,
} from "react-router-dom";
import store from "redux/store";

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

const CustomPlatformContext = React.createContext(null);

const MainIvpRouter = withRouter(
    ({ chime, match }: RouteComponentProps & { chime: ChimeSdkWrapper }) => {
        let { path } = useRouteMatch();

        const { platform } = match.params as { platform?: string };

        if (path === "/") {
            path = "";
        }

        React.useEffect(() => {
            fetch(`${config.API_BASE_URL}platforms/${platform}`, { method: "GET" }).then((result) =>
                result.json().then((platformConfig: PlatformConfig) => {
                    if (platformConfig.styling?.theme) {
                        console.log(`Applying theme for platform "${platformConfig.info?.name}"`);
                        applyTheme(platformConfig.styling.theme, document.documentElement);
                    }
                }),
            );
        }, [platform]);

        return (
            <CustomPlatformContext.Provider value={}>
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
                                                <MeetingContainer chime={chime} />
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
                            <Welcome chime={chime} />
                        </Route>
                    </Switch>
                </Router>
            </CustomPlatformContext.Provider>
        );
    },
);

function App() {
    const chime = new ChimeSdkWrapper();
    const baseHref = config.BASE_HREF;

    return (
        <div className={styles.App}>
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
        </div>
    );
}

export default App;
