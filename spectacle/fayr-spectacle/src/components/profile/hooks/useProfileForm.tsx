import { User } from "~/types/user";
import React, { useCallback, useMemo, useState } from "react";
import { FormRules, useForm } from "@mantine/form";
import {
    Anchor,
    Button,
    Checkbox,
    LoadingOverlay,
    PasswordInput,
    Select,
    TextInput,
} from "@mantine/core";
import Link from "next/link";
import { useError } from "~/hooks/useError";

export type ProfileFormData = User & {
    password: string;
    confirmPassword: string;
    termsAndConditions: boolean;
    confirmationCode: string;
};

type UseProfileForm = {
    initialValues?: Partial<ProfileFormData>;
    onSubmit: (
        userProfile: ProfileFormData,
        setError: (errorMessage: string) => void,
    ) => Promise<void>;
    errorTitle: string;
    errorToString?: (error: any) => string;
    isEditable?: boolean;
    validate?: FormRules<ProfileFormData>;
};

export const useProfileForm = ({
    initialValues,
    onSubmit,
    errorToString,
    errorTitle,
    validate = {},
    isEditable = true,
}: UseProfileForm) => {
    const [isSubmitting, setSubmitting] = useState(false);
    const { error, setError, renderError } = useError({ title: errorTitle });

    const disabledProps = useMemo(
        () => ({
            disabled: !isEditable,
            // variant: (isEditable ? "default" : "filled") as InputVariant,
        }),
        [isEditable],
    );

    const form = useForm({
        initialValues: {
            address: "",
            title: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            newsletter: false,
            newsletteremail: "",
            termsAndConditions: false,
            city: "",
            phone: "",
            confirmationCode: "",
            ...initialValues,
        } as ProfileFormData,
        validate,
    });

    const onSubmitWrapped = form.onSubmit(async (userProfile) => {
        try {
            setError(undefined);
            setSubmitting(true);
            await onSubmit(userProfile, setError);
        } catch (error) {
            setError(errorToString ? errorToString(error) : String(error));
        } finally {
            setSubmitting(false);
        }
    });

    const renderLoadingOverlay = () => <LoadingOverlay visible={isSubmitting} />;

    const renderAddressSelection = () => (
        <Select
            data={[
                { label: "Herr", value: "m" },
                { label: "Frau", value: "f" },
            ]}
            label="Anrede"
            placeholder="Herr / Frau"
            required
            {...disabledProps}
            {...form.getInputProps("address")}
        />
    );

    const renderTitleInput = () => (
        <TextInput label="Titel" {...disabledProps} {...form.getInputProps("title")} />
    );

    const renderFirstNameInput = () => (
        <TextInput
            required
            {...disabledProps}
            label="Vorname"
            {...form.getInputProps("firstName")}
        />
    );

    const renderLastNameInput = () => (
        <TextInput
            required
            {...disabledProps}
            label="Nachname"
            {...form.getInputProps("lastName")}
        />
    );

    const renderConfirmationCodeInput = () => (
        <TextInput
            required
            {...disabledProps}
            label="Code"
            placeholder="Code"
            {...form.getInputProps("confirmationCode")}
        />
    );

    const renderEmailInput = () => (
        <TextInput required {...disabledProps} label="E-Mail" {...form.getInputProps("email")} />
    );

    const renderNewsletterEmailInput = () => (
        <TextInput
            {...disabledProps}
            label="E-Mail-Addresse für Benachrichtigungen"
            {...form.getInputProps("newsletteremail")}
        />
    );

    const renderPasswordInput = (label?: string) => (
        <PasswordInput
            required
            {...disabledProps}
            label={label ?? "Passwort"}
            placeholder="Passwort"
            {...form.getInputProps("password")}
        />
    );

    const renderConfirmPasswordInput = () => (
        <PasswordInput
            required
            {...disabledProps}
            label="Passwort wiederholen"
            placeholder="erneut eingeben"
            {...form.getInputProps("confirmPassword")}
        />
    );

    const renderNewsletterCheckbox = () => {
        const checkState: boolean = form.getInputProps("newsletter").value;
        return (
            <Checkbox
                mt="sm"
                {...disabledProps}
                label="Bitte informieren Sie mich regelmäßig über Angebote und Neuigkeiten per E-Mail."
                checked={checkState}
                {...form.getInputProps("newsletter")}
            />
        );
    };

    const renderTermsCheckbox = useCallback(
        () => (
            <Checkbox
                mt="sm"
                {...disabledProps}
                label={
                    <>
                        Ich akzeptiere die{" "}
                        <Link href="/legal/terms" passHref>
                            <Anchor size="sm" target="__blank">
                                Allgemeinen Geschäftsbedingungen
                            </Anchor>
                        </Link>{" "}
                        und die{" "}
                        <Link href="/legal/data-protection" passHref>
                            <Anchor size="sm" target="__blank">
                                Bestimmungen zum Datenschutz
                            </Anchor>
                        </Link>
                    </>
                }
                required
                {...form.getInputProps("termsAndConditions")}
            />
        ),
        [disabledProps, form],
    );

    const renderCityInput = () => (
        <TextInput {...disabledProps} label="Stadt" {...form.getInputProps("city")} />
    );

    const renderPhoneInput = () => (
        <TextInput {...disabledProps} label="Telefon" {...form.getInputProps("phone")} />
    );

    const renderSubmitButton = (caption: string) => (
        <Button disabled={!isEditable} type="submit">
            {caption}
        </Button>
    );

    const profileComponents = {
        renderError,
        renderLoadingOverlay,
        renderAddressSelection,
        renderConfirmationCodeInput,
        renderTitleInput,
        renderFirstNameInput,
        renderLastNameInput,
        renderEmailInput,
        renderNewsletterEmailInput,
        renderPasswordInput,
        renderConfirmPasswordInput,
        renderNewsletterCheckbox,
        renderTermsCheckbox,
        renderCityInput,
        renderPhoneInput,
        renderSubmitButton,
    };
    return {
        isSubmitting,
        onSubmit: onSubmitWrapped,
        profileComponents,
    };
};
