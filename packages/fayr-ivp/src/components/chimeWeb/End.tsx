import { withRouter } from "react-router-dom";

import { Flex } from "@fayr/common";

import Rating from "./Rating/Rating";

const End = () => {
    return (
        <div className="welcome form-grid">
            <div className="welcome__intro">
                <div className="intro__inner formatted-text">
                    <h1>FAYR TV</h1>
                    <h3>Wir hoffen ihr hattet Spaß und würden uns über euer Feedback freuen!</h3>
                    <Rating />
                </div>
            </div>

            <div className="welcome__content pd-4">
                <div className="content__inner formatted-text">
                    <h2 className="mg-b-2">WatchParty geschlossen</h2>
                    <p>Der Host hat die WatchParty beendet und für alle geschlossen.</p>
                    <a href="/" className="mg-t-3 btn btn--primary">
                        Neue Watch Party erstellen
                    </a>
                </div>
            </div>
            <Flex className="imprint__links" direction="Row">
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.vfb.de/de/1893/club/service/formales/impressum/"
                >
                    Impressum
                </a>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.vfb.de/de/1893/club/service/formales/datenschutz/"
                >
                    Datenschutz
                </a>
            </Flex>
        </div>
    );
};

export default withRouter(End);
