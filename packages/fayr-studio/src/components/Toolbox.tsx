import { Button } from "./user/Button";
import { Card } from "./user/Card";
import { Container } from "./user/Container";
import { Text } from "./user/Text";
import { useEditor, Element } from "@craftjs/core";
import { Box, Grid, Button as MaterialButton } from "@material-ui/core";
import React from "react";

export const Toolbox = () => {
    const { connectors } = useEditor();

    return (
        <Box px={2} py={2}>
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
            </Grid>
        </Box>
    );
};
