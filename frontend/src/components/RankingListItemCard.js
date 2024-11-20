import { Box, Flex, Text } from "@chakra-ui/react";

const RankingListItemCard = ({ listItem }) => {
  return (
    <Box
      height="48px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text
        fontSize="16px"
        fontWeight="600"
        lineHeight="19.2px"
        mr="16px"
        color="#8A8E85"
      >
        #{listItem.rank}
      </Text>

      <Box position="relative" w="42px" h="42px" mr="12px">
        <Box
          as="img"
          src={listItem.avatarSrc}
          alt="Avatar"
          borderRadius="full"
          boxSize="42px"
        />
        {listItem.isVerified && (
          <Box
            as="img"
            src="/verify.svg"
            alt="Verify Symbol"
            position="absolute"
            bottom="0"
            right="0"
            boxSize="16px"
          />
        )}
      </Box>

      <Box flex="1" display="flex" flexDirection="column" gap="2px">
        <Text fontSize="16px" fontWeight="600" lineHeight="19.2px">
          {listItem.nftTitle}
        </Text>
        <Box display="flex" alignItems="center" gap="4px">
          <Box as="img" src="/eth.svg" alt="ETH Logo" boxSize="16px" />
          <Text
            fontSize="14px"
            fontWeight="500"
            lineHeight="16.8px"
            color="#63685D"
          >
            {listItem.nftPrice} ETH
          </Text>
        </Box>
      </Box>

      <Text
        fontSize="16px"
        fontWeight="500"
        lineHeight="19.2px"
        color="#19976A"
        ml="16px"
      >
        {listItem.priceChange}%
      </Text>
    </Box>
  );
};

export default RankingListItemCard;
