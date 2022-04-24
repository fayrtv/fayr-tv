// Framework
import classNames from "classnames";
import * as React from "react";

// Styles
import "./styles/Toggle.scss";

type Props = {
    toggleState: boolean;
    onToggle(toggled: boolean): void;
};

export const Toggle = ({ toggleState, onToggle }: Props) => {
    const onToggleClick = React.useCallback(() => {
        const newToggleState = !toggleState;
        onToggle(newToggleState);
    }, [toggleState, onToggle]);

    return (
        <span
            className={classNames("ToggleContainer", { ["On"]: toggleState })}
            onClick={onToggleClick}
        />
    );
};

export default Toggle;
