"use client";
import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import CategoriesListItem from "./CategoriesListItem";

const CategoriesList = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(items[0]);

  return (
    <Box
      overflowX="auto"
      whiteSpace="nowrap"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Flex gap="12px">
        {items.map((item) => (
          <CategoriesListItem
            key={item}
            item={item}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default CategoriesList;
