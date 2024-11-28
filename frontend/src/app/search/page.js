"use client";
import { Box, Input, Button, Stack, Text, Spinner } from "@chakra-ui/react";
import { useState } from "react";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);

    setTimeout(() => {
      setResults([
        `Result 1 for "${searchQuery}"`,
        `Result 2 for "${searchQuery}"`,
        `Result 3 for "${searchQuery}"`,
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Box maxW="lg" mx="auto" px={4} py={8}>
      <Stack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Search
        </Text>

        <Box>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type your search here..."
            size="lg"
            borderRadius="full"
            bg="#F0F0F0"
            _focus={{ borderColor: "#19976A" }}
            mb={4}
          />
          <Button
            colorScheme="teal"
            variant="solid"
            size="lg"
            borderRadius="full"
            onClick={handleSearch}
            isLoading={loading}
            loadingText="Searching"
            width="full"
          >
            Search
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Spinner size="lg" />
          </Box>
        ) : (
          <Box>
            {results.length === 0 ? (
              <Text textAlign="center" color="gray.500">
                No results found.
              </Text>
            ) : (
              <Stack spacing={3}>
                {results.map((result, index) => (
                  <Box
                    key={index}
                    bg="white"
                    p={4}
                    borderRadius="md"
                    boxShadow="sm"
                  >
                    <Text fontSize="lg" fontWeight="600">
                      {result}
                    </Text>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default SearchPage;
