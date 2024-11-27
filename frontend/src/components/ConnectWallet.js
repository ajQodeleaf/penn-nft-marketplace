"use client";
import { Button, Box } from "@chakra-ui/react";
import { useWallet } from "../context/WalletContext";

const ConnectWallet = () => {
  const { isConnected, connectMetaMask } = useWallet();

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="end"
      justifyContent="center"
      backgroundImage="url('/welcome.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      pb="40px"
    >
      {!isConnected && (
        <Button
          onClick={connectMetaMask}
          color="#1E365D"
          size="lg"
          zIndex={1}
          width="80%"
        >
          Connect to MetaMask
        </Button>
      )}
    </Box>
  );
};

export default ConnectWallet;
