import { Translations } from "types/translations";

import createTranslationContext from "@fayr/shared-components/lib/translations/TranslationContext";
import TranslationContextProvider from "@fayr/shared-components/lib/translations/TranslationContextProvider";

export const IvpTranslationContext = createTranslationContext<Translations>();

export const IvpTranslationContextProvider: React.FC = ({ children }) => {
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
