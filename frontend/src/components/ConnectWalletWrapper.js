"use client";
import { useWallet } from "../context/WalletContext";
import BottomNavigationBar from "./BottomNavigationBar";
import ConnectWallet from "./ConnectWallet";

export default function ConnectWalletWrapper({ children }) {
  const { isConnected } = useWallet();
  return isConnected ? (
    <>
      {children}
      <BottomNavigationBar />
    </>
  ) : (
    <ConnectWallet />
  );
}
