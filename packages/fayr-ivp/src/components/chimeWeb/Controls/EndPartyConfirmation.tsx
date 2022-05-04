import styled from "styled-components";

import { ConfirmationDialog } from "@fayr/common";

import useTranslations from "../../../hooks/useTranslations";

const ModalContainer = styled.div`
    position: absolute;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    z-index: 9999999;

    display: grid;
    place-content: center;
`;

const DialogContainer = styled.div`
    width: auto;
    height: auto;
`;

type Props = {
    onConfirm(): void;
    onDeny(): void;
};

const EndPartyConfirmation = ({ onConfirm, onDeny }: Props) => {
    const tl = useTranslations();
    return (
        <ModalContainer onClick={onDeny}>
            <DialogContainer
                onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
            >
                <ConfirmationDialog text={tl.ConfirmLeave} onConfirm={onConfirm} onDeny={onDeny} />
            </DialogContainer>
        </ModalContainer>
    );
};

export default EndPartyConfirmation;
