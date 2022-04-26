import { useCallback, useEffect, useState } from "react";

/**
 * Validates the given {@link value} using {@link getErrorMessage} to return a
 * `validateOnBlur` function to be used as `onBlur` handler for the input element to run the
 * validation only when the user navigates away.
 * @param value The value to validate
 * @param getErrorMessage A string to indicate an error, or a falsy value for success
 * @param skipValidationWhen A predicate to determine whether to run validation at all
 */
export default <T,>(
    value: T,
    getErrorMessage?: (currentValue: T) => undefined | null | string,
    skipValidationWhen?: (currentValue: T) => boolean,
) => {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isValidated, setValidated] = useState(false);

    const validate = useCallback(() => {
        if (!getErrorMessage) {
            setValidated(false);
            return;
        }

        if (skipValidationWhen?.(value)) {
            setValidated(false);
            return;
        }

        setErrorMessage(getErrorMessage(value));
        setValidated(true);
    }, [setErrorMessage, getErrorMessage, value]);

    useEffect(
        /* on value changed */
        () => {
            if (isValidated) {
                validate();
            }
        },
        [value],
    );

    const validateOnChange = useCallback(() => {
        if (!isValidated) {
            return;
        }
    }, []);

    return {
        validateOnBlur: validate,
        validateOnChange,
        shouldShowValidationResult: isValidated,
        isValid: !errorMessage,
        errorMessage,
    };
};
