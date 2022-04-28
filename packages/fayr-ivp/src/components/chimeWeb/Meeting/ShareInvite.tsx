// Framework
import classNames from "classnames";
import * as config from "config";
import React from "react";
import {
    EmailShareButton,
    FacebookShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    WhatsappIcon,
    TelegramIcon,
    FacebookIcon,
    EmailIcon,
} from "react-share";
import styled from "styled-components";
import { isInRect } from "util/coordinateUtil";

import useMeetingMetaData from "hooks/useMeetingMetaData";
import useTranslations from "hooks/useTranslations";

// Components
import { Cell, Flex, Grid, MaterialIcon, format } from "@fayr/common";

// Styles
import styles from "./ShareInvite.module.scss";

const ButtonRowFlex = styled(Flex)`
    svg {
        max-height: 40px;
        max-width: 40px;

        margin: 0 5px;
        border-radius: 5px;
    }
`;

type Props = {
    title: string;
    onCancel(): void;
};

export const ShareInvite = ({ title, onCancel }: Props) => {
    const tl = useTranslations();
    const [copied, setCopied] = React.useState(false);
    const copyClickTimeout = React.useRef(0);
    const shareInviteRef = React.useRef<HTMLDivElement>(null);

    const [{ userName }] = useMeetingMetaData();

    const link = `${window.location.origin}${window.location.pathname.replace(
        "meeting",
        "index.html",
    )}?action=join&room=${title}`;

    const onContainerClick: React.MouseEventHandler<HTMLDivElement> = (clickEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        if (!shareInviteRef.current) {
            return;
        }

        const rect = shareInviteRef.current!.getBoundingClientRect();

        if (!isInRect(rect, clickEvent.clientX, clickEvent.clientY)) {
            onCancel();
        }
    };

    const copyTextToClipboard = React.useCallback(async (text: string) => {
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                if (config.DEBUG) {
                    console.log("Room link copied to clipboard");
                }
            } catch (err) {
                if (config.DEBUG) {
                    console.log("Could not copy text: ", err);
                }
            }
        }
    }, []);

    const onCopyClick = async () => {
        await copyTextToClipboard(encodeURI(link));

        setCopied(true);

        if (copyClickTimeout.current) {
            window.clearTimeout(copyClickTimeout.current);
        }

        copyClickTimeout.current = window.setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className={styles.ShareInviteContainer}>
            <div
                className={classNames(styles.ShareInvite, "lg:w-1/3 lg:h-1/3")}
                ref={shareInviteRef}
                onClick={onContainerClick}
            >
                <Grid
                    className="h-full w-full"
                    gridProperties={{
                        gridTemplateAreas: `
						'Header . .' 
						'LinkCopyResponse LinkCopyResponse LinkCopyResponse'
						'WatchPartyInvite WatchPartyInvite CopyButton'
						'ShareButtons . .'
						'. . Close'
					`,
                        gap: "1rem",
                        gridTemplateColumns: "30% 50% 20%",
                        gridTemplateRows: "repeat(1fr, 5)",
                    }}
                >
                    <Cell gridArea="Header">
                        <h2>{tl.Invitation}</h2>
                    </Cell>
                    <Cell gridArea="LinkCopyResponse" className={styles.LinkCopyResponse}>
                        {copied && (
                            <Flex className={styles.CopyResponseFeedback}>
                                <span className={styles.IconWrapper}>
                                    <MaterialIcon iconName="check" color="#24D366" />
                                </span>
                                <span>{tl.LinkCopied}</span>
                            </Flex>
                        )}
                    </Cell>
                    <Cell gridArea="WatchPartyInvite">
                        <Flex direction="Column">
                            <span>{tl.LinkToWatchPartyRoom}</span>
                            <span className="border-white border-2 rounded-lg py-1 px-5">
                                {link}
                            </span>
                        </Flex>
                    </Cell>
                    <Cell gridArea="CopyButton" className="grid content-center">
                        <div
                            className={styles.Button}
                            style={{ backgroundColor: "#2979FF" }}
                            onClick={onCopyClick}
                        >
                            <MaterialIcon iconName="content_copy" size={24} color="white" />
                        </div>
                    </Cell>
                    <Cell gridArea="ShareButtons">
                        <ButtonRowFlex direction="Row">
                            <WhatsappShareButton
                                url={`${format(tl.InvitationPrompt, userName)}: ${link}`}
                            >
                                <WhatsappIcon />
                            </WhatsappShareButton>
                            <TelegramShareButton
                                url={`${format(tl.InvitationPrompt, userName)}: ${link}`}
                            >
                                <TelegramIcon />
                            </TelegramShareButton>
                            <FacebookShareButton url={link}>
                                <FacebookIcon />
                            </FacebookShareButton>
                            <EmailShareButton
                                url={link}
                                subject={tl.Invitation}
                                body={format(tl.InvitationPrompt, userName)}
                            >
                                <EmailIcon />
                            </EmailShareButton>
                        </ButtonRowFlex>
                    </Cell>
                    <Cell gridArea="Close">
                        <span className={styles.CloseButton} onClick={onCancel}>
                            {tl.Close}
                        </span>
                    </Cell>
                </Grid>
            </div>
        </div>
    );
};

export default ShareInvite;
