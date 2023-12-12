import Web3 from "web3";
import abi from "../assets/abi.json";

const web3 = new Web3(
  "https://sepolia.infura.io/v3/3f1d25df4ca94c788bbbebf8d2f3edaf"
);

export const getContract = (addr) => {
  const contract = new web3.eth.Contract(abi, addr);
  return contract;
};

// Function to buy a ticket
export const buyTicket = async (contract, sectionId, fromAddress) => {
  // Make sure to specify the value (ticket price) if it's required
  const response = await contract.methods
    .buyTicket(sectionId)
    .send({ from: fromAddress });
  return response;
};

// Function to check in
export const checkIn = async (contract, id, fromAddress) => {
  const response = await contract.methods
    .checkIn(id)
    .send({ from: fromAddress });
  return response;
};

// Function to create a new section
export const createSection = async (
  contract,
  sectionName,
  numTickets,
  sectionPrice,
  fromAddress
) => {
  const response = await contract.methods
    .createSection(sectionName, numTickets, sectionPrice)
    .send({ from: fromAddress });
  return response;
};

// Function to start the sale
export const startSale = async (contract, fromAddress) => {
  const response = await contract.methods
    .startSale()
    .send({ from: fromAddress });
  return response;
};

// Function to end the sale
export const endSale = async (contract, fromAddress) => {
  const response = await contract.methods.endSale().send({ from: fromAddress });
  return response;
};

// Function to get the event name
export const getEventName = async (contract) => {
  const response = await contract.methods.eventName().call();
  return response;
};

// Function to get sections
export const getSections = async (contract) => {
  const response = await contract.methods.getSections().call();
  return response;
};

// Function to get tickets
export const getTickets = async (contract) => {
  const response = await contract.methods.getTickets().call();
  return response;
};

// Function to get the owner
export const getOwner = async (contract) => {
  const response = await contract.methods.owner().call();
  return response;
};

// Function to verify a ticket
export const verifyTicket = async (contract, id) => {
  const response = await contract.methods.verifyTicket(id).call();
  return response;
};
