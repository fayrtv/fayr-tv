// Framework
import * as React from "react";

// Components
import Flex from "components/common/Flex"

// Styles
import styles from "./styles/VoteCounter.module.scss";
import MaterialIcon from "components/common/MaterialIcon";

type Props = {
	value: number;
	setValue: React.Dispatch<number>;
}

export const VoteCounter = ({ value, setValue }: Props) => {

	const decreaseValue = () => {
		if (value === 0) {
			return;
		}

		setValue(value - 1);
	}

	const increaseValue = () => {
		setValue(value + 1);
	}

	return (
		<Flex 
			className={styles.VoteCounter}
			crossAlign="Center"
			space="Between"
			direction="Row">
			<MaterialIcon
				color="white"
				className={styles.CountButton}
				iconName="remove_circle_outline"
				onClick={decreaseValue} />
			<div className={styles.CountDisplay}>
				<span>
					{ value }
				</span>
			</div>
			<MaterialIcon
				color="white"
				className={styles.CountButton}
				iconName="add_circle_outline" 
				onClick={increaseValue}/>
		</Flex>
	);
}

export default VoteCounter;