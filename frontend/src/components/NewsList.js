import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import NewsListItemCard from "./NewsListItemCard";

const NewsList = ({ newsData }) => {
  return (
    <Flex direction="column" gap="32px">
      {newsData.map((item, index) => (
        <NewsListItemCard key={index} item={item} />
      ))}
    </Flex>
  );
};

export default NewsList;
