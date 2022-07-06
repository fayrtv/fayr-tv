import classNames from "classnames";
import { useInjection } from "inversify-react";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { updateVote } from "redux/reducers/votingReducer";
import { ReduxStore } from "redux/store";
import { Callback, Nullable } from "types/global";
import Types from "types/inject";
import { isInRect } from "util/coordinateUtil";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";
import useSocket from "hooks/useSocket";

import { SocketEventType } from "components/chime/interfaces/ISocketProvider";

import { Flex } from "@fayr/common";

import styles from "./styles/VotingContainer.module.scss";

import { useAttendeeInfo } from "../../../hooks/useAttendeeInfo";
import IRoomManager, { RosterMap } from "../../chime/interfaces/IRoomManager";
import Voting from "./Voting";
import { AttendeeVoteDto, VotingData } from "./types";

type Props = {
    attendeeId: string;
    votings: Array<VotingData>;
    onClose(): void;
};

export const VotingContainer = ({ attendeeId, votings, onClose }: Props) => {
    const votingRef = React.createRef<HTMLDivElement>();

    const roomManager = useInjection<IRoomManager>(Types.IRoomManager);

    const dispatch = useDispatch();

    const { socket } = useSocket();

    const [currentVoting, setCurrentVoting] = React.useState<Nullable<VotingData>>(votings[0]);

    const { getAttendee } = useAttendeeInfo();

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        return socket.addListener<AttendeeVoteDto>(SocketEventType.AttendeeVote, (event) => {
            const nameOfAttendee = getAttendee(event.attendeeId)?.name ?? event.attendeeId;
            dispatch(
                updateVote({
                    ...event,
                    name: nameOfAttendee,
                }),
            );
            return Promise.resolve();
        });
    }, [socket, dispatch, getAttendee]);

    React.useEffect(() => {
        if (!votings) {
            return;
        }

        setCurrentVoting(votings[0]);
    }, [votings]);

    const onClick: React.MouseEventHandler<HTMLDivElement> = (clickEvent) => {
        clickEvent.stopPropagation();
        clickEvent.preventDefault();
        if (!currentVoting || !votingRef.current) {
            return;
        }

        if (
            !isInRect(
                votingRef.current!.getBoundingClientRect(),
                clickEvent.clientX,
                clickEvent.clientY,
            )
        ) {
            onClose();
        }
    };

    useGlobalKeyHandler("Escape", onClose);

    const updateTip = (hostTip: number, guestTip: number) => {
        const nameOfAttendee = getAttendee(attendeeId)?.name ?? attendeeId;
        const attendeeVote: AttendeeVoteDto = {
            attendeeId,
            guestTeam: guestTip,
            hostTeam: hostTip,
            votingId: currentVoting!.votingId,
        };

        dispatch(
            updateVote({
                ...attendeeVote,
                name: nameOfAttendee,
            }),
        );

        socket?.send<AttendeeVoteDto>({
            messageType: SocketEventType.AttendeeVote,
            payload: attendeeVote,
        });
    };

    return (
        <div className={classNames(styles.VotingContainer, styles.VotingActive)} onClick={onClick}>
            <Flex className={styles.VotingWrapper} direction="Row" mainAlign="Center">
                <Voting
                    voting={currentVoting!}
                    votingRef={votingRef}
                    updateTip={updateTip}
                    closeVoting={onClose}
                />
            </Flex>
        </div>
    );
};

const mapStateToProps = (store: ReduxStore): Pick<Props, "votings"> => ({
    votings: store.votingReducer,
});

export default connect(mapStateToProps)(VotingContainer);
