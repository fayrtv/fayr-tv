// Framework
import classNames from "classnames";
import { useInjection } from "inversify-react";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { GlobalResetAction } from "redux/store";
import styled from "styled-components";
import { RoomMemberRole } from "types/Room";
import Types from "types/inject";
import { withoutPropagation } from "util/mouseUtils";

import Portal from "components/common/Portal";

import { MaterialIcon } from "@fayr/common";

// Styles
import styles from "./CommonButton.module.scss";

import IRoomManager from "../../../chime/interfaces/IRoomManager";
import EndPartyConfirmation from "../EndPartyConfirmation";

const StyledButton = styled.div`
    max-width: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    cursor: pointer;
    > span {
        margin: 0 5px;
    }
`;

const LeftNavigationButton = styled.span`
    height: 25px;
    width: 25px;
    border-radius: 15px;
    background-color: white;
`;

const ExitSpan = styled.span`
    font-size: 2rem;
    font-weight: 500;
    color: white;
`;

type Props = {
    ssName: string;
    role: RoomMemberRole;
    baseHref: string;
};

enum LeaveState {
    Participating,
    AwaitingConfirmation,
}

export const EndPartyButton = ({ ssName, role, baseHref }: Props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const roomManager = useInjection<IRoomManager>(Types.IRoomManager);

    const [leaveState, setLeaveState] = React.useState<LeaveState>(LeaveState.Participating);

    const onExitClick = () => setLeaveState(LeaveState.AwaitingConfirmation);

    const onEndButtonClick = async () => {
        await roomManager.leaveRoom(role === "host");
        dispatch(GlobalResetAction());
        localStorage.removeItem(ssName);
        const whereTo = `${baseHref}/end`;
        history.push(whereTo);
    };

    return (
        <>
            <StyledButton
                className={classNames(styles.Button, "btn rounded btn--destruct btn--leave")}
                onClick={withoutPropagation(onExitClick)}
                title="Verlasse die Watch Party"
            >
                <LeftNavigationButton>
                    <MaterialIcon iconName="navigate_before" />
                </LeftNavigationButton>
                <ExitSpan>ENDE</ExitSpan>
            </StyledButton>
            {leaveState === LeaveState.AwaitingConfirmation && (
                <Portal.Client>
                    <EndPartyConfirmation
                        onConfirm={onEndButtonClick}
                        onDeny={() => setLeaveState(LeaveState.Participating)}
                    />
                </Portal.Client>
            )}
        </>
    );
};

export default EndPartyButton;
