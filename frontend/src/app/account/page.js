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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched transactions:", data);

          const ownedNFTs = data.map((tx) => ({
            id: tx.nftId?._id || "N/A",
            name: tx.nftId?.name || "Unknown NFT",
            price: tx.nftId?.price?.$numberDecimal || "0.0",
            metadataURI: tx.nftId?.metadataURI || "N/A",
          }));
          console.log("Owned NFTs:- ", ownedNFTs);

          const transactionHistory = data.map((tx) => ({
            id: tx._id || "N/A",
            type:
              parseFloat(tx.value?.$numberDecimal || 0) > 0 ? "Buy" : "Sell",
            date: tx.createdAt
              ? new Date(tx.createdAt).toLocaleDateString()
              : "N/A",
            amount: `${parseFloat(tx.value?.$numberDecimal || 0).toFixed(
              3
            )} ETH`,
          }));
          console.log("Transaction History:- ", transactionHistory);

          setUserData((prev) => ({
            ...prev,
            walletAddress: data[0]?.buyerId?.id || "N/A",
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
        <Avatar name="Cardinal Navigator" size="xl" bg="#19976A" />
        <Text fontSize="sm" fontWeight="medium">
          cardinal.navi@gmail.com
        </Text>
        <Text fontSize="sm" color="gray.500">
          {account?.toString() || "N/A"}
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
