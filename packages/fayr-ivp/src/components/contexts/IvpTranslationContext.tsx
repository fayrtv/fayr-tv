import React from "react";
import { Translations } from "types/translations";

import { createTranslationContext, TranslationContextProvider } from "@fayr/common";

export const IvpTranslationContext = createTranslationContext<Translations>();

export const IvpTranslationContextProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <TranslationContextProvider<Translations>
            initialLanguage="de"
            resourcePathFactory={(lang: string) => `resources/translations/${lang}.json`}
            context={IvpTranslationContext}
        >
            {children}
        </TranslationContextProvider>
    );
};

export default IvpTranslationContextProvider;
