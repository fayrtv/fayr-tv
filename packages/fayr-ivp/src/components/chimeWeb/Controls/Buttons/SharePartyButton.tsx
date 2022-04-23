// Framework
import * as React from "react";

import ShareInvite from "components/chimeWeb/Meeting/ShareInvite";
import Portal from "components/common/Portal";

// Styles
import styles from "./CommonButton.module.scss";

type Props = {
    title: string;
};

export const SharePartyButton = ({ title }: Props) => {
    const [showPopUp, setShowPopUp] = React.useState(false);

    return (
        <div
            className={`${styles.Button} btn rounded popup`}
            onClick={() => setShowPopUp((curr) => !curr)}
            title="Teile den Link mit deinen Freunden"
        >
            {showPopUp && (
                <Portal.Client>
                    <ShareInvite title={title} onCancel={() => setShowPopUp(false)} />
                </Portal.Client>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path
                    d="M 15 2.0019531 C 10.758 2.0019531 9 4.7229531 9 8.0019531 C 9 9.1059531 9.5273437 10.214844 9.5273438 10.214844 C 9.3153438 10.336844 8.9666875 10.724109 9.0546875 11.412109 C 9.2186875 12.695109 9.7749062 13.021828 10.128906 13.048828 C 10.263906 14.245828 11.55 15.777 12 16 L 12 18 C 11 21 3 19 3 26 L 14.523438 26 C 14.190437 25.06 14 24.054 14 23 C 14 19.461 16.047578 16.4085 19.017578 14.9375 C 19.426578 14.3675 19.801094 13.665828 19.871094 13.048828 C 20.225094 13.021828 20.781312 12.695109 20.945312 11.412109 C 21.033313 10.723109 20.684656 10.336844 20.472656 10.214844 C 20.472656 10.214844 21 9.2129531 21 8.0019531 C 21 5.5739531 20.047 3.5019531 18 3.5019531 C 18 3.5019531 17.289 2.0019531 15 2.0019531 z M 23 16 C 19.134 16 16 19.134 16 23 C 16 26.866 19.134 30 23 30 C 26.866 30 30 26.866 30 23 C 30 19.134 26.866 16 23 16 z M 23 19 C 23.552 19 24 19.447 24 20 L 24 22 L 26 22 C 26.552 22 27 22.447 27 23 C 27 23.553 26.552 24 26 24 L 24 24 L 24 26 C 24 26.553 23.552 27 23 27 C 22.448 27 22 26.553 22 26 L 22 24 L 20 24 C 19.448 24 19 23.553 19 23 C 19 22.447 19.448 22 20 22 L 22 22 L 22 20 C 22 19.447 22.448 19 23 19 z"
                    fill="#D2D2D2"
                />
            </svg>
        </div>
    );
};

export default SharePartyButton;
