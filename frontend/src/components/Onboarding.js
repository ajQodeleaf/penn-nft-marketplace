"use client";
import { useState } from "react";
import { Box, Button, Text, Image, HStack } from "@chakra-ui/react";
import { onboardingContent } from "../services/data";

export default function Onboarding({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingContent.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <Box bg="#FAFAFA" height="100vh" display="flex" flexDirection="column">
      <Box height="68vh" bg="lightblue">
        <Image
          src="/header.svg"
          alt="Header Image"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>
      <Box bg="white">
        <Box
          mt="8px"
          height="80px"
          bg="white"
          mx="12px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Text
            fontSize="24px"
            fontWeight="600"
            lineHeight="33.6px"
            letterSpacing="-0.005em"
            noOfLines={2}
          >
            {onboardingContent[currentIndex].heading}
          </Text>
          <Text
            fontFamily="Neue Haas Grotesk Display Pro"
            fontSize="16px"
            fontWeight="500"
            lineHeight="24px"
            textAlign="center"
            noOfLines={2}
          >
            {onboardingContent[currentIndex].body}
          </Text>
        </Box>
        <Box
          height="6px"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt="20px"
        >
          <HStack spacing="8px">
            {Array.from({ length: onboardingContent.length }, (_, index) => (
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
        <Box
          mt="20px"
          mx="32px"
          height="52px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="outline"
            borderWidth="1.5px"
            borderColor="#19976A"
            borderRadius="14px"
            color="#19976A"
            backgroundColor="white"
            _hover={{ backgroundColor: "#f0f5f3" }}
            flex="1"
            height="100%"
            mr="4px"
            onClick={onComplete}
          >
            Skip
          </Button>

          <Button
            color="white"
            backgroundColor="#19976A"
            borderRadius="14px"
            _hover={{ backgroundColor: "#176d56" }}
            flex="1"
            height="100%"
            ml="4px"
            onClick={handleNext}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
