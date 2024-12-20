import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const SearchBox = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/search");
  };

  return (
    <Box
      height="48px"
      width="full"
      border="0.5px solid #DEDEDE"
      borderRadius="136px"
      bg="#F0F0F0"
      px="24px"
      pt="10px"
      cursor="pointer"
      onClick={handleClick}
      _hover={{ bg: "#E0E0E0" }}
    >
      <Flex align="center">
        <Image
          src="/search.svg"
          alt="Search Icon"
          boxSize="24px"
          objectFit="contain"
        />
        <Text ml="16px" fontSize="16px" fontWeight="500" color="#8A8E85">
          Type anything to search...
        </Text>
      </Flex>
    </Box>
  );
};

export default SearchBox;
