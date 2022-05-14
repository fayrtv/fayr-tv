export type User = {
    email: string;
    emailVerified: boolean;
    address: "m" | "f";
    title?: string;
    firstName: string;
    lastName: string;
    newsletter: boolean;
};

export type Customer = Pick<User, "firstName" | "lastName" | "emailVerified" | "email">;

export const formatFormalAddress = (user: User) => {
    const parts = [user.address === "m" ? "Herr" : "Frau"];

    if (user.title) {
        parts.push(user.title);
    }

    parts.push(user.lastName);

    return parts.join(" ");
};
