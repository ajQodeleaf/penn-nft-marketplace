import { Box, Flex } from "@chakra-ui/react";
import HorizontalListItemCard from "./HorizontalListItemCard";

const HorizontalList = ({ items }) => {
  return (
    <Box
      mt="36px"
      height="100%"
      overflowX="auto"
      whiteSpace="nowrap"
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Flex gap="20px" height="100%">
        {items.map((item, index) => (
          <HorizontalListItemCard key={index} item={item} />
        ))}
      </Flex>
    </Box>
  );
};

export default HorizontalList;
