import React, { createContext } from "react";

export type Context<TTranslations> = {
    tl: TTranslations;
    setLanguage(language: string): void;
};

export type TypedTranslationContext<TTranslations> = React.Context<Context<TTranslations>>;

export const createTranslationContext = <T extends {}>() =>
    createContext<Context<T>>({
        tl: {} as T,
        setLanguage: (_) => void 0,
    });

export default createTranslationContext;
