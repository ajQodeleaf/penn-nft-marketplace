"use client";
import { Box,  IconButton, Button } from "@chakra-ui/react";
import HorizontalList from "../../components/HorizontalList";
import RankingList from "../../components/RankingList";
import SearchBox from "../../components/SearchBox";
import SectionHeader from "../../components/SectionHeader";
import { getNewsData, getNFTItems, getRankingsData } from "../../services/data";

const ExplorePage = () => {
  const newsData = getNewsData();
  const nftItems = getNFTItems();
  const rankingsData = getRankingsData();

  return (
    <Box bg="#FAFAFA" pb="82px" pt="28px" px="20px">
      <SearchBox />

      <Box mt="48px">
        <SectionHeader
          sectionHeaderTitle="NFT Rankings"
          rightComponent={
            <IconButton
              aria-label="See All"
              icon={
                <Box
                  as="img"
                  src="/arrow-swap.svg"
                  alt="See All"
                  width="24px"
                  height="24px"
                />
              }
              variant="ghost"
              size="sm"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
            />
          }
        />
        <Box>
          <RankingList rankings={rankingsData} />
          <Button
            height="48px"
            width="full"
            borderRadius="14px"
            border="1.5px solid #19976A"
            bg="white"
            color="#19976A"
            fontSize="16px"
            fontWeight="600"
            lineHeight="19.2px"
            _hover={{
              bg: "#e8f2ee",
              borderColor: "#19976A",
            }}
          >
            See all ranks
          </Button>
        </Box>
      </Box>

      <Box mt="40px" mb="4px">
        <SectionHeader
          sectionHeaderTitle="Trending Collections"
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
        <HorizontalList items={nftItems} />
      </Box>

      <Box mt="40px" mb="4px">
        <SectionHeader
          sectionHeaderTitle="Crypto Art Collections"
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
        <HorizontalList items={nftItems} />
      </Box>
    </Box>
  );
};

export default ExplorePage;
