// Framework
import * as config from "config";
import React from "react";
import { isInRect } from "util/coordinateUtil";

import useGlobalClickHandler from "hooks/useGlobalClickHandler";
import useTranslations from "hooks/useTranslations";

// Components
import { Cell, Flex, Grid, MaterialIcon } from "@fayr/common";

// Styles
import styles from "./ShareInvite.module.scss";

type Props = {
    title: string;
    onCancel(): void;
};

export const ShareInvite = ({ title, onCancel }: Props) => {
    const tl = useTranslations();
    const [copied, setCopied] = React.useState(false);
    const copyClickTimeout = React.useRef(0);
    const shareInviteRef = React.useRef<HTMLDivElement>(null);

    const link = `${window.location.origin}${window.location.pathname.replace(
        "meeting",
        "index.html",
    )}?action=join&room=${title}`;

    const onContainerClick: React.MouseEventHandler<HTMLDivElement> = (clickEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        if (!shareInviteRef) {
            return;
        }

        const rect = shareInviteRef.current!.getBoundingClientRect();
        console.log(rect);

        if (
            !isInRect(
                shareInviteRef.current!.getBoundingClientRect(),
                clickEvent.clientX,
                clickEvent.clientY,
            )
        ) {
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

    const renderButton = (backgroundColor: string, child: React.ReactNode, onclick: () => void) => (
        <div className={styles.Button} style={{ backgroundColor }} onClick={onclick}>
            {child}
        </div>
    );

    return (
        <div className={styles.ShareInviteContainer}>
            <div className={styles.ShareInvite} ref={shareInviteRef} onClick={onContainerClick}>
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
                        {renderButton(
                            "#2979FF",
                            <MaterialIcon iconName="content_copy" size={24} color="white" />,
                            onCopyClick,
                        )}
                    </Cell>
                    <Cell gridArea="ShareButtons">
                        <Flex direction="Row">
                            {renderButton(
                                "#2ECF5F",
                                <MaterialIcon iconName="whatsapp" size={24} color="white" />,
                                () => void 0,
                            )}
                            {renderButton(
                                "#D72461",
                                <svg
                                    fill="white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>,
                                () => void 0,
                            )}
                            {renderButton(
                                "#3D58A5",
                                <svg
                                    fill="white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                                </svg>,
                                () => void 0,
                            )}
                            {renderButton(
                                "black",
                                <MaterialIcon iconName="email" size={24} color="white" />,
                                () => void 0,
                            )}
                        </Flex>
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
