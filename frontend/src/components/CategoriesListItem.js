import React from "react";
import { Box, Text } from "@chakra-ui/react";

const CategoriesListItem = ({ item, selectedItem, setSelectedItem }) => {
  return (
    <Box
      height="40px"
      px="24px"
      py="12px"
      borderRadius="3xl"
      cursor="pointer"
      bg={selectedItem === item ? "#19976A14" : "white"}
      onClick={() => setSelectedItem(item)}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text
        fontSize="14px"
        fontWeight="600"
        color={selectedItem === item ? "#19976A" : "#8A8E85"}
      >
        {item}
      </Text>
    </Box>
  );
};

export default CategoriesListItem;
