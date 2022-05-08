import { Container } from "~/components/common";
import React from "react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

import styles from "./fittingroom.module.scss";

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        MINDAR: any;
    }
}

const FittingRoom: NextPageWithLayout = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [runningOnDevice, setRunningOnDevice] = React.useState(false);

    const mindArThree = React.useMemo(() => {
        if (!runningOnDevice) {
            return;
        }

        return new window.MINDAR.FACE.MindARThree({
            container: containerRef.current,
        });
    }, [runningOnDevice]);

    React.useEffect(() => {
        if (!mindArThree) {
            return;
        }

        const { renderer, cssRenderer, cssScene, camera } = mindArThree;

        const obj = new CSS3DObject(document.querySelector("#ar-div")!);
        const cssAnchor = mindArThree.addCSSAnchor(1);
        cssAnchor.group.add(obj);

        const start = async () => {
            await mindArThree.start();
            // Overwrite weird internal styling computations
            mindArThree.camera.position.x = -1;
            mindArThree.camera.position.y = -6;
            renderer.setAnimationLoop(() => cssRenderer.render(cssScene, camera));
        };
        start();

        return () => mindArThree.stop();
    }, [mindArThree]);

    React.useEffect(() => setRunningOnDevice(true), []);

    return (
        <>
            <Container
                ref={containerRef}
                sx={(theme) => ({ height: "100%", width: "100%", position: "relative" })}
                fluid
            ></Container>

            <div id="ar-div" className={styles.ArDiv}></div>
        </>
    );
};

FittingRoom.layoutProps = {
    Layout: Layout,
};

export default FittingRoom;
