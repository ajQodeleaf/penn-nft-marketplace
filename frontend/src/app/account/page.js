"use client";
import React, { useEffect, useState } from "react";
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
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("https://penn-nft-marketplace.onrender.com/api/transactions");
        const data = await response.json();

        if (response.ok) {
          const ownedNFTs = data.transactions.map((tx) => ({
            id: tx.nft.id,
            name: tx.nft.name,
            description: tx.nft.description,
            metadataURI: tx.nft.metadataURI,
            price: tx.nft.price,
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

  const handleSeeAllClick = (section, data) => {
    router.push(
      `/see-all?section=${encodeURIComponent(
        section
      )}&data=${encodeURIComponent(JSON.stringify(data))}`
    );
  };

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
        <Avatar name={"Cardinal Navigator"} size="xl" bg="#19976A"></Avatar>

        <Text fontSize="sm" fontWeight="medium">
          {"cardinal.navi@gmail.com"}
        </Text>

        <Text fontSize="sm" color="gray.500">
          {account.toString()}
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
