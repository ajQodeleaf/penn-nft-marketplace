"use client";
import { useWallet } from "../context/WalletContext";
import { useOnboarding } from "../context/OnboardingContext";
import { Box, Spinner } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import BottomNavigationBar from "./BottomNavigationBar";
import ConnectWallet from "./ConnectWallet";
import Onboarding from "./Onboarding";

export default function ConnectWalletWrapper({ children }) {
  const { isConnected, loading: walletLoading } = useWallet();
  const {
    onboardingComplete,
    completeOnboarding,
    loading: onboardingLoading,
  } = useOnboarding();
  const pathname = usePathname();
  const isSearchRoute = pathname.startsWith("/search");

  const loading = walletLoading || onboardingLoading;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  return (
    <>
      {!onboardingComplete ? (
        <Onboarding onComplete={completeOnboarding} />
      ) : isConnected ? (
        <>
          {children}
          {!isSearchRoute && <BottomNavigationBar />}
        </>
      ) : (
        <ConnectWallet />
      )}
    </>
  );
}
