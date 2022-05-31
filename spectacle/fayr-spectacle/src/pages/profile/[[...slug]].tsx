import { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import React from "react";
import { PathBasedTabMenu } from "~/components/layout/PathBasedTabMenu";
import EditProfile from "~/components/profile/EditProfile";
import { GetServerSideProps } from "next";
import { RedirectProps, redirectServerSide } from "~/helpers/next-server";
import { getUser } from "~/helpers/authentication";
import { User } from "~/types/user";
import ChangePassword from "~/components/profile/ChangePassword";
import { Container } from "@mantine/core";
import useIsMobile from "~/hooks/useIsMobile";
import NotificationSettings from "~/components/profile/NotificationSettings";

type ServerProps = { user: User };

const ProfileRouter: NextPageWithLayout<ServerProps> = ({ user }: ServerProps) => {
    const isMobile = useIsMobile();

    return (
        <Container
            size="lg"
            sx={{
                padding: isMobile ? "10px" : "50px",
                maxWidth: "100%",
                width: "100%",
            }}
        >
            <PathBasedTabMenu
                tabs={[
                    {
                        title: "Profil bearbeiten",
                        slug: "edit",
                        render: () => <EditProfile user={user} />,
                    },
                    {
                        title: "Passwort ändern",
                        slug: "password",
                        render: () => <ChangePassword />,
                    },
                    {
                        title: "Benachrichtigungen",
                        slug: "notifications",
                        render: () => <NotificationSettings user={user} />,
                    },
                ]}
                pathFragmentName="slug"
                renderTitles={true}
            />
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps<ServerProps | RedirectProps> = async ({
    req,
    res,
}) => {
    const user = await getUser(req);

    if (!user) {
        return redirectServerSide(res, "/auth/login");
    }

    return {
        props: {
            user,
        },
    };
};

ProfileRouter.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
};

export default ProfileRouter;
