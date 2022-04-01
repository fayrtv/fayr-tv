// Framework
import classNames from "classnames";
import { useInjection } from "inversify-react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { GlobalResetAction } from "redux/store";
import { RoomMemberRole } from "types/Room";
import Types from "types/inject";
import { withoutPropagation } from "util/mouseUtils";

// Styles
import styles from "./CommonButton.module.scss";

import IRoomManager from "../../../chime/interfaces/IRoomManager";

type Props = {
    ssName: string;
    role: RoomMemberRole;
    baseHref: string;
    title: string;
};

export const EndPartyButton = ({ ssName, role, baseHref, title }: Props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const roomManager = useInjection<IRoomManager>(Types.IRoomManager);

    const onEndButtonClick = async () => {
        await roomManager.leaveRoom(role === "host");
        dispatch(GlobalResetAction());
        localStorage.removeItem(ssName);
        const whereTo = `${baseHref}/${role === "host" ? "" : "join?room=" + title}`;
        history.push(whereTo);
    };

    return (
        <div
            className={classNames(styles.Button, "btn rounded btn--destruct btn--leave")}
            onClick={withoutPropagation(onEndButtonClick)}
            title="Verlasse die Watch Party"
        >
            <svg
                className={styles.BtnSvg}
                xmlns="http://www.w3.org/2000/svg"
                fill="#D2D2D2"
                viewBox="0 0 30 30"
            >
                <path d="M 14.984375 2.9863281 A 1.0001 1.0001 0 0 0 14 4 L 14 15 A 1.0001 1.0001 0 1 0 16 15 L 16 4 A 1.0001 1.0001 0 0 0 14.984375 2.9863281 z M 9.9960938 4.2128906 A 1.0001 1.0001 0 0 0 9.5449219 4.328125 C 5.6645289 6.3141271 3 10.347825 3 15 C 3 21.615466 8.3845336 27 15 27 C 21.615466 27 27 21.615466 27 15 C 27 10.347825 24.335471 6.3141271 20.455078 4.328125 A 1.0001544 1.0001544 0 1 0 19.544922 6.109375 C 22.780529 7.7653729 25 11.110175 25 15 C 25 20.534534 20.534534 25 15 25 C 9.4654664 25 5 20.534534 5 15 C 5 11.110175 7.2194712 7.7653729 10.455078 6.109375 A 1.0001 1.0001 0 0 0 9.9960938 4.2128906 z" />
            </svg>
        </div>
    );
};

export default EndPartyButton;
