"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, SimpleGrid, Text, Flex, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import VerticalListItemCard from "../../components/VerticalListItemCard";

export default function SeeAllPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const section = searchParams.get("section") || "See All";
  const data = searchParams.get("data");
  const parsedData = data ? JSON.parse(decodeURIComponent(data)) : [];

  return (
    <Box bg="#FAFAFA" px="20px" pt="20px" pb="20px">
      <Flex alignItems="center">
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Go Back"
          onClick={() => router.back()}
          variant="ghost"
          colorScheme="teal"
          size="lg"
        />
        <Text ml="10px" fontSize="18px" fontWeight="600" color="black">
          {section}
        </Text>
      </Flex>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing="20px"
        mt="20px"
      >
        {parsedData.map((item, index) => (
          <VerticalListItemCard key={index} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
