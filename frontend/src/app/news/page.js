"use client";
import Carousel from "../../components/Carousel";
import CategoriesList from "../../components/CategoriesList";
import NewsList from "../../components/NewsList";
import SearchBox from "../../components/SearchBox";
import SectionHeader from "../../components/SectionHeader";
import {
  getNewsCategories,
  getCarouselData,
  getNewsData,
} from "../../services/data";
import { Box, Button, IconButton, Text, Image } from "@chakra-ui/react";
import React from "react";

const NewsPage = () => {
  const newsCategoriesList = getNewsCategories();
  const carouselData = getCarouselData();
  const newsData = getNewsData();
  return (
    <Box bg="#FAFAFA" pb="82px" px="20px">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        height="48px"
        mt="20px"
        mb="24px"
      >
        <SearchBox></SearchBox>
        <IconButton
          icon={<Image src="/menu.svg" alt="Menu" width={14} height={14} />}
          aria-label="Menu"
          variant="ghost"
          size="14px"
          ml="16px"
        />
      </Box>
      <CategoriesList items={newsCategoriesList} />
      <Box mt="52px">
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
            >
              See All
            </Button>
          }
        />
        <Carousel data={carouselData} />
        <Box mt="48px">
          <SectionHeader
            sectionHeaderTitle="Based on your activity"
            rightComponent={
              <Button
                variant="link"
                fontSize="14px"
                fontWeight="600"
                color="#19976A"
                lineHeight="16.8px"
                _hover={{ textDecoration: "underline" }}
              >
                See All
              </Button>
            }
          ></SectionHeader>

          <NewsList newsData={newsData} />
        </Box>
      </Box>
    </Box>
  );
};

export default NewsPage;
