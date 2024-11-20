import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

const NewsListItemCard = ({ item }) => {
  return (
    <Box
      height="96px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box width="96px" height="96px" mr="16px">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          objectFit="cover"
          width="100%"
          height="100%"
          borderRadius="12px"
        />
      </Box>

      <Box
        flex="1"
        height="96px"
        display="flex"
        flexDirection="column"
        pb="24px"
        justifyContent="start"
      >
        <Box height="56px" width="100%">
          <Text
            fontSize="16px"
            fontWeight="600"
            lineHeight={"23.2px"}
            color="black"
            isTruncated
            noOfLines={2}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="normal"
          >
            {item.title}
          </Text>
        </Box>

        <Box>
          <Flex justify="space-between" align="center">
            <Text
              fontSize="13px"
              fontWeight="500"
              lineHeight={"15.6px"}
              color="#8A8E85"
            >
              {item.source}
            </Text>
            <Text
              fontSize="13px"
              fontWeight="500"
              lineHeight={"15.6px"}
              color="#8A8E85"
            >
              {item.timeAgo}
            </Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default NewsListItemCard;
