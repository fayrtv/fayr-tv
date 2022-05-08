import { Button } from "~/components/common";
import { CalendarPlus } from "tabler-icons-react";
import {Group, ThemeIcon} from "@mantine/core";
import { User } from "~/types/user";

type Props = {
    user: User;
};

const SubHeader = ({user}: Props) => {
    return (
        <Group>
            <Button color="secondary">
                <ThemeIcon variant="light" color="lime">
                    <CalendarPlus />
                </ThemeIcon>
                Termin vereinbaren
            </Button>
            Hallo {user.firstName}
        </Group>
    );
};

export default SubHeader;
