import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import store from "redux/store";

import End from "components/chimeWeb/End";
import Welcome from "components/chimeWeb/Welcome";

import { applyTheme, FAYR_THEME, RAINBOW_THEME } from "@fayr/shared-components";

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

function App() {
    const chime = new ChimeSdkWrapper();
    const baseHref = config.BASE_HREF;

    const selectableThemes = [FAYR_THEME, RAINBOW_THEME];
    const [theme, setTheme] = React.useState(FAYR_THEME);

    React.useEffect(() => {
        applyTheme(theme, document.documentElement);
    }, [theme]);

    return (
        <div className={styles.App}>
            <div>
                <select
                    onChange={(option) => {
                        const newTheme = selectableThemes.find((t) => t.id === option.target.value);
                        if (newTheme) {
                            setTheme(newTheme);
                        }
                    }}
                    value={theme.id}
                >
                    {selectableThemes.map((t) => (
                        <option value={t.id}>{t.id}</option>
                    ))}
                </select>
            </div>
            <IvpTranslationContextProvider>
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
                            <Welcome chime={chime} />
                        </Route>
                    </Switch>
                </Router>
            </IvpTranslationContextProvider>
        </div>
    );
}

export default App;
