import { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setIsConnected(true);
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  };

  useEffect(() => {
    const checkMetaMask = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setIsConnected(true);
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking MetaMask accounts", error);
        }
      }
      setLoading(false);
    };

    checkMetaMask();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum && handleAccountsChanged) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsConnected(true);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        account,
        connectMetaMask,
        disconnectWallet,
        loading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
