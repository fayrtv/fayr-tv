import { Popover, Button, Card, Title, Divider, Group, Stack, Text, Image } from "@mantine/core";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useState, useEffect } from "react";
import { Wallet } from "tabler-icons-react";

import getNetwork, { NetworkInfoType, unknownNetwork } from "../constants/networks";
import { useWeb3Context } from "../context/web3.context";
import { truncateAccount } from "../utils";

const WalletDisplayButton = () => {
    const { account, chainId, active, library } = useWeb3Context();
    const [opened, setOpened] = useState(false);
    const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
    const [network, setNetwork] = useState<NetworkInfoType>(unknownNetwork);

    useEffect(() => {
        if (active && account !== undefined && library !== undefined) {
            library.getBalance(account).then((val) => setBalance(val));
            setNetwork(getNetwork(chainId!));
        } else {
            setBalance(BigNumber.from(0));
            setNetwork(unknownNetwork);
        }
    }, [account, active, chainId, library]);

    return (
        <Popover
            opened={opened}
            onClose={() => setOpened(false)}
            target={
                <Button
                    disabled={!active}
                    variant="subtle"
                    size="xs"
                    onClick={() => setOpened(true)}
                >
                    <Wallet />
                </Button>
            }
            width="500px"
            position="bottom"
            withArrow
            withCloseButton
        >
            {account ? (
                <Group position="apart">
                    <Stack>
                        {/* Network Details */}
                        <Title order={2}>Network</Title>
                        <Text size="xl">{network.chainName}</Text>
                        <Text color="dimmed">Chain ID: {chainId}</Text>

                        {/* Wallet Details */}
                        <Title order={2} mt="md">
                            Wallet ID
                        </Title>
                        <Text>{truncateAccount(account!)}</Text>

                        {/* Balance */}
                        <Title order={2} mt="md">
                            Balance
                        </Title>
                        <Text>{formatEther(balance) + " " + network.nativeCurrency.symbol}</Text>
                    </Stack>
                    <Image
                        src={network.iconURL}
                        alt="network icon"
                        m="md"
                        width={150}
                        height={200}
                        fit="contain"
                    />
                </Group>
            ) : (
                <Title p="lg">Wallet not connected.</Title>
            )}
        </Popover>
    );
};

export default WalletDisplayButton;
