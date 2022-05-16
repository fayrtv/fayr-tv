import { NextPageWithLayout } from "../../types/next-types";
import Layout from "../layout/Layout";
import { Container } from "@mantine/core";
import { Customer } from "../../types/user";
import React from "react";

type Props = {
    customer: Customer;
};

const SpectaclePassOverview: NextPageWithLayout<Props> = ({ customer }: Props) => {
    return <Container></Container>;
};

SpectaclePassOverview.layoutProps = {
    Layout: Layout,
};

export default SpectaclePassOverview;
