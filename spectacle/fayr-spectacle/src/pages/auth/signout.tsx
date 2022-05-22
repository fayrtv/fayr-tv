import React, { useEffect, useState } from "react";
import { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";

const SignOutPage: NextPageWithLayout = () => {
    const router = useRouter();

    useEffect(() => {
        Auth.signOut().then(() => {
            router.push("/auth/signin");
        });
    });

    return null;
};

SignOutPage.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
};

export default SignOutPage;
