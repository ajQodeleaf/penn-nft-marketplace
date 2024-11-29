"use client";
import { useState } from "react";
import { Box, IconButton, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import HorizontalList from "../../components/HorizontalList";
import RankingList from "../../components/RankingList";
import SearchBox from "../../components/SearchBox";
import SectionHeader from "../../components/SectionHeader";
import { getNFTItems, getRankingsData } from "../../services/data";

const ExplorePage = () => {
  const [rankings, setRankings] = useState(getRankingsData());
  const [sortAscending, setSortAscending] = useState(true);
  const [buttonActive, setButtonActive] = useState(false);
  const router = useRouter();
  const nftItems = getNFTItems();

  const handleSort = () => {
    const sortedRankings = [...rankings].sort((a, b) => {
      const changeA = parseFloat(a.priceChange.replace("%", ""));
      const changeB = parseFloat(b.priceChange.replace("%", ""));
      return sortAscending ? changeA - changeB : changeB - changeA;
    });
    setRankings(sortedRankings);
    setSortAscending(!sortAscending);
    setButtonActive(!buttonActive);
  };

  const handleSeeAllClick = (section, data) => {
    router.push(
      `/see-all?section=${encodeURIComponent(
        section
      )}&data=${encodeURIComponent(JSON.stringify(data))}`
    );
  };

  return (
    <Box bg="#FAFAFA" pb="82px" pt="28px" px="20px">
      <SearchBox />

      <Box mt="48px">
        <SectionHeader
          sectionHeaderTitle="NFT Rankings"
          rightComponent={
            <IconButton
              aria-label="Sort by Price Change"
              icon={
                <Box
                  as="img"
                  src="/arrow-swap.svg"
                  alt="Sort"
                  width="24px"
                  height="24px"
                />
              }
              variant="ghost"
              size="sm"
              onClick={handleSort}
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              color={buttonActive ? "#19976A" : "black"}
            />
          }
        />
        <Box>
          <RankingList rankings={rankings} />
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
              onClick={() =>
                handleSeeAllClick("Trending Collections", nftItems)
              }
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
              onClick={() =>
                handleSeeAllClick("Crypto Art Collections", nftItems)
              }
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
