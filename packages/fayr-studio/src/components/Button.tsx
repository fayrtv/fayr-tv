import { HTMLProps } from "react";

type Props = Omit<HTMLProps<HTMLButtonElement>, "type">;

export const Button = ({ ...props }: Props) => {
    return <button type="button" {...props} />;
};
