import { Container, Grid, Group, Slider, ThemeIcon } from "@mantine/core";
import React from "react";
import Layout from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import styles from "src/pages/fittingroom.module.scss";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "tabler-icons-react";

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
    { value: 5, label: "1" },
    { value: 10, label: "2" },
    { value: 15, label: "3" },
    { value: 20, label: "4" },
    { value: 25, label: "5" },
    { value: 30, label: "6" },
    { value: 35, label: "7" },
    { value: 40, label: "8" },
    { value: 45, label: "9" },
    { value: 50, label: "10" },
    { value: 55, label: "11" },
    { value: 60, label: "12" },
    { value: 65, label: "13" },
    { value: 70, label: "14" },
    { value: 75, label: "15" },
    { value: 80, label: "16" },
    { value: 85, label: "17" },
    { value: 90, label: "18" },
    { value: 95, label: "19" },
    { value: 100, label: "20" },
];

enum Direction {
    Up,
    Down,
    Left,
    Right,
}

const FittingRoomPage: NextPageWithLayout = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [isRunningOnDevice, setRunningOnDevice] = React.useState(false);

    const [zSliderValue, setZSliderValue] = React.useState(80);

    const mindArThree = React.useMemo(() => {
        if (!isRunningOnDevice) {
            return;
        }

        return new window.MINDAR.FACE.MindARThree({
            container: containerRef.current,
        });
    }, [isRunningOnDevice]);

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

        return () => {
            try {
                return mindArThree.stop();
            } catch (err) {}
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mindArThree]);

    const moveCamera = (direction: Direction) => {
        switch (direction) {
            case Direction.Down:
                mindArThree.camera.position.y += 1;
                break;
            case Direction.Up:
                mindArThree.camera.position.y -= 1;
                break;
            case Direction.Left:
                mindArThree.camera.position.x += 1;
                break;
            case Direction.Right:
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
                <Grid columns={3} sx={(_) => ({ height: "100px", width: "100px" })} gutter={0}>
                    <Grid.Col span={1} offset={1}>
                        <ThemeIcon
                            onClick={() => moveCamera(Direction.Up)}
                            sx={(_) => ({ cursor: "pointer" })}
                        >
                            <ArrowUp />
                        </ThemeIcon>
                    </Grid.Col>
                    <Grid.Col span={2} offset={0}>
                        <ThemeIcon
                            onClick={() => moveCamera(Direction.Left)}
                            sx={(_) => ({ cursor: "pointer" })}
                        >
                            <ArrowLeft />
                        </ThemeIcon>
                    </Grid.Col>
                    <Grid.Col span={1} offset={0}>
                        <ThemeIcon
                            onClick={() => moveCamera(Direction.Right)}
                            sx={(_) => ({ cursor: "pointer" })}
                        >
                            <ArrowRight />
                        </ThemeIcon>
                    </Grid.Col>
                    <Grid.Col span={1} offset={1}>
                        <ThemeIcon
                            onClick={() => moveCamera(Direction.Down)}
                            sx={(_) => ({ cursor: "pointer" })}
                        >
                            <ArrowDown />
                        </ThemeIcon>
                    </Grid.Col>
                </Grid>
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
