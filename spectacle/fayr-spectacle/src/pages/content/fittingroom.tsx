import { Container } from "@mantine/core";
import React from "react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "../../types/next-types";
import styled from "styled-components";

declare global {
    interface Window {
        MINDAR: any;
    }
}

const FittingRoom: NextPageWithLayout = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [runningOnDevice, setRunningOnDevice] = React.useState(false);

    const mindArThreeJs = React.useMemo(() => {
        if (!runningOnDevice) {
            return;
        }

        const mindarThree = new window.MINDAR.FACE.MindARThree({
            container: containerRef.current,
        });

        return mindarThree;
    }, [runningOnDevice]);

    React.useEffect(() => {
        if (!mindArThreeJs) {
            return;
        }
        const { renderer, scene, camera } = mindArThreeJs;
        const three = window.MINDAR.FACE.THREE;
        const anchor = mindArThreeJs.addAnchor(1);
        const geometry = new three.SphereGeometry(0.1, 32, 16);
        const material = new three.MeshBasicMaterial({
            color: "red",
            transparent: true,
            opacity: 0.5,
        });
        const sphere = new three.Mesh(geometry, material);
        anchor.group.add(sphere);

        const start = async () => {
            await mindArThreeJs.start();
            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });
        };
        start();

        return () => mindArThreeJs.stop();
    }, [mindArThreeJs]);

    React.useEffect(() => setRunningOnDevice(true), []);

    return (
        <Container
            ref={containerRef}
            sx={(theme) => ({ height: "500px", width: "800px" })}
            fluid
        ></Container>
    );
};

FittingRoom.layoutProps = {
    Layout: Layout,
};

export default FittingRoom;
