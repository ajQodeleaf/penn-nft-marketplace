import { useRouter } from "next/navigation";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const BottomNavigationBar = () => {
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState("/");

  const navItems = [
    { label: "Home", icon: "/home.svg", route: "/" },
    { label: "Explore", icon: "/explore.svg", route: "/explore" },
    { label: "News", icon: "/news.svg", route: "/news" },
    { label: "Account", icon: "/user.png", route: "/account" },
  ];

  useEffect(() => {
    setActiveRoute(router.pathname || "/");
  }, [router.pathname]);

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="white"
      borderTop="1px solid #e0e0e0"
      boxShadow="md"
      height="72px"
    >
      <Flex justify="space-around" align="center" height="100%">
        {navItems.map((item) => (
          <Flex
            key={item.label}
            direction="row"
            align="center"
            justify="center"
            onClick={() => {
              setActiveRoute(item.route);
              router.push(item.route);
            }}
            cursor="pointer"
            gap="2"
          >
            {activeRoute === item.route ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="3xl"
                bg="#19976A1A"
                px="4"
                py="2"
              >
                <Image src={item.icon} alt={item.label} boxSize="24px" />
                <Text
                  fontSize="14px"
                  fontWeight={600}
                  color="#19976A"
                  lineHeight={"16.8px"}
                  ml="2"
                >
                  {item.label}
                </Text>
              </Box>
            ) : (
              <Text
                fontSize="14px"
                fontWeight={600}
                lineHeight={"16.8px"}
                color="#8A8E85"
              >
                {item.label}
              </Text>
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default BottomNavigationBar;
