import { Container } from "~/components/common";
import React from "react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Joystick } from "react-joystick-component";
import styles from "./fittingroom.module.scss";
import { Button, Group, Slider } from "@mantine/core";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        MINDAR: any;
    }
}

type SliderMark = {
    value: number;
    label: string;
};

const MARKS: Array<SliderMark> = [
    { value: 0, label: "0" },
    { value: 10, label: "1" },
    { value: 20, label: "2" },
    { value: 30, label: "3" },
    { value: 40, label: "4" },
    { value: 50, label: "5" },
    { value: 60, label: "6" },
    { value: 70, label: "7" },
    { value: 80, label: "8" },
    { value: 90, label: "9" },
    { value: 100, label: "10" },
];

const FittingRoomPage: NextPageWithLayout = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [runningOnDevice, setRunningOnDevice] = React.useState(false);

    const [zSliderValue, setZSliderValue] = React.useState(80);

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
            mindArThree.camera.position.y = -5;
            mindArThree.camera.position.z = zSliderValue;
            mindArThree.camera.position.x = 0;
            renderer.setAnimationLoop(() => cssRenderer.render(cssScene, camera));
        };
        start();

        return () => mindArThree.stop();
    }, [mindArThree]);

    const onJoystickMove = (event: IJoystickUpdateEvent) => {
        // Forward is actually upward, backward is downward
        switch (event.direction) {
            case "BACKWARD":
                mindArThree.camera.position.y += 1;
                break;
            case "FORWARD":
                mindArThree.camera.position.y -= 1;
                break;
            case "LEFT":
                mindArThree.camera.position.x += 1;
                break;
            case "RIGHT":
                mindArThree.camera.position.x -= 1;
                break;
        }
    };

    React.useEffect(() => {
        if (!mindArThree?.camera) {
            return;
        }

        mindArThree.camera.position.z = zSliderValue;
    }, [mindArThree, zSliderValue]);

    React.useEffect(() => setRunningOnDevice(true), []);

    return (
        <>
            <Container
                ref={containerRef}
                sx={(_) => ({ height: "100%", width: "100%", position: "relative" })}
                fluid
            ></Container>

            <div id="ar-div" className={styles.ArDiv}></div>

            <Group
                className={styles.Controls}
                direction="row"
                position="center"
                sx={(_) => ({ width: "100%" })}
            >
                <Joystick
                    size={80}
                    sticky={false}
                    baseColor="grey"
                    stickColor="black"
                    move={onJoystickMove}
                    //stop={handleStop}
                ></Joystick>
                <Slider
                    label={(val) => MARKS.find((mark) => mark.value === val)!.label}
                    value={zSliderValue}
                    onChange={setZSliderValue}
                    step={10}
                    marks={MARKS}
                    styles={{ markLabel: { display: "none" } }}
                    sx={(_) => ({ width: "200px" })}
                />
            </Group>
        </>
    );
};

FittingRoomPage.layoutProps = {
    Layout: Layout,
};

export default FittingRoomPage;
