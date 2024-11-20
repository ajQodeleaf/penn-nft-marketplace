import { Box, Flex, Text, IconButton } from "@chakra-ui/react";

const SectionHeader = ({ sectionHeaderTitle, rightComponent }) => {
  return (
    <Box height="22px" mb="28px">
      <Flex align="center" justify="space-between" height="100%">
        <Text fontSize="18px" fontWeight="600" color="black">
          {sectionHeaderTitle}
        </Text>
        <Box>{rightComponent}</Box>
      </Flex>
    </Box>
  );
};

export default SectionHeader;
