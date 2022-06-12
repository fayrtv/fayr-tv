import { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import React from "react";
import { PathBasedTabMenu } from "~/components/layout/PathBasedTabMenu";
import EditProfile from "~/components/profile/EditProfile";
import { GetServerSideProps } from "next";
import { RedirectProps, redirectServerSide } from "~/helpers/next-server";
import { ssrGetUser } from "~/helpers/authentication";
import { User } from "~/types/user";
import ChangePassword from "~/components/profile/ChangePassword";
import { AspectRatio, Container, Paper, Stack } from "@mantine/core";
import NotificationSettings from "~/components/profile/NotificationSettings";
import { QRCode } from "~/components/QRCode";
import MainContainer from "~/components/layout/MainContainer";

type ServerProps = { user: User };

const ProfileRouter: NextPageWithLayout<ServerProps> = ({ user }: ServerProps) => {
    return (
        <MainContainer>
            <Stack>
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
            </Stack>
        </MainContainer>
    );
};

export const getServerSideProps: GetServerSideProps<ServerProps | RedirectProps> = async ({
    req,
    res,
}) => {
    const user = await ssrGetUser(req);

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
