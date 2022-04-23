import { Checkbox, PasswordField, SubmitButton, TextField } from "@fayr/common";
// @ts-ignore
import SignUpFigure from "assets/signup-figure.svg";
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

export default function SignUp({ providers }: Props) {
    const isValid = false;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [receiveUpdates, setReceiveUpdates] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    return (
        <TwoColumnAuthLayout type="signup" picture={<SignUpFigure />}>
            <div className="mt-16 flex flex-col gap-4 text-neutral">
                <h2 className="text-2xl text-primary font-semibold">Welcome to FAYR</h2>
                <p>
                    Join our community and start building your own streaming platform with the same
                    power like Netflix or Twitch
                </p>
                <form className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-5">
                        <TextField
                            placeholder="First name"
                            value={firstName}
                            onChange={setFirstName}
                            isValid={false}
                        />
                        <TextField
                            placeholder="Last name"
                            value={lastName}
                            onChange={setLastName}
                        />
                    </div>
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
                    <PasswordField
                        className="col-span-2"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                    />

                    <label className="flex flex-row items-center gap-3">
                        <Checkbox checked={receiveUpdates} onChange={setReceiveUpdates} />
                        Please send me occasional updates, offers and news about FAYR and its
                        products to my email address
                    </label>

                    <label className="flex flex-row items-center gap-3">
                        <Checkbox checked={termsAccepted} onChange={setTermsAccepted} />I agree to
                        all the Term, Privacy Policy and Fees
                    </label>

                    <SubmitButton
                        value="Create account »"
                        className={classNames("font-bold", {
                            "opacity-50": !isValid,
                            "bg-primary cursor-pointer": isValid,
                        })}
                        disabled={!isValid}
                    />
                </form>

                <div className="mt-8 text-lg">
                    Already have an account?{" "}
                    <A href="/auth/signin" className="text-primary">
                        Sign in
                    </A>
                </div>
            </div>
        </TwoColumnAuthLayout>
    );
}

SignUp.layoutProps = {
    Layout: AuthPageLayout,
};

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};
