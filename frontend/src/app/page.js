"use client";
import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import SearchBox from "../components/SearchBox";
import SectionHeader from "../components/SectionHeader";
import NewsList from "../components/NewsList";
import HorizontalList from "../components/HorizontalList";
import CategoriesList from "../components/CategoriesList";
import { getCategories, getNewsData, getNFTItems } from "../services/data";

export default function Home() {
  const router = useRouter();
  const items = getCategories();
  const newsData = getNewsData();
  const nftItems = getNFTItems();

  const handleSeeAllClick = (section, data) => {
    router.push(
      `/see-all?section=${encodeURIComponent(
        section
      )}&data=${encodeURIComponent(JSON.stringify(data))}`
    );
  };

  return (
    <Box bg="#FAFAFA" pb="82px" px="20px" pt="20px">
      <Flex height="24px" mb="20px" align="center" justify="space-between">
        <Box flex="263">
          <Text fontSize="20px" fontWeight="600">
            Explore collectible assets!
          </Text>
        </Box>
        <Box flex="72">
          <Flex justify="space-between">
            <Image
              src="/notification.svg"
              alt="Notification Icon"
              boxSize="24px"
            />
            <Image src="/wallet.svg" alt="Wallet Icon" boxSize="24px" />
          </Flex>
        </Box>
      </Flex>
      <SearchBox />
      <Box mt="40px" mb="4px">
        <SectionHeader
          sectionHeaderTitle="NFT Collections"
          rightComponent={
            <Button
              variant="link"
              fontSize="14px"
              fontWeight="600"
              color="#19976A"
              _hover={{ textDecoration: "underline" }}
              onClick={() => handleSeeAllClick("NFT Collections", nftItems)}
            >
              See All
            </Button>
          }
        />
        <CategoriesList items={items} />
        <HorizontalList items={nftItems} />
      </Box>
      <Box mt="40px" mb="4px">
        <SectionHeader
          sectionHeaderTitle="Notable NFT Drops"
          rightComponent={
            <Button
              variant="link"
              fontSize="14px"
              fontWeight="600"
              color="#19976A"
              _hover={{ textDecoration: "underline" }}
              onClick={() => handleSeeAllClick("Notable NFT Drops", nftItems)}
            >
              See All
            </Button>
          }
        />
        <HorizontalList items={nftItems} />
      </Box>
      <Box mt="48px">
        <SectionHeader
          sectionHeaderTitle="Trending News"
          rightComponent={
            <Button
              variant="link"
              fontSize="14px"
              fontWeight="600"
              color="#19976A"
              _hover={{ textDecoration: "underline" }}
            >
              See All
            </Button>
          }
        />
        <NewsList newsData={newsData} />
      </Box>
    </Box>
  );
}
