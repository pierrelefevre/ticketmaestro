import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";

const useWallet = () => useContext(WalletContext);

export default useWallet;
