"use client";
import { Button, Box } from "@chakra-ui/react";
import { useWallet } from "../context/WalletContext";

const ConnectWallet = () => {
  const { isConnected, account, connectMetaMask } = useWallet();

  return (
    <Box textAlign="center" p={5}>
      {isConnected ? (
        <Box>Connected as: {account}</Box>
      ) : (
        <Button onClick={connectMetaMask} colorScheme="teal" size="lg">
          Connect to MetaMask
        </Button>
      )}
    </Box>
  );
};

export default ConnectWallet;
