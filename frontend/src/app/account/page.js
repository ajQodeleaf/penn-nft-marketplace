"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import SectionHeader from "../../components/SectionHeader";
import HorizontalList from "../../components/HorizontalList";
import { useWallet } from "../../context/WalletContext";
import { useConfig } from "../../context/ConfigContext";

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
  const { account } = useWallet();
  const { backendUrl } = useConfig();
  const router = useRouter();

  const transformTransactions = useCallback(
    (data) => {
      const filteredTransactions = data.filter(
        (tx) => tx.buyerId?.id === account || tx.sellerId?.id === account
      );

      const ownedNFTs = filteredTransactions.map((tx) => ({
        id: tx.nftId?._id || "N/A",
        name: tx.nftId?.name || "Unknown NFT",
        price: tx.nftId?.price?.$numberDecimal || "0.0",
        metadataURI: tx.nftId?.metadataURI || "N/A",
      }));
      console.log("Owned NFTs:- ", ownedNFTs);

      const transactionsHistory = filteredTransactions.map((tx) => ({
        id: tx._id || "N/A",
        type: parseFloat(tx.value?.$numberDecimal || 0) > 0 ? "Buy" : "Sell",
        date: tx.createdAt
          ? new Date(tx.createdAt).toLocaleDateString()
          : "N/A",
        amount: `${parseFloat(tx.value?.$numberDecimal || 0).toFixed(3)} ETH`,
      }));
      console.log("Transactions History:- ", transactionsHistory);

      return { ownedNFTs, transactionsHistory };
    },
    [account]
  );

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${backendUrl}/transactions`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
      }

      const data = await response.json();
      console.log("Fetched transactions:", data);

      const { ownedNFTs, transactionsHistory } = transformTransactions(data);

      setUserData((prev) => ({
        ...prev,
        walletAddress: account || "N/A",
        ownedNFTs,
        transactionsHistory,
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, account, transformTransactions]);

  useEffect(() => {
    if (account) {
      fetchUserData();
    } else {
      setError("Wallet not connected.");
      setLoading(false);
    }
  }, [account, fetchUserData]);

  const handleSeeAllClick = (section, data) => {
    router.push(
      `/see-all?section=${encodeURIComponent(
        section
      )}&data=${encodeURIComponent(JSON.stringify(data))}`
    );
  };

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
    <Box bg="#FAFAFA" pb="82px" pt="28px" px="20px">
      <Box
        p={4}
        borderRadius="md"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Avatar name="Cardinal Navigator" size="xl" bg="#19976A" />
        <Text fontSize="sm" fontWeight="medium">
          {userData.email || "cardinal.navi@gmail.com"}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {userData.walletAddress}
        </Text>
      </Box>

      <Box mt="20px" mb="4px">
        <SectionHeader
          sectionHeaderTitle="Owned NFTs"
          rightComponent={
            <Button
              variant="link"
              fontSize="14px"
              fontWeight="600"
              color="#19976A"
              lineHeight="16.8px"
              _hover={{ textDecoration: "underline" }}
              onClick={() =>
                handleSeeAllClick("Owned NFTs", userData.ownedNFTs)
              }
            >
              See All
            </Button>
          }
        />
        <HorizontalList items={userData.ownedNFTs} />
      </Box>

      <Box mt="20px" mb="4px">
        <SectionHeader sectionHeaderTitle="Transaction History" />
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
