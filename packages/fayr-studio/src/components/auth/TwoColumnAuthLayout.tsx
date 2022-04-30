import { AuthPageLogoHeadline } from "components/auth/AuthPageLogoHeadline";
import React from "react";

type Props = React.PropsWithChildren<{
    type: "signin" | "signup";
    picture: JSX.Element;
}>;

export const TwoColumnAuthLayout = ({ picture, type, children }: Props) => (
    <div className="min-h-full min-w-full flex flex-row">
        <div className="min-h-full bg-neutral w-5/12 grid justify-items-center items-center">
            {picture}
        </div>
        <div className="min-h-full bg-background w-7/12 flex flex-col justify-center pt-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <AuthPageLogoHeadline headline={type === "signin" ? "Login" : "Register"} />
                {children}
            </div>
        </div>
    </div>
);
