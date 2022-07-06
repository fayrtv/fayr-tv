import classNames from "classnames";
import * as config from "config";
import * as React from "react";

import { Flex } from "@fayr/common";

import styles from "./Rating.module.scss";

export default function Rating() {
    const [selectedRating, setSelectedRating] = React.useState(0);
    const [wasRatingSubmitted, setWasRatingSubmitted] = React.useState(false);

    const onMouseOver: React.MouseEventHandler<HTMLSpanElement> = (event) => {
        if (wasRatingSubmitted) {
            return;
        }

        const hoveredId = event.currentTarget.id;
        const hoveredStarIndex = parseInt(hoveredId[hoveredId.length - 1]);
        setSelectedRating(hoveredStarIndex);
    };

    const onMouseLeave = () => {
        if (wasRatingSubmitted) {
            return;
        }

        setSelectedRating(0);
    };

    const onClick = async (rating: number) => {
        setWasRatingSubmitted(true);
        await fetch(`${config.CHIME_ROOM_API}/addRating`, {
            method: "POST",
            body: JSON.stringify({
                rating,
            }),
        });
    };

    const Star = (index: number) => {
        const outlined = selectedRating < index;

        return (
            <span
                key={index}
                id={`star-${index}`}
                className={classNames(`material-icons${outlined ? "-outlined" : ""}`, styles.Star, {
                    [styles.YellowStar]: selectedRating >= index,
                })}
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
                onClick={() => onClick(index)}
            >
                star_rate
            </span>
        );
    };

    return (
        <Flex direction="Column" style={{ fontStyle: "initial", gap: 15 }}>
            <h2>Wie fandest du die Watch-Party?</h2>
            <Flex direction="Row" mainAlign="Center">
                {[1, 2, 3, 4, 5].map((x) => Star(x))}
            </Flex>
        </Flex>
    );
}
