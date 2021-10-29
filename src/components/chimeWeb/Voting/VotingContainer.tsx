// Framework
import * as React from "react";

// Components
import Flex from "components/common/Flex";
import Voting from "./Voting";

// Types
import { VotingData } from './types';

// Styles
import styles from "./styles/VotingContainer.module.scss";
import { Nullable } from '../../../types/global';
import useGlobalClickHandler from "hooks/useGlobalClickHandler";
import { isInRect } from "util/coordinateUtil";
import MaterialIcon from "components/common/MaterialIcon";

const voting: VotingData = {
	hostTeam: {
		identifier: "vfb",
		teamIconSource: "https://iconape.com/wp-content/files/hu/323161/png/vfb-stuttgart-1960-logo.png",
	},
	guestTeam: {
		identifier: "b04",
		teamIconSource: "https://icons.iconarchive.com/icons/giannis-zographos/german-football-club/256/Bayer-Leverkusen-icon.png",
	}
};

type Props = {
	
}

export const VotingContainer = ({ }: Props) => {

	const votingRef = React.createRef<HTMLDivElement>();

	const [currentVoting, setCurrentVoting] = React.useState<Nullable<VotingData>>(voting);

	useGlobalClickHandler(clickEvent => {
		if (!currentVoting && !votingRef.current) {
			return;
		}
		
		if (!isInRect(votingRef.current!.getBoundingClientRect(), clickEvent.x, clickEvent.y)) {
			setCurrentVoting(null);
		}
	});

	return (
		<>
			{ !!currentVoting && 
				<div className={`${styles.VotingContainer} ${styles.VotingActive}`}>
					<Flex
						className={styles.VotingWrapper}
						direction="Row">
						<Voting 
							votingData={currentVoting!}
							votingRef={votingRef}/>
						<div
							className={styles.CloseButton}
							onClick={() => setCurrentVoting(null)}>
							<MaterialIcon
								size={30}
								color="white"
								iconName="close"/>
						</div>
					</Flex>
				</div>
			}
		</>
	);
}

export default VotingContainer;