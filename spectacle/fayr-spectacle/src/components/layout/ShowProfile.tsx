import { formatFormalAddress, User } from "~/types/user";
import Link from "next/link";
import { ActionIcon, Anchor, Avatar, Group, MediaQuery, Text } from "@mantine/core";

export function ShowProfile({
    user,
    shouldLink = true,
}: {
    user?: Pick<User, "address" | "title" | "lastName">;
    shouldLink?: boolean;
}) {
    const children = (
        <Anchor>
            <Group position="right" direction="row" noWrap>
                {!!user && (
                    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                        <Text weight="bold" size="sm">
                            Willkommen, {formatFormalAddress(user)}
                        </Text>
                    </MediaQuery>
                )}
                <ActionIcon variant="outline" color="primary">
                    <Avatar color="primary" size="sm" />
                </ActionIcon>
            </Group>
        </Anchor>
    );

    return shouldLink ? (
        <Link href="/profile" passHref>
            {children}
        </Link>
    ) : (
        children
    );
}
