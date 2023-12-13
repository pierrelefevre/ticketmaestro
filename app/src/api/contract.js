import abi from "../assets/abi.json";
import { ethers } from "ethers";

let signer = null;

let provider;
if (window.ethereum !== null) {
  // Connect to the MetaMask EIP-1193 object. This is a standard
  // protocol that allows Ethers access to make all read-only
  // requests through MetaMask.
  provider = new ethers.BrowserProvider(window.ethereum);

  // It also provides an opportunity to request access to write
  // operations, which will be performed by the private key
  // that MetaMask manages for the user.
  signer = await provider.getSigner();
}

export const getAddress = async () => {
  await provider.send("eth_requestAccounts", []);
  return signer.getAddress();
}

export const getContract = async (addr) => {
  await provider.send("eth_requestAccounts", []);
  return new ethers.Contract(addr, abi, signer);
};

// // Function to buy a ticket
// export const buyTicket = async (contract, sectionId, fromAddress, value) => {
//   if (!window.ethereum) {
//     console.error("no metamask");
//     return;
//   }

//   try {
//     let txHash = await window.ethereum.request({
//       method: "eth_sendTransaction",
//       // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
//       params: [
//         {
//           from: fromAddress, // The user's active address.
//           to: contract._address, // Required except during contract publications.
//           value: value,
//         },
//       ],
//     });
//     console.log(txHash);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // Function to check in
// export const checkIn = async (contract, id, fromAddress) => {
//   const response = await contract.methods
//     .checkIn(id)
//     .send({ from: fromAddress });
//   return response;
// };

// // Function to create a new section
// export const createSection = async (
//   contract,
//   sectionName,
//   numTickets,
//   sectionPrice,
//   fromAddress
// ) => {
//   const response = await contract.methods
//     .createSection(sectionName, numTickets, sectionPrice)
//     .send({ from: fromAddress });
//   return response;
// };

// // Function to start the sale
// export const startSale = async (contract, fromAddress) => {
//   const response = await contract.methods
//     .startSale()
//     .send({ from: fromAddress });
//   return response;
// };

// // Function to end the sale
// export const endSale = async (contract, fromAddress) => {
//   const response = await contract.methods.endSale().send({ from: fromAddress });
//   return response;
// };

// // Function to get the event name
// export const getEventName = async (contract) => {
//   const response = await contract.methods.eventName().call();
//   return response;
// };

// // Function to get sections
// export const getSections = async (contract) => {
//   const response = await contract.methods.getSections().call();
//   return response;
// };

// // Function to get tickets
// export const getTickets = async (contract) => {
//   const response = await contract.methods.getTickets().call();
//   return response;
// };

// // Function to get the owner
// export const getOwner = async (contract) => {
//   const response = await contract.methods.owner().call();
//   return response;
// };

// // Function to verify a ticket
// export const verifyTicket = async (contract, id) => {
//   const response = await contract.methods.verifyTicket(id).call();
//   return response;
// };
