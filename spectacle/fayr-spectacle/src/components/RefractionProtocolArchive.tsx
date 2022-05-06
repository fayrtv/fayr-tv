import { Group, Text, Badge, useMantineTheme, Container } from "@mantine/core";
import moment from "moment";
import { Eye } from "tabler-icons-react";
import { RefractionProtocol as RefractionProtocolModel } from "~/models";

type Props = {
    refractionProtocol: RefractionProtocolModel;
};

const BackgroundGrey = "#A8A8A8";

export const RefractionProtocolArchive = ({ refractionProtocol }: Props) => {
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
                    <Badge
                        size="md"
                        color="transparent"
                        radius="xs"
                        style={{ backgroundColor: theme.white }}
                    >
                        ARCHIV
                    </Badge>
                    <Text size="xs" color={theme.white}>
                        {moment(refractionProtocol.date).format("DD.MM.YYYY")}
                    </Text>
                </Group>
            </Group>
        </Container>
    );
};

export default RefractionProtocolArchive;
