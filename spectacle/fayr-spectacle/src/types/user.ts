export type User = {
    id: string;
    email: string;
    emailVerified: boolean;
    address: "m" | "f";
    title?: string;
    firstName: string;
    lastName: string;
    newsletter: boolean;
    newsletteremail: string;
    city: string;
    phone: string;
};

export type Customer = { customerID: string } & Pick<
    User,
    "firstName" | "lastName" | "emailVerified" | "email"
>;

export const formatFormalAddress = (user: Pick<User, "address" | "title" | "lastName">) => {
    const parts = [user.address === "m" ? "Herr" : "Frau"];

    if (user.title) {
        parts.push(user.title);
    }

    parts.push(user.lastName);

    return parts.join(" ");
};

export const formatCustomerName = (customer: Customer) => {
    return `${customer.firstName} ${customer.lastName}`;
};
