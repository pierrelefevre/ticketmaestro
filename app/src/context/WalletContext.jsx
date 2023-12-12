import { useState, createContext, useEffect } from "react";

const initialState = {
  account: [],
};

export const WalletContext = createContext({
  ...initialState,
});

export const WalletContextProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.log("Could not find window.ethereum");
    }
  };

  useEffect(() => {
    connectWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        connectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
