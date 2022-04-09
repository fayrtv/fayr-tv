import { Element, useEditor } from "@craftjs/core";
import { QRCode } from "@fayr/ivp-components";
import { Box, Button as MaterialButton, Grid } from "@material-ui/core";
import { Button } from "components/user/Button";
import { Card } from "components/user/Card";
import { Container } from "components/user/Container";
import { Text } from "components/user/Text";
import React from "react";

export const Toolbox = () => {
    const { connectors } = useEditor();

    return (
        <Box>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
            >
                <Box pb={2}>Drag to add</Box>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) =>
                            connectors.create(ref!, <Button text="Click me" size="small" />)
                        }
                        variant="contained"
                        data-cy="toolbox-button"
                    >
                        Button
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) => connectors.create(ref!, <Text text="Hi world" />)}
                        variant="contained"
                        data-cy="toolbox-text"
                    >
                        Text
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) =>
                            connectors.create(
                                ref!,
                                <Element
                                    canvas
                                    is={Container}
                                    padding={20}
                                    background="white"
                                    children={[]}
                                />,
                            )
                        }
                        variant="contained"
                        data-cy="toolbox-container"
                    >
                        Container
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) => connectors.create(ref!, <Card />)}
                        variant="contained"
                        data-cy="toolbox-card"
                    >
                        Card
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) => connectors.create(ref!, <QRCode content="hello world" />)}
                        variant="contained"
                        data-cy="toolbox-card"
                    >
                        QR Code
                    </MaterialButton>
                </Grid>
            </Grid>
        </Box>
    );
};
