import { Button } from "@mantine/core";
import { Sun, SunOff } from "tabler-icons-react";
import { useMantineColorScheme } from "@mantine/core";

const ICON_SIZE = 24;

const ThemeToggleButton = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Button
            onClick={() => toggleColorScheme()}
            variant="light"
            compact
            size="lg"
            leftIcon={
                colorScheme === "dark" ? <Sun size={ICON_SIZE} /> : <SunOff size={ICON_SIZE} />
            }
        >
            {colorScheme === "light" ? "Hell" : "Dunkel"}
        </Button>
    );
};

export default ThemeToggleButton;
