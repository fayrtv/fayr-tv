import { FayrLogo } from "@fayr/common";

type Props = {
    headline: string;
};

const BoxedFayrLogo = () => (
    <div className="w-18 h-18 bg-primary grid justify-items-center items-center p-4">
        <FayrLogo className="h-12 w-12" fill="var(--color-background)" />
    </div>
);

export const AuthPageLogoHeadline = ({ headline }: Props) => (
    <div className="flex flex-row gap-8 items-center">
        <BoxedFayrLogo />
        <h1 className="text-primary font-upper text-4xl font-extrabold tracking-wide">
            {headline}
        </h1>
    </div>
);
