export type User = {
    address: "m" | "f";
    title?: string;
    firstName: string;
    lastName: string;
};
export const formatUserAddress = (user: User) => {
    const parts = [user.address === "m" ? "Herr" : "Frau"];

    if (user.title) {
        parts.push(user.title);
    }

    parts.push(user.lastName);

    return parts.join(" ");
};
