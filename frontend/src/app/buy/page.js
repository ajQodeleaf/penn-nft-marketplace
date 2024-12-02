"use client";
import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";

const BuyPage = () => {
  const [nftId, setNftId] = useState("");
  const [buyerWallet, setBuyerWallet] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      nftId: Number(nftId),
      buyerWallet,
    };

    try {
      const response = await fetch("http://localhost:5000/api/nft/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const transactionHash = data.tx.hash;

        toast({
          title: "Success",
          description: (
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "orange", textDecoration: "underline" }}
            >
              NFT Bought successfully! View transaction
            </a>
          ),
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setNftId("");
        setBuyerWallet("");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to buy NFT.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong while buying the NFT.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="20" p="5" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        Buy NFT
      </Text>
      <FormControl id="nftId" isRequired mb="4">
        <FormLabel>NFT ID</FormLabel>
        <Input
          type="text"
          value={nftId}
          onChange={(e) => setNftId(e.target.value)}
          placeholder="Enter NFT ID"
        />
      </FormControl>
      <FormControl id="buyerWallet" isRequired mb="4">
        <FormLabel>Buyer Wallet Address</FormLabel>
        <Input
          type="text"
          value={buyerWallet}
          onChange={(e) => setBuyerWallet(e.target.value)}
          placeholder="Enter your wallet address"
        />
      </FormControl>
      <Button
        colorScheme="teal"
        width="full"
        isLoading={isSubmitting}
        onClick={handleSubmit}
      >
        Buy NFT
      </Button>
    </Box>
  );
};

export default BuyPage;
