import React from "react";

import useEventHandler from "hooks/useEventHandler";

// Styles
import "./Error.css";

// Assets

type Props = {
    errorMsg?: string | null;
    closeError: () => void;
};

const Error = ({ errorMsg, closeError }: Props) => {
    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.code === "Escape" || ev.keyCode === 27) {
            closeError();
        }
    };

    useEventHandler("keydown", handleKeyDown);

    const handleClick = (ev: any) => {
        let node = ev.target;
        let isModal = false;
        while (node) {
            if (node && node.classList && node.classList.contains("notice--error")) {
                isModal = true;
                break;
            }
            node = node.parentNode;
        }
        if (!isModal) {
            closeError();
        }
    };

    const handleGoCreateRoom = () => {
        window.location.replace("/index.html");
    };

    return (
        <div className="notice notice--error" onClick={handleClick}>
            <div className="notice__content">
                <div className="icon icon--24 notice__icon">
                    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0M 526 150C 576 150 602 175 601 224C 600 300 600 350 575 525C 570 560 560 575 525 575C 525 575 475 575 475 575C 440 575 430 560 425 525C 400 355 400 300 400 226C 400 175 425 150 475 150M 500 650C 527 650 552 661 571 679C 589 698 600 723 600 750C 600 805 555 850 500 850C 445 850 400 805 400 750C 400 723 411 698 429 679C 448 661 473 650 500 650C 500 650 500 650 500 650" />
                    </svg>
                </div>
                {errorMsg}
                <div>
                    To create your own room, click{" "}
                    <span className="go-create-room" onClick={handleGoCreateRoom}>
                        here
                    </span>
                    .
                </div>
            </div>
        </div>
    );
};

export default Error;
