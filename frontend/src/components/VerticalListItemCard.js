"use client";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import { MdBrokenImage } from "react-icons/md";
import { useRouter } from "next/navigation";

const weiToEth = (wei) => {
  return parseFloat(wei) / 1e18;
};

const VerticalListItemCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem("selectedNFT", JSON.stringify(item));
    router.push(`/nftDetails`);
  };

  return (
    <Box
      onClick={handleClick}
      width="100%"
      height="100%"
      bg="white"
      borderRadius="14px"
      boxShadow="sm"
      flexShrink="0"
      px="18px"
      py="20px"
      display="flex"
      flexDirection="column"
    >
      <Box height="220px" mb="22px" position="relative">
        {!imageError ? (
          <Image
            src={item.metadataURI}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            style={{ borderRadius: "12px" }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Flex
            alignItems="center"
            justifyContent="center"
            height="100%"
            bg="gray.100"
            borderRadius="12px"
          >
            <Icon as={MdBrokenImage} boxSize={12} color="gray.500" />
          </Flex>
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
              <Image src="/eth.svg" alt="ETH" width={20} height={20} />
              <Text
                fontSize="16px"
                fontWeight="500"
                lineHeight="19.2px"
                ml="6px"
              >
                {weiToEth(item.price)} ETH
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

export default VerticalListItemCard;
