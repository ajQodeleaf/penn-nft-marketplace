"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";

const ListPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    nftContract: "",
    tokenId: "",
    price: "",
    metadataURI: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      nftContract: formData.nftContract,
      tokenId: Number(formData.tokenId),
      price: formData.price,
      metadataURI: formData.metadataURI,
      description: formData.description,
      name: formData.name,
      isVerified: true,
    };

    console.log(`Backend/Fetch URL:- ${process.env.NEXT_BACKEND_URL}/nft/list`)

    try {
      const response = await fetch(`${process.env.NEXT_BACKEND_URL}/nft/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.receipt && data.receipt.hash) {
          const transactionHash = data.receipt.hash;

          toast({
            title: "Success",
            description: (
              <>
                <span>NFT listed successfully!</span>
                <br />
                <a
                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "orange", textDecoration: "underline" }}
                >
                  View Transaction
                </a>
              </>
            ),
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          setFormData({
            name: "",
            description: "",
            nftContract: "",
            tokenId: "",
            price: "",
            metadataURI: "",
          });
        } else {
          throw new Error("Transaction hash is missing.");
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to list NFT.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Something went wrong while listing the NFT.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      px={6}
      py={4}
      maxWidth="500px"
      mx="auto"
      borderWidth={1}
      borderRadius="lg"
      pb="82px"
    >
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          List NFT
        </Text>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            placeholder="Enter NFT name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="description" isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            placeholder="Enter NFT description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="nftContract" isRequired>
          <FormLabel>NFT Contract Address</FormLabel>
          <Input
            name="nftContract"
            placeholder="Enter NFT contract address"
            value={formData.nftContract}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="tokenId" isRequired>
          <FormLabel>Token ID</FormLabel>
          <Input
            name="tokenId"
            type="number"
            placeholder="Enter Token ID"
            value={formData.tokenId}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="price" isRequired>
          <FormLabel>Price</FormLabel>
          <Input
            name="price"
            type="number"
            placeholder="Enter NFT price (in ETH)"
            value={formData.price}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="metadataURI" isRequired>
          <FormLabel>Metadata URI</FormLabel>
          <Input
            name="metadataURI"
            placeholder="Enter metadata URI"
            value={formData.metadataURI}
            onChange={handleChange}
          />
        </FormControl>

        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          width="full"
        >
          List NFT
        </Button>
      </VStack>
    </Box>
  );
};

export default ListPage;
