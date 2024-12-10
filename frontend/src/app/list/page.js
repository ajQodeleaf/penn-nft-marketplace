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
import { useConfig } from "../../context/ConfigContext";

const ListPage = () => {
  const { backendUrl } = useConfig();
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
    if (
      !formData.name ||
      !formData.description ||
      !formData.nftContract ||
      !formData.tokenId ||
      !formData.price ||
      !formData.metadataURI
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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

    try {
      const response = await fetch(`${backendUrl}/nft/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (response.ok) {
        const data = responseText ? JSON.parse(responseText) : {};

        if (data.receipt && data.receipt.hash) {
          const transactionHash = data.receipt.hash;

          toast({
            title: "NFT Listed Successfully",
            description: (
              <>
                <span>Your NFT has been listed!</span>
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
            duration: 4000,
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
          throw new Error("Transaction hash is missing from the response.");
        }
      } else {
        console.error("Failed to list NFT:", responseText);
        toast({
          title: "Error",
          description: responseText || "Failed to list NFT.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error occurred while listing NFT:", error);
      toast({
        title: "Error",
        description:
          error.message || "An unexpected error occurred. Please try again.",
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
