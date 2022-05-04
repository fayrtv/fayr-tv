// Framework
import classNames from "classnames";
import * as React from "react";
import { withoutPropagation } from "util/mouseUtils";

import Portal from "components/common/Portal";

// Styles
import styles from "./VotingButton.module.scss";

import VotingContainer from "../../Voting/VotingContainer";

type Props = {
    attendeeId: string;
};

export const VotingButton = ({ attendeeId }: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div
            className={classNames(
                styles.Button,
                styles.VotingButton,
                { [styles.Active]: isOpen },
                "btn rounded",
            )}
            onClick={withoutPropagation(() => setIsOpen((curr) => !curr))}
        >
            {isOpen && (
                <Portal.Client>
                    <VotingContainer attendeeId={attendeeId} onClose={() => setIsOpen(false)} />
                </Portal.Client>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" fill="#D2D2D2" viewBox="0 0 50 50">
                <path
                    d="M 30.644531 0 C 30.390625 0 30.136719 0.0976563 29.9375 0.292969 L 15.824219 14.410156 L 20.105469 18.6875 C 21.457031 17.632813 23.152344 17 25 17 C 29.410156 17 33 20.589844 33 25 C 33 26.847656 32.367188 28.542969 31.3125 29.898438 L 35.59375 34.175781 L 49.707031 20.0625 C 49.894531 19.871094 50 19.617188 50 19.355469 C 50 19.089844 49.894531 18.832031 49.707031 18.644531 L 45.988281 14.925781 L 39.707031 21.207031 C 39.511719 21.402344 39.257813 21.5 39 21.5 C 38.742188 21.5 38.488281 21.402344 38.292969 21.207031 L 28.792969 11.707031 C 28.402344 11.316406 28.402344 10.683594 28.792969 10.292969 L 35.074219 4.011719 L 31.355469 0.292969 C 31.15625 0.0976563 30.902344 0 30.644531 0 Z M 13.46875 2.820313 C 8.917969 5.191406 5.191406 8.917969 2.820313 13.46875 L 4.59375 14.390625 C 6.777344 10.207031 10.207031 6.777344 14.390625 4.59375 Z M 36.488281 5.429688 L 30.914063 11 L 39 19.085938 L 44.574219 13.515625 Z M 16.238281 8.148438 C 12.78125 9.953125 9.953125 12.78125 8.148438 16.238281 L 9.921875 17.160156 C 11.535156 14.070313 14.070313 11.535156 17.160156 9.921875 Z M 14.40625 15.824219 L 0.292969 29.9375 C 0.105469 30.128906 0 30.382813 0 30.644531 C 0 30.910156 0.105469 31.167969 0.292969 31.355469 L 4.011719 35.074219 L 10.292969 28.792969 C 10.683594 28.402344 11.316406 28.402344 11.707031 28.792969 L 21.207031 38.292969 C 21.597656 38.683594 21.597656 39.3125 21.207031 39.703125 L 14.925781 45.984375 L 18.644531 49.703125 C 18.839844 49.902344 19.097656 50 19.355469 50 C 19.609375 50 19.867188 49.902344 20.0625 49.707031 L 34.175781 35.589844 L 29.898438 31.3125 C 28.542969 32.367188 26.847656 33 25 33 C 20.589844 33 17 29.410156 17 25 C 17 23.152344 17.632813 21.457031 18.6875 20.101563 Z M 25 19 C 23.707031 19 22.511719 19.417969 21.53125 20.113281 L 29.886719 28.46875 C 30.582031 27.488281 31 26.292969 31 25 C 31 21.691406 28.308594 19 25 19 Z M 20.113281 21.53125 C 19.417969 22.511719 19 23.707031 19 25 C 19 28.308594 21.691406 31 25 31 C 26.292969 31 27.488281 30.582031 28.46875 29.886719 Z M 11 30.914063 L 5.425781 36.488281 L 13.511719 44.574219 L 19.082031 39 Z M 40.039063 32.914063 C 38.4375 35.949219 35.949219 38.4375 32.914063 40.039063 L 33.84375 41.808594 C 37.238281 40.015625 40.015625 37.238281 41.808594 33.84375 Z M 45.390625 35.640625 C 43.210938 39.800781 39.800781 43.210938 35.640625 45.390625 L 36.566406 47.160156 C 41.089844 44.792969 44.792969 41.089844 47.160156 36.566406 Z"
                    fill="#D2D2D2"
                />
            </svg>
        </div>
    );
};

export default VotingButton;
