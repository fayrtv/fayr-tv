import React from "react";
import styled from "styled-components";

import Flex from "../Flex";

const ConfirmationDialogWrapper = styled(Flex)`
    background: #282828;
    border-radius: 5px;
    padding: 0.5em;
    color: #ffffff;
`;

const MarginSpan = styled.span`
    color: white;
    margin: 1em 0;
`;

const Button = styled.button`
    height: 2em;
    width: 4em;
    margin: 0.25em;
`;

type Props = {
    text: string;
    onConfirm(): Promise<void> | void;
    onDeny(): Promise<void> | void;
};

const ConfirmationDialog = ({ text, onConfirm, onDeny }: Props) => {
    return (
        <ConfirmationDialogWrapper
            className="ConfirmationDialog"
            crossAlign="Center"
            direction="Column"
        >
            <MarginSpan>{text}</MarginSpan>
            <Flex direction="Row" space="Around">
                <Button className="btn btn--primary" onClick={onConfirm}>
                    <span color="white">Ja</span>
                </Button>
                <Button className="btn btn--secondary" onClick={onDeny}>
                    <span color="white">Nein</span>
                </Button>
            </Flex>
        </ConfirmationDialogWrapper>
    );
};

export default ConfirmationDialog;
