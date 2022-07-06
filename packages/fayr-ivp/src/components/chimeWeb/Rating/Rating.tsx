import classNames from "classnames";
import * as React from "react";

import { Flex } from "@fayr/common";

import styles from "./Rating.module.scss";

export default function Rating() {
    const [selectedRating, setSelectedRating] = React.useState(0);

    const onMouseOver: React.MouseEventHandler<HTMLSpanElement> = (event) => {
        const hoveredId = event.currentTarget.id;
        const hoveredStarIndex = parseInt(hoveredId[hoveredId.length - 1]);
        setSelectedRating(hoveredStarIndex);
    };

    const onMouseLeave = () => setSelectedRating(0);

    const onClick = (rating: number) => {
        console.log(`Rated with ${rating} stars`);
    };

    const Star = (index: number) => (
        <span
            key={index}
            id={`star-${index}`}
            className={classNames("material-icons", styles.Star, {
                [styles.YellowStar]: selectedRating >= index,
            })}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={() => onClick(index)}
        >
            star_rate
        </span>
    );

    return (
        <Flex direction="Column">
            <h2>Wie fandest du die Watch Party?</h2>
            <Flex direction="Row" mainAlign="Center">
                {[1, 2, 3, 4, 5].map((x) => Star(x))}
            </Flex>
        </Flex>
    );
}
