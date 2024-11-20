"use client";
import { Box, Image, VStack, Text, Flex, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Carousel = ({ data, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, interval);

    return () => clearInterval(autoScroll);
  }, [data.length, interval]);

  return (
    <Box mt="28px">
      <Box
        height="164px"
        mb="18px"
        bg="gray.200"
        borderRadius="14px"
        position="relative"
        overflow="hidden"
      >
        <Image
          src={data[currentIndex].image}
          alt="Image"
          layout="fill"
          height="164px"
          width="full"
          objectFit="cover"
          borderRadius="14px"
        />
      </Box>

      <Box height="80px" mb="28px" width="100%">
        <VStack spacing="12px" height="100%">
          <Box flex="1" width="100%" borderRadius="8px">
            <Text
              fontWeight={600}
              fontSize="18px"
              lineHeight="25.74px"
              noOfLines={2}
              isTruncated
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="normal"
            >
              {data[currentIndex].title}
            </Text>
          </Box>
          <Box flex="1" width="100%" borderRadius="8px">
            <Flex justifyContent="space-between" alignItems="center" h="100%">
              <Text
                fontSize="13px"
                fontWeight="500"
                lineHeight="15.6px"
                color="#8A8E85"
              >
                {data[currentIndex].source}
              </Text>
              <Text
                fontSize="13px"
                fontWeight="500"
                lineHeight="15.6px"
                color="#8A8E85"
              >
                {data[currentIndex].time}
              </Text>
            </Flex>
          </Box>
        </VStack>
      </Box>

      <Box
        height="6px"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <HStack spacing="8px">
          {data.map((_, index) => (
            <Box
              key={index}
              width="6px"
              height="6px"
              borderRadius="full"
              bg={index === currentIndex ? "#19976A" : "gray.400"}
            ></Box>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default Carousel;
