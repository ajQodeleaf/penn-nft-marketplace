"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  HStack,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Image,
} from "@chakra-ui/react";
import SectionHeader from "../../components/SectionHeader";

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
    <Box bg="#FAFAFA" pb="82px" pt="28px" px="20px">
      <Box
        p={4}
        borderRadius="md"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Avatar name={"Aradhya Jain"} size="xl" bg="#19976A"></Avatar>

        <Text fontSize="sm" fontWeight="medium">
          {"ajain@qodeleaf.com"}
        </Text>

        <Text fontSize="sm" color="gray.500">
          {"0x52B2c1fD38dFf711ED203898B53012e859318D30"}
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
              onClick={() => console.log("See All clicked")}
            >
              See All
            </Button>
          }
        />
        <HStack
          overflowX="auto"
          spacing={4}
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {userData.ownedNFTs.map((nft) => (
            <Box
              key={nft.id}
              borderRadius="2xl"
              overflow="hidden"
              p={4}
              m={2}
              boxShadow="md"
              minWidth="200px"
              height="300px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box
                height="180px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg="gray.100"
                borderRadius="8px"
              >
                {nft.image ? (
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    borderRadius="8px"
                    objectFit="cover"
                    height="100%"
                    width="100%"
                  />
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    No Image Available
                  </Text>
                )}
              </Box>
              <Box mt={2}>
                <Text fontWeight="bold">{nft.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {nft.description}
                </Text>
              </Box>
            </Box>
          ))}
        </HStack>
      </Box>
      <Box mt="20px" mb="4px">
        <SectionHeader
          sectionHeaderTitle="Transaction History"
          rightComponent={
            <Button
              variant="link"
              fontSize="14px"
              fontWeight="600"
              color="#19976A"
              lineHeight="16.8px"
              _hover={{ textDecoration: "underline" }}
              onClick={() => console.log("See All clicked")}
            >
              See All
            </Button>
          }
        />
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
