"use client";
import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import BottomNavigationBar from "./BottomNavigationBar";
import ConnectWallet from "./ConnectWallet";
import Onboarding from "./Onboarding";

export default function ConnectWalletWrapper({ children }) {
  const { isConnected } = useWallet();
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const completeOnboarding = () => {
    setOnboardingComplete(true);
  };

  return (
    <>
      {!onboardingComplete ? (
        <Onboarding onComplete={completeOnboarding} />
      ) : isConnected ? (
        <>
          {children}
          <BottomNavigationBar />
        </>
      ) : (
        <>
          <ConnectWallet />
        </>
      )}
    </>
  );
}
