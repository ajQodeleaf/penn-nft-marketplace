"use client";
import { useEffect, useState } from "react";
import { Box, Text, Image, Flex, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { FiImage } from "react-icons/fi";

const NFTDetails = () => {
  const [item, setItem] = useState(null);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedItem = localStorage.getItem("selectedNFT");
    if (storedItem) {
      setItem(JSON.parse(storedItem));
    }
  }, []);

  if (!item) {
    return <Text>Loading...</Text>;
  }

  const priceInEther = (parseFloat(item.price) / 1e18).toFixed(2);

  return (
    <Box p={6}>
      <Flex alignItems="center" mb="20px">
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Go Back"
          onClick={() => router.back()}
          variant="ghost"
          colorScheme="teal"
          size="lg"
        />
        <Text fontSize="2xl" fontWeight="bold" color="black" ml={4}>
          {item.name}
        </Text>
      </Flex>
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Box flex="1" display="flex" justifyContent="center">
          <Box
            width="100%"
            maxW="400px"
            height="auto"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="#f5f5f5"
            borderRadius="12px"
            position="relative"
          >
            {imageError ? (
              <FiImage size={400} color="#8A8E85" />
            ) : (
              <Image
                src={item.metadataURI}
                alt={item.name}
                borderRadius="12px"
                objectFit="cover"
                onError={() => setImageError(true)}
              />
            )}
          </Box>
        </Box>
        <Box flex="2">
          <Text
            fontSize="14px"
            fontWeight="500"
            lineHeight="19.6px"
            color="#8A8E85"
            mb="16px"
          >
            {item.description}
          </Text>
          <Box height="100%" display="flex" alignItems="center">
            <Image src="/eth.svg" alt="ETH" boxSize="20px" />
            <Text fontSize="16px" fontWeight="500" lineHeight="19.2px" ml="6px">
              {priceInEther === "0.00" ? item.price : priceInEther} ETH
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default NFTDetails;
