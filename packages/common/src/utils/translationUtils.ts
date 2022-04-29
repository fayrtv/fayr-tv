export const format = (translation: string, ...replacements: Array<string>) => {
    for (let i = 0; i < replacements.length; ++i) {
        translation = translation.replace(`{{${i}}}`, replacements[i]);
    }

    return translation;
};
