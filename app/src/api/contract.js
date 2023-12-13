import abi from "../assets/abi.json";
import { ethers } from "ethers";

export const getProvider = async () => {
  if (window.ethereum !== null) {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    let provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  }
};

export const getSigner = async () => {
  if (window.ethereum !== null) {
    let provider = await getProvider();

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    let signer = await provider.getSigner();
    return signer;
  }
};

export const getAddress = async () => {
  let provider = await getProvider();
  let signer = await getSigner();

  await provider.send("eth_requestAccounts", []);
  return signer.getAddress();
};

export const getContract = async (addr) => {
  let provider = await getProvider();
  let signer = await getSigner();

  await provider.send("eth_requestAccounts", []);
  return new ethers.Contract(addr, abi, signer);
};