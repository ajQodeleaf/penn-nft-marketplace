'use client';
import { ChakraProvider } from "@chakra-ui/react";
import ConnectWalletWrapper from "../components/ConnectWalletWrapper";
import { WalletProvider } from "../context/WalletContext";
import theme from "../styles/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          <WalletProvider>
            <ConnectWalletWrapper>
              {children}
            </ConnectWalletWrapper>
          </WalletProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}


