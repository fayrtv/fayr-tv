import React from "react";
import { withRouter } from "react-router-dom";

import styles from "components/chimeWeb/JoinInfoForm.module.scss";

import ImprintFooter from "./ImprintFooter";
import Rating from "./Rating/Rating";

const End = () => {
    return (
        <div className="welcome form-grid">
            <div className="welcome__intro">
                <div className="intro__inner formatted-text">
                    <h1>Danke für deine Unterstützung!</h1>
                    <Rating />
                </div>
            </div>

            <div className="welcome__content pd-4">
                <div className="content__inner">
                    <div className={styles.BannerStripe}>
                        {/* <a href="./"> */}
                            <img
                                src={require("../../assets/vfb-logo.png")}
                                alt="VfB Banner"
                                className={styles.Banner}
                            />
                        {/* </a> */}
                    </div>
                    <div className={styles.JoinInfoFormControls}>
                        <div className={styles.NewsletterBox}>
                            <p>
                                Möchtest du weiterhin über Projekte des VfB Stuttgart informiert
                                werden? Abonniere jetzt den Newsletter!
                            </p>
                            <a
                                href="https://cloud.1893news.vfb.de/newsletter-registrierung"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <button
                                    className="btn btn--secondary"
                                    style={{ width: "100%", display: "block" }}
                                >
                                    Newsletter abonnieren
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <ImprintFooter />
        </div>
    );
};

export default withRouter(End);
