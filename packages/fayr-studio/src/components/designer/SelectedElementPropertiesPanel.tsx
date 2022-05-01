import { useEditor } from "@craftjs/core";
import { XCircleIcon } from "@heroicons/react/outline";
import { Box, Button as MaterialButton, Chip, Grid } from "@material-ui/core";
import { ThemeSettingsContainer } from "components/designer/ThemeSettingsContainer";
import React from "react";

export const SelectedElementPropertiesPanel = () => {
    const { actions, selected, isEnabled } = useEditor((state, query) => {
        const currentNodeId = query.getEvent("selected").last();
        let selected;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
                settings:
                    state.nodes[currentNodeId].related &&
                    state.nodes[currentNodeId].related.settings,
                isDeletable: query.node(currentNodeId).isDeletable(),
            };
        }

        return {
            selected,
            isEnabled: state.options.enabled,
        };
    });

    return isEnabled && selected ? (
        <Box bgcolor="rgba(0, 0, 0, 0.06)" mt={2} px={2} py={2}>
            <Grid container direction="column" spacing={0}>
                <Grid item>
                    <Box pb={2}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <XCircleIcon
                                    color="#ffffff"
                                    className="w-6 h-6 hover:cursor-pointer inline-block mr-1"
                                    onClick={() => actions.selectNode(undefined)}
                                />
                                Selected
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    color="primary"
                                    label={selected.name}
                                    data-cy="chip-selected"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <div data-cy="settings-panel">
                    {selected.settings && React.createElement(selected.settings)}
                </div>
                {selected.isDeletable ? (
                    <MaterialButton
                        variant="contained"
                        color="default"
                        onClick={() => {
                            actions.delete(selected.id);
                        }}
                    >
                        Delete
                    </MaterialButton>
                ) : null}
            </Grid>
        </Box>
    ) : (
        <ThemeSettingsContainer />
    );
};
