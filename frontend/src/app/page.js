"use client";
import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import SearchBox from "@/components/SearchBox";
import SectionHeader from "@/components/SectionHeader";
import NewsList from "@/components/NewsList";
import HorizontalList from "@/components/HorizontalList";
import CategoriesList from "@/components/CategoriesList";
import { getCategories, getNewsData, getNFTItems } from "@/services/data";

export default function Home() {
  const items = getCategories();
  const newsData = getNewsData();
  const itemsData2 = getNFTItems();

  return (
    <Box bg="#FAFAFA" pb="82px" px="20px" pt="20px">
      <Flex
        height="24px"
        mb="20px"
        align="center"
        justify="space-between"
        width="100%"
      >
        <Box
          flex="263"
          display="flex"
          alignItems="center"
          justifyContent="start"
        >
          <Text fontSize="20px" fontWeight="600">
            Explore collectible assets!
          </Text>
        </Box>

        <Box flex="72">
          <Flex width="100%" justify="space-between" align="center">
            <Image
              src="/notification.svg"
              alt="Notification Icon"
              boxSize="24px"
              objectFit="contain"
            />
            <Image
              src="/wallet.svg"
              alt="Wallet Icon"
              boxSize="24px"
              objectFit="contain"
            />
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
              lineHeight="16.8px"
              _hover={{ textDecoration: "underline" }}
              onClick={() => console.log("See All clicked")}
            >
              See All
            </Button>
          }
        ></SectionHeader>
        <CategoriesList items={items} />
        <HorizontalList items={itemsData2}></HorizontalList>
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
              lineHeight="16.8px"
              _hover={{ textDecoration: "underline" }}
              onClick={() => console.log("See All clicked")}
            >
              See All
            </Button>
          }
        ></SectionHeader>
        <HorizontalList items={itemsData2}></HorizontalList>
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
              lineHeight="16.8px"
              _hover={{ textDecoration: "underline" }}
              onClick={() => console.log("See All clicked")}
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
