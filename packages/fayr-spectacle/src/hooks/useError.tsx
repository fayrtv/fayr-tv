import React, { useCallback, useState } from "react";
import { Alert } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

type UseError = {
    title: string;
};

export const useError = ({ title }: UseError) => {
    const [error, setError] = useState<string | undefined | null>();

    const renderError = useCallback(
        () =>
            error && (
                <Alert
                    mb="md"
                    // variant="filled"
                    icon={<AlertCircle size={16} />}
                    title={title}
                    color="red"
                    radius="xs"
                >
                    {error}
                </Alert>
            ),
        [error, title],
    );

    return { error, setError, renderError };
};
