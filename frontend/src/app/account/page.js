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
    async (data, users) => {
      const user = users.find((user) => user.walletAddress === account);
      if (!user) {
        console.error("User not found with the given wallet address");
        return { ownedNFTs: [], transactionsHistory: [] };
      }

      const ownedNFTs = [];
      const transactionsHistory = [];

      for (let tx of data) {
        const isBuyer = tx.buyerId?.id === user._id;
        const isSeller = tx.sellerId?.id === user._id;

        const transactionType =
          isBuyer && isSeller
            ? "Self-Transaction"
            : isBuyer
            ? "Buy"
            : isSeller
            ? "Sell"
            : "Unknown";

        let nft = tx.nftId || {};

        if (!nft.metadataURI) {
          try {
            const nftResponse = await fetch(`${backendUrl}/nfts/${nft._id}`);
            if (nftResponse.ok) {
              const nftData = await nftResponse.json();
              nft = nftData;
            }
          } catch (err) {
            console.error("Failed to fetch NFT data:", err);
          }
        }

        if (isBuyer) {
          ownedNFTs.push({
            id: nft._id || "N/A",
            name: nft.name || "Unknown NFT",
            price: `${parseFloat(nft.price?.$numberDecimal || 0).toFixed(3)}`,
            metadataURI: nft.metadataURI || "N/A",
            tokenId: nft.tokenId || "N/A",
            description: nft.description || "No description available",
          });
        }

        transactionsHistory.push({
          id: tx._id || "N/A",
          type: transactionType,
          date: tx.createdAt
            ? new Date(tx.createdAt).toLocaleDateString()
            : "N/A",
          amount: `${parseFloat(tx.value?.$numberDecimal || 0).toFixed(3)} ETH`,
        });
      }

      return { ownedNFTs, transactionsHistory };
    },
    [account, backendUrl]
  );

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const usersResponse = await fetch(`${backendUrl}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
      });

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users.");
      }

      const users = await usersResponse.json();

      const response = await fetch(`${backendUrl}/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
      }

      const data = await response.json();

      const { ownedNFTs, transactionsHistory } = await transformTransactions(
        data.transactions,
        users
      );

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
          {userData.transactionsHistory.length > 0 ? (
            userData.transactionsHistory.map((transaction) => (
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
            ))
          ) : (
            <Text>No transactions available.</Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default AccountsPage;
