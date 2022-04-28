import {
    Checkbox,
    isFalsyOrWhitespace,
    PasswordField,
    SubmitButton,
    TextField,
} from "@fayr/common";
// @ts-ignore
import SignInFigure from "assets/signin-figure.svg";
import classNames from "classnames";
import { A } from "components/A";
import { TwoColumnAuthLayout } from "components/auth/TwoColumnAuthLayout";
import AuthPageLayout from "components/layout/AuthPageLayout";
import { GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";
import { ClientSafeProvider } from "next-auth/react/types";
import React, { useState } from "react";

type ServerProps = {
    providers: ClientSafeProvider[];
};

type Props = ServerProps;

export default function SignIn({ providers }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const isValid = React.useMemo(
        () => !isFalsyOrWhitespace(email) && !isFalsyOrWhitespace(password),
        [email, password],
    );

    return (
        <TwoColumnAuthLayout type="signin" picture={<SignInFigure />}>
            <div className="mt-16 flex flex-col gap-4 text-neutral">
                <h2 className="text-2xl text-primary font-semibold">Welcome to FAYR</h2>
                <p>
                    Thank you for get back to FAYR, lets build your own video communication
                    platform.
                </p>
                <form className="flex flex-col gap-5">
                    <TextField
                        className="col-span-2"
                        placeholder="Email"
                        value={email}
                        onChange={setEmail}
                    />
                    <PasswordField
                        className="col-span-2"
                        placeholder="Password"
                        value={password}
                        onChange={setPassword}
                    />

                    <div className="grid grid-cols-2 gap-5 justify-between">
                        <label className="flex flex-row items-center gap-3">
                            <Checkbox checked={rememberMe} onChange={setRememberMe} />
                            Remember me
                        </label>
                        <A href="/auth/reset-password" className="text-primary text-right">
                            Forgot your password?
                        </A>
                    </div>

                    <SubmitButton
                        value="Sign in »"
                        className={classNames("font-bold", {
                            "opacity-50": !isValid,
                            "bg-primary cursor-pointer": isValid,
                        })}
                        disabled={!isValid}
                    />
                </form>

                <div className="mt-8 text-lg">
                    Don't have an account yet?{" "}
                    <A href="/auth/signup" className="text-primary">
                        Register here
                    </A>
                </div>
            </div>
        </TwoColumnAuthLayout>
    );
}

SignIn.layoutProps = {
    Layout: AuthPageLayout,
};

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};
