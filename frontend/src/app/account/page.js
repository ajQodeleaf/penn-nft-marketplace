"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  VStack,
  Divider,
  Heading,
  Grid,
  Spinner,
  Alert,
  AlertIcon,
  Image,
} from "@chakra-ui/react";

const AccountsPage = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    walletAddress: "0x1234...abcd",
    ownedNFTs: [],
    transactionHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions");
        const data = await response.json();

        if (response.ok) {
          const ownedNFTs = data.transactions.map((tx) => ({
            id: tx.nft.id,
            name: tx.nft.name,
            description: tx.nft.description,
            image: tx.nft.metadataURI,
          }));

          const transactionHistory = data.transactions.map((tx) => ({
            id: tx.id,
            type: tx.value > 0 ? "Buy" : "Sell",
            date: new Date(tx.createdAt).toLocaleDateString(),
            amount: `${(parseFloat(tx.value) / 1e18).toFixed(2)} ETH`,
          }));

          setUserData((prev) => ({
            ...prev,
            walletAddress: data.transactions[0]?.buyer.walletAddress || "N/A",
            ownedNFTs,
            transactionHistory,
          }));
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" justifyContent="center" mt={8}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box px={4} pt={4}>
      <Flex align="center" mb={8}>
        <Avatar size="xl" name={userData.name} bg="#19976A" />
        <VStack align="start" ml={4}>
          <Text fontSize="xl" fontWeight="bold">
            {userData.name}
          </Text>
          <Text fontSize="md" color="gray.500">
            {userData.email}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Wallet: {userData.walletAddress}
          </Text>
        </VStack>
      </Flex>

      <Divider mb={8} />

      <Box mb={8}>
        <Heading size="md" mb={4}>
          Owned NFTs
        </Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {userData.ownedNFTs.map((nft) => (
            <Box
              key={nft.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              boxShadow="md"
            >
              <Image
                src={nft.image}
                alt={nft.name}
                borderRadius="8px"
                objectFit="cover"
                width="100%"
              />
              <Text mt={2} fontWeight="bold">
                {nft.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {nft.description}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>

      <Divider mb={8} />

      <Box pb="84px">
        <Heading size="md" mb={4}>
          Transaction History
        </Heading>
        <VStack align="stretch" spacing={4}>
          {userData.transactionHistory.map((transaction) => (
            <Flex
              key={transaction.id}
              justify="space-between"
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
            >
              <Text fontWeight="bold">{transaction.type}</Text>
              <Text>{transaction.date}</Text>
              <Text color="green.500">{transaction.amount}</Text>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default AccountsPage;
