// Framework
import { connect, useDispatch } from 'react-redux';
import * as React from "react";

// Components
import Flex from "components/common/Flex";
import Voting from "./Voting";

// Functionality
import useGlobalClickHandler from "hooks/useGlobalClickHandler";
import { isInRect } from "util/coordinateUtil";
import useSocket from 'hooks/useSocket';
import { updateVote } from "redux/reducers/votingReducer";
import { VotingOpenContext } from '../../contexts/VotingOpenContext';

// Types
import { Nullable } from '../../../types/global';
import { ReduxStore } from 'redux/store';
import { AttendeeVote, VotingData } from './types';

// Styles
import styles from "./styles/VotingContainer.module.scss";
import { SocketEventType } from 'components/chime/types';

type Props = {
	attendeeId: string;
	votings: Array<VotingData>;
}

export const VotingContainer = ({ attendeeId, votings }: Props) => {
	const votingRef = React.createRef<HTMLDivElement>();

	const dispatch = useDispatch();

	const { socket } = useSocket();

	const [currentVoting, setCurrentVoting] = React.useState<Nullable<VotingData>>(null);

	const { isOpen, set: setIsOpen } = React.useContext(VotingOpenContext);

	React.useEffect(() => {
		if (!socket) {
			return;
		}
		
		return socket.addListener<AttendeeVote>(SocketEventType.AttendeeVote, event => {
			dispatch(updateVote(event));
			return Promise.resolve();
		});

	}, [socket, dispatch]);

	React.useEffect(() => {
		if (!votings) {
			return;
		}

		setCurrentVoting(votings[0]);
	}, [votings]);

	useGlobalClickHandler(clickEvent => {
		if (!currentVoting || !votingRef.current || !isOpen) {
			return;
		}
		
		if (!isInRect(votingRef.current!.getBoundingClientRect(), clickEvent.x, clickEvent.y)) {
			setIsOpen(false);
		}
	});

	const updateTip = (hostTip: number, guestTip: number) => {

		const attendeeVote: AttendeeVote = {
			attendeeId,
			guestTeam: guestTip,
			hostTeam: hostTip,
			votingId: currentVoting!.votingId,
		};

		dispatch(updateVote(attendeeVote));

		socket?.send<AttendeeVote>({
			messageType: SocketEventType.AttendeeVote,
			payload: attendeeVote,
		});
	}

	return (
		<>
			{ !!currentVoting && isOpen && 
				<div className={`${styles.VotingContainer} ${styles.VotingActive}`}>
					<Flex
						className={styles.VotingWrapper}
						direction="Row"
						mainAlign="Center">
						<Voting 
							voting={currentVoting!}
							votingRef={votingRef}
							updateTip={updateTip}
							closeVoting={() => setIsOpen(false)}/>
					</Flex>
				</div>
			}
		</>
	);
}

const mapStateToProps = (store: ReduxStore): Pick<Props, "votings"> => ({
	votings: store.votingReducer,
})

export default connect(mapStateToProps)(VotingContainer);