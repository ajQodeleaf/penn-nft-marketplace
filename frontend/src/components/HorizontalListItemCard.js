"use client";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { FiImage } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

const weiToEther = (wei) => {
  return (parseFloat(wei) / 1e18).toFixed(2);
};

const HorizontalListItemCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const priceInEther = weiToEther(item.price);
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem("selectedNFT", JSON.stringify(item));

    router.push(`/nftDetails`);
  };

  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      width="260px"
      height="100%"
      bg="white"
      borderRadius="14px"
      boxShadow="sm"
      flexShrink="0"
      px="18px"
      py="20px"
      my={4}
      display="flex"
      flexDirection="column"
      _hover={{ boxShadow: "md", transform: "scale(1.02)", transition: "0.2s" }}
    >
      <Box
        height="220px"
        mb="22px"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg={imageError ? "#f5f5f5" : "transparent"}
        borderRadius="12px"
      >
        {!imageError ? (
          <Image
            src={item.metadataURI}
            alt={item.name}
            objectFit="cover"
            width="100%"
            height="100%"
            borderRadius="12px"
            onError={() => setImageError(true)}
          />
        ) : (
          <FiImage size={50} color="#8A8E85" />
        )}
      </Box>

      <Box flex="1" bg="transparent" display="flex" flexDirection="column">
        <Box
          height="70px"
          borderRadius="md"
          display="flex"
          flexDirection="column"
        >
          <Box height="22px" display="flex" alignItems="center">
            <Text
              fontSize="18px"
              fontWeight="600"
              lineHeight="21.6px"
              color="black"
              mr="6px"
            >
              {item.name}
            </Text>
            {item.isVerified && (
              <Box
                as="img"
                src="/verify.svg"
                alt="Verified Icon"
                height="18px"
              />
            )}
          </Box>

          <Box flex="1" mt="8px" maxW="100%">
            <Text
              fontSize="14px"
              fontWeight="500"
              lineHeight="19.6px"
              noOfLines={2}
              color="#8A8E85"
              isTruncated
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="normal"
            >
              {item.description}
            </Text>
          </Box>
        </Box>

        <Box height="20px" mt="20px">
          <Flex justify="space-between" height="100%">
            <Box height="100%" display="flex" alignItems="center">
              <Image src="/eth.svg" alt="ETH" boxSize="20px" />
              <Text
                fontSize="16px"
                fontWeight="500"
                lineHeight="19.2px"
                ml="6px"
              >
                {priceInEther === "0.00" ? item.price : priceInEther} ETH
              </Text>
            </Box>

            <Box height="100%">
              <Text
                fontSize="16px"
                fontWeight="500"
                lineHeight="19.2px"
                ml="6px"
                color="#19976A"
              >
                {item.percentageChange || "0%"}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default HorizontalListItemCard;
