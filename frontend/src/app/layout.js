"use client";
import { usePathname } from "next/navigation";
import { ChakraProvider } from "@chakra-ui/react";
import { WalletProvider } from "../context/WalletContext";
import { OnboardingProvider } from "../context/OnboardingContext";
import ConnectWalletWrapper from "../components/ConnectWalletWrapper";
import theme from "../styles/theme";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isSearchRoute = pathname.startsWith("/search");
  const isSeeAllRoute = pathname.startsWith("/see-all");
  const isNFTDetailsRoute = pathname.startsWith("/nftDetails");

  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          <WalletProvider>
            <OnboardingProvider>
              {isSearchRoute || isSeeAllRoute || isNFTDetailsRoute ? (
                children
              ) : (
                <ConnectWalletWrapper>{children}</ConnectWalletWrapper>
              )}
            </OnboardingProvider>
          </WalletProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
