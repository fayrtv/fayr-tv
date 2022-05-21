import { User } from "~/types/user";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "@mantine/hooks";
import {
    Alert,
    Anchor,
    Button,
    Checkbox,
    LoadingOverlay,
    PasswordInput,
    Select,
    TextInput,
} from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import Link from "next/link";

type ProfileFormData = User & {
    password: string;
    confirmPassword: string;
    termsAndConditions: boolean;
};

type UseProfileForm = {
    initialValues?: Partial<ProfileFormData>;
    onSubmit: (userProfile: ProfileFormData) => Promise<void>;
    errorTitle: string;
    errorToString?: (error: any) => string;
    isEditable?: boolean;
};

export const useProfileForm = ({
    initialValues,
    onSubmit,
    errorToString,
    errorTitle,
    isEditable = true,
}: UseProfileForm) => {
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>();

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
            termsAndConditions: false,
            city: "",
            phone: "",
            ...initialValues,
        } as ProfileFormData,
    });

    const onSubmitWrapped = form.onSubmit(async (userProfile) => {
        try {
            setError(undefined);
            setSubmitting(true);
            await onSubmit(userProfile);
        } catch (error) {
            setError(errorToString ? errorToString(error) : String(error));
        } finally {
            setSubmitting(false);
        }
    });

    const renderError = useCallback(
        () =>
            error && (
                <Alert
                    mb="md"
                    // variant="filled"
                    icon={<AlertCircle size={16} />}
                    title={errorTitle}
                    color="red"
                    radius="xs"
                >
                    {error}
                </Alert>
            ),
        [error, errorTitle],
    );

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

    const renderEmailInput = () => (
        <TextInput required {...disabledProps} label="E-Mail" {...form.getInputProps("email")} />
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

    const renderNewsletterCheckbox = () => (
        <Checkbox
            mt="sm"
            {...disabledProps}
            label="Bitte informieren Sie mich regelmäßig über Angebote und Neuigkeiten per E-Mail."
            {...form.getInputProps("newsletter")}
        />
    );

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

    return {
        isSubmitting,
        onSubmit: onSubmitWrapped,
        renderError,
        renderLoadingOverlay,
        renderAddressSelection,
        renderTitleInput,
        renderFirstNameInput,
        renderLastNameInput,
        renderEmailInput,
        renderPasswordInput,
        renderConfirmPasswordInput,
        renderNewsletterCheckbox,
        renderTermsCheckbox,
        renderCityInput,
        renderPhoneInput,
        renderSubmitButton,
    };
};
