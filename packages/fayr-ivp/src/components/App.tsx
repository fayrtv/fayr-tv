import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import store from "redux/store";

import End from "components/chimeWeb/End";
import Welcome from "components/chimeWeb/Welcome";

import TranslationContextProvider from "@fayr/shared-components/lib/translations/TranslationContextProvider";

import styles from "./App.module.scss";

import * as config from "../config";
import { Translations } from "../types/translations";
// import './App.css';
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

    return (
        <div className={styles.App}>
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
