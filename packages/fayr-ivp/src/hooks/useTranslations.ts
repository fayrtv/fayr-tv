// Framework
import { useContext } from "react";

import { IvpTranslationContext } from "components/contexts/IvpTranslationContext";

export default function () {
    return useContext(IvpTranslationContext).tl;
}
