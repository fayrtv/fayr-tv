import { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import React, { useState } from "react";
import { PathBasedTabMenu } from "~/components/layout/PathBasedTabMenu";
import EditProfile from "~/components/profile/EditProfile";
import { GetServerSideProps } from "next";
import { RedirectProps, redirectServerSide } from "~/helpers/next-server";
import { getUser } from "~/helpers/authentication";
import { User } from "~/types/user";
import ChangePassword from "~/components/profile/ChangePassword";
import { useMediaQuery } from "@mantine/hooks";
import { MobileWidthThreshold } from "~/constants/mediaqueries";
import { Container } from "@mantine/core";

type ServerProps = { user: User };

const ProfileRouter: NextPageWithLayout<ServerProps> = ({ user }: ServerProps) => {
    const isMobile = useMediaQuery(`(max-width: ${MobileWidthThreshold}px)`, true);

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
                        render: () => <ChangePassword user={user} />,
                    },
                    {
                        title: "Benachrichtigungen",
                        slug: "notifications",
                        render: () => <b>Hello A</b>,
                    },
                ]}
                pathFragmentName="slug"
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
