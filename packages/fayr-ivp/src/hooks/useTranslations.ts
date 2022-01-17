// Framework
import { useContext } from "react";

import { IvpTranslationContext } from "components/contexts/IvpTranslationContext";

export default function useTranslations() {
    return useContext(IvpTranslationContext).tl;
}
