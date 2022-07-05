import * as React from "react";

import { Cell, Flex, Grid } from "@fayr/common";

import styles from "./Tutorial.module.scss";

type InfoRowProps = {
    index: number;
    infoText: React.ReactNode;
};

const InfoRow = ({ index, infoText }: InfoRowProps) => {
    return (
        <>
            <Cell gridArea={`IndexBubble${index}`} className={styles.IndexButtonContainer}>
                <div className={styles.IndexButton}>
                    <span>{index}</span>
                </div>
            </Cell>
            <Cell gridArea={`Info${index}`} className={styles.InfoTextContainer}>
                {infoText}
            </Cell>
        </>
    );
};

type Props = {
    onClose(): void;
};

export default function Tutorial({ onClose }: Props) {
    return (
        <Grid
            className={styles.TutorialContainer}
            gridProperties={{
                gridTemplateAreas: `
					'. . CloseButton'
					'TutorialTitle TutorialTitle TutorialTitle'
					'IndexBubble1 Info1 Info1'
					'IndexBubble2 Info2 Info2'
					'IndexBubble3 Info3 Info3'
					'IndexBubble4 Info4 Info4'
					'PreferDesktopNotice PreferDesktopNotice PreferDesktopNotice'
				`,
                gap: "0",
                gridTemplateColumns: "20% 60% 20%",
                gridTemplateRows: "5% 5% 17.5% 17.5% 17.5% 17.5% 20%",
            }}
        >
            <Cell gridArea="CloseButton">
                <div className={styles.CloseButton} onClick={onClose}>
                    <span>Schließen</span>
                </div>
            </Cell>
            <Cell gridArea="TutorialTitle">
                <h2>Anleitung</h2>
            </Cell>
            <InfoRow
                index={1}
                infoText={
                    <span>
                        Öffne einen Raum für deine Mannschaft. (Du kannst max. 10 weitere Personen
                        einladen.)
                    </span>
                }
            />
            <InfoRow
                index={2}
                infoText={
                    <span>
                        Wähle Mikrofon, Lautsprecher und Kamera aus und berechtige den Zugriff
                        drauf.
                    </span>
                }
            />
            <InfoRow
                index={3}
                infoText={
                    <div className={styles.ShareWithIconText}>
                        <span>Teile über das Icon</span>
                        <span className={styles.TogetherIcon}>
                            <svg
                                fill="white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 30 30"
                                width="20px"
                                height="20px"
                            >
                                <path d="M 20.558594 3 C 19.195594 3 18.147281 3.3425313 17.738281 4.0195312 C 16.209281 4.1705312 15.495656 5.3158281 15.222656 6.6738281 C 16.004656 8.6948281 15.986328 11.276391 15.986328 12.525391 C 15.986328 12.753391 16.048906 13.765828 16.128906 14.048828 C 16.208906 14.751828 16.683297 15.563062 17.154297 16.164062 C 18.727297 14.818062 20.767 14 23 14 C 23.631 14 24.246797 14.065453 24.841797 14.189453 C 24.850797 14.142453 24.866094 14.093875 24.871094 14.046875 C 25.225094 14.019875 25.781312 13.695109 25.945312 12.412109 C 26.033313 11.724109 25.684656 11.336844 25.472656 11.214844 C 26.566656 6.8738437 26.009594 3.094 20.558594 3 z M 7.8769531 4 C 0.000953125 4 3.5545781 15.892453 1.5175781 17.564453 C 1.5175781 17.564453 2.361 19.005859 6 19.005859 L 6 20.292969 C 5 22.999969 0 22 0 27 L 14.947266 27 C 14.368266 25.837 14.030812 24.535297 14.007812 23.154297 C 12.493813 22.189297 10.579 21.858969 10 20.292969 L 10 19.017578 C 13.621 19.017578 14.626953 17.527344 14.626953 17.527344 C 12.734953 15.953344 16.311141 5 9.8691406 5 C 9.8691406 5 9.0009531 4 7.8769531 4 z M 23 16 C 19.134 16 16 19.134 16 23 C 16 26.866 19.134 30 23 30 C 26.866 30 30 26.866 30 23 C 30 19.134 26.866 16 23 16 z M 23 19 C 23.552 19 24 19.447 24 20 L 24 22 L 26 22 C 26.552 22 27 22.447 27 23 C 27 23.553 26.552 24 26 24 L 24 24 L 24 26 C 24 26.553 23.552 27 23 27 C 22.448 27 22 26.553 22 26 L 22 24 L 20 24 C 19.448 24 19 23.553 19 23 C 19 22.447 19.448 22 20 22 L 22 22 L 22 20 C 22 19.447 22.448 19 23 19 z" />
                            </svg>
                        </span>
                        <span>den Link zur Watch Party mit bis zu 10 Freunden.</span>
                    </div>
                }
            />
            <InfoRow
                index={4}
                infoText={
                    <span>
                        Lasst euch vom VfB begeistern und schaut das Spiel mit euren Freunden als
                        wenn ihr nebeneinander auf dem Sofa seid.
                    </span>
                }
            />
            <Cell gridArea="PreferDesktopNotice" className={styles.PreferDesktopNoticeContainer}>
                <div className={styles.PreferDesktopNotice}>
                    <Flex direction="Row" crossAlign="Center" space="Around">
                        <div className={styles.ActionDot}>!</div>
                        <span>
                            Für ein einwandfreies Erlebnis empfehlen wir dir die Verwendung auf
                            einem <u>PC</u> mit Mikrofon und Webcam. Sorge am besten für eine{" "}
                            <u>stabile Internetverbindung</u>.
                        </span>
                    </Flex>
                </div>
            </Cell>
        </Grid>
    );
}
