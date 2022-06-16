import { NextPageWithLayout } from "~/types/next-types";
import Layout from "../layout/Layout";
import { Container } from "@mantine/core";
import { Customer } from "~/types/user";
import React from "react";

type Props = {
    customer: Customer;
};

const AppointmentsOverview: NextPageWithLayout<Props> = ({ customer }: Props) => {
    return <Container></Container>;
};

AppointmentsOverview.layoutProps = {
    Layout: Layout,
};

export default AppointmentsOverview;
