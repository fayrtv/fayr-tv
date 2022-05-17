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

type ServerProps = { user: User };

const ProfileRouter: NextPageWithLayout<ServerProps> = ({ user }: ServerProps) => {
    return (
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
