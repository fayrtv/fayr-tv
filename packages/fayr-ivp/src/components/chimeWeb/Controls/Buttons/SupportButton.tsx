import * as React from "react";
import { withoutPropagation } from "util/mouseUtils";

import Support from "components/chimeWeb/Meeting/Support";
import Portal from "components/common/Portal";

import styles from "./SupportButton.module.scss";

export const SupportButton = () => {
    const [showPopUp, setShowPopUp] = React.useState(false);

    return (
        <div
            className={`${styles.Button} btn rounded popup`}
            onClick={withoutPropagation(() => setShowPopUp((curr) => !curr))}
            title="Teile den Link mit deinen Freunden"
        >
            {showPopUp && (
                <Portal.Client>
                    <Support onCancel={() => setShowPopUp(false)} />
                </Portal.Client>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                <path
                    d="M20 7C12.8229 7 7 12.8229 7 20C7 27.1771 12.8229 33 20 33C27.1771 33 33 27.1771 33 20C33 12.8229 27.1771 7 20 7ZM20.7069 27.4479H18.6614C18.6154 27.4477 18.5713 27.4293 18.5388 27.3967C18.5063 27.3641 18.4881 27.3199 18.4881 27.2739V25.2291C18.4881 25.1831 18.5063 25.1389 18.5388 25.1063C18.5713 25.0737 18.6154 25.0553 18.6614 25.0551H20.7069C20.7529 25.0553 20.797 25.0737 20.8295 25.1063C20.862 25.1389 20.8802 25.1831 20.8802 25.2291V27.2739C20.8802 27.3199 20.862 27.3641 20.8295 27.3967C20.797 27.4293 20.7529 27.4477 20.7069 27.4479V27.4479ZM21.8579 20.7448C20.7604 21.4815 20.6094 22.1565 20.6094 22.776V23.5208C20.6094 23.5747 20.588 23.6264 20.5499 23.6645C20.5118 23.7026 20.4601 23.724 20.4063 23.724H18.9167C18.8628 23.724 18.8111 23.7026 18.773 23.6645C18.7349 23.6264 18.7135 23.5747 18.7135 23.5208V22.776C18.7135 21.2926 19.396 20.1131 20.8003 19.1699C22.1057 18.2938 22.8438 17.7385 22.8438 16.5178C22.8438 15.6877 22.3698 15.0573 21.3887 14.5908C21.1578 14.4811 20.6439 14.3741 20.0115 14.3816C19.218 14.3917 18.6018 14.5813 18.1272 14.9632C17.2321 15.6836 17.1563 16.4683 17.1563 16.4792C17.1191 16.7093 17.1001 16.9421 17.0994 17.1752C17.0994 17.2291 17.078 17.2807 17.0399 17.3188C17.0018 17.3569 16.9501 17.3783 16.8963 17.3783H15.4574C15.407 17.3786 15.3583 17.3601 15.3208 17.3264C15.2832 17.2928 15.2595 17.2464 15.2543 17.1962C15.2299 16.9258 15.232 16.6537 15.2604 16.3837C15.2753 16.2192 15.3823 14.737 16.9376 13.4858C17.744 12.8371 18.7697 12.4999 19.9844 12.4851C20.8443 12.4749 21.6521 12.6205 22.1998 12.8791C23.8391 13.6584 24.7396 14.951 24.7396 16.5178C24.7396 18.8083 23.2087 19.8368 21.8579 20.7448Z"
                    fill="#D2D2D2"
                />
            </svg>
        </div>
    );
};

export default SupportButton;
