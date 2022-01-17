// Framework
import React, { useEffect, useState } from "react";

import { TypedTranslationContext } from "./TranslationContext";
import { Language } from "./types";

type LanguageKey = keyof typeof Language;

type Props<T> = {
    initialLanguage?: LanguageKey;
    resourcePathFactory(language: string): string;
    context: TypedTranslationContext<T>;
    children: any;
};

export const TranslationContextProvider = <T extends {}>({
    initialLanguage = "de",
    context,
    resourcePathFactory,
    children,
}: Props<T>) => {
    const [language, setLanguage] = useState<string>(initialLanguage);
    const [translations, setTranslations] = useState<T>({} as T);

    useEffect(() => {
        const fetchTranslations = async () => {
            const response = await fetch(resourcePathFactory(language));
            const parsedJson = await response.json();
            setTranslations(parsedJson as T);
        };

        fetchTranslations();
    }, [language, resourcePathFactory]);

    return (
        <context.Provider
            value={{
                tl: translations,
                setLanguage,
            }}
        >
            {children}
        </context.Provider>
    );
};

export default TranslationContextProvider;
