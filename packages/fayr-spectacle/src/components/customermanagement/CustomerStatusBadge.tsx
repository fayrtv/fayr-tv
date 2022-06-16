import { Customer } from "~/types/user";
import { Badge } from "@mantine/core";
import * as React from "react";

export const CustomerStatusBadge = ({customer}: { customer: Pick<Customer, "emailVerified"> }) => {
    return (
        <Badge size="lg" color="transparent" radius="xs">
            {customer.emailVerified ? "Aktiv" : "Inaktiv"}
        </Badge>
    );
};
