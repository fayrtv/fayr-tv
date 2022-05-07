import { Group, Text, Badge, Container } from "~/components/common";
import moment from "moment";
import { Eye } from "tabler-icons-react";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { useMantineTheme } from "@mantine/core";

type Props = {
    protocolHistory: RefractionProtocolEntity[];
};

const BackgroundGrey = "#A8A8A8";

export const RefractionProtocolArchive = ({ protocolHistory }: Props) => {
    const theme = useMantineTheme();

    return (
        <Container size="lg" sx={(_) => ({ padding: "0" })} fluid>
            <Group
                direction="row"
                position="center"
                noWrap
                sx={(_) => ({ backgroundColor: BackgroundGrey, padding: "15px" })}
            >
                <Eye
                    size={40}
                    color={BackgroundGrey}
                    style={{
                        backgroundColor: theme.white,
                        borderRadius: "10px",
                    }}
                />
                <Text color={theme.white} size="xxs">
                    REFRAKTIONSPROTOKOLL
                </Text>
                <Group direction="column" align="end" spacing="xs">
                    {protocolHistory.length && (
                        <>
                            <Badge
                                size="md"
                                color="transparent"
                                radius="xs"
                                style={{ backgroundColor: theme.white }}
                            >
                                ARCHIV
                            </Badge>
                            <Text size="xs" color={theme.white}>
                                {moment(protocolHistory[0].recordedAt).format("DD.MM.YYYY")}
                            </Text>
                        </>
                    )}
                </Group>
            </Group>
        </Container>
    );
};

export default RefractionProtocolArchive;
