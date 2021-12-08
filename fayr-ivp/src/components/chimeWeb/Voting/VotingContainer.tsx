// Framework
import { connect, useDispatch } from "react-redux";
import * as React from "react";

// Components
import Flex from "components/common/Flex";
import Voting from "./Voting";

// Functionality
import useGlobalClickHandler from "hooks/useGlobalClickHandler";
import { isInRect } from "util/coordinateUtil";
import useSocket from "hooks/useSocket";
import { updateVote } from "redux/reducers/votingReducer";
import { VotingOpenContext } from "../../contexts/VotingOpenContext";

// Types
import { Callback, Nullable } from "../../../types/global";
import { ReduxStore } from "redux/store";
import { AttendeeVoteDto, VotingData } from "./types";
import { SocketEventType } from "components/chime/types";

// Styles
import styles from "./styles/VotingContainer.module.scss";
import ChimeSdkWrapper, { RosterMap } from "../../chime/ChimeSdkWrapper";

type Props = {
    attendeeId: string;
    chime: ChimeSdkWrapper;
    votings: Array<VotingData>;
};

export const VotingContainer = ({ attendeeId, chime, votings }: Props) => {
    const votingRef = React.createRef<HTMLDivElement>();

    const dispatch = useDispatch();

    const { socket } = useSocket();

    const [currentVoting, setCurrentVoting] = React.useState<Nullable<VotingData>>(null);

    const { isOpen, set: setIsOpen } = React.useContext(VotingOpenContext);

    const [idNameMapping, setIdNameMapping] = React.useState<Map<string, string>>(
        new Map<string, string>(),
    );

    React.useEffect(() => {
        const callback: Callback<RosterMap> = (x) => {
            setIdNameMapping(
                new Map<string, string>(Object.entries(x).map(([key, val]) => [key, val.name])),
            );
        };
        chime.subscribeToRosterUpdate(callback);
        return () => chime.unsubscribeFromRosterUpdate(callback);
    }, [chime, setIdNameMapping]);

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        return socket.addListener<AttendeeVoteDto>(SocketEventType.AttendeeVote, (event) => {
            const nameOfAttendee = idNameMapping.has(event.attendeeId)
                ? idNameMapping.get(event.attendeeId)!
                : event.attendeeId;
            dispatch(
                updateVote({
                    ...event,
                    name: nameOfAttendee,
                }),
            );
            return Promise.resolve();
        });
    }, [socket, dispatch, idNameMapping]);

    React.useEffect(() => {
        if (!votings) {
            return;
        }

        setCurrentVoting(votings[0]);
    }, [votings]);

    useGlobalClickHandler((clickEvent) => {
        if (!currentVoting || !votingRef.current || !isOpen) {
            return;
        }

        if (!isInRect(votingRef.current!.getBoundingClientRect(), clickEvent.x, clickEvent.y)) {
            setIsOpen(false);
        }
    });

    const updateTip = (hostTip: number, guestTip: number) => {
        const nameOfAttendee = idNameMapping.has(attendeeId)
            ? idNameMapping.get(attendeeId)!
            : attendeeId;
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
        <>
            {!!currentVoting && isOpen && (
                <div className={`${styles.VotingContainer} ${styles.VotingActive}`}>
                    <Flex className={styles.VotingWrapper} direction="Row" mainAlign="Center">
                        <Voting
                            voting={currentVoting!}
                            votingRef={votingRef}
                            updateTip={updateTip}
                            closeVoting={() => setIsOpen(false)}
                        />
                    </Flex>
                </div>
            )}
        </>
    );
};

const mapStateToProps = (store: ReduxStore): Pick<Props, "votings"> => ({
    votings: store.votingReducer,
});

export default connect(mapStateToProps)(VotingContainer);
