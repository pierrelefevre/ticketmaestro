import { useState, useEffect } from "react";
import "./App.css";
import { buyTicket, checkIn, getOwner } from "./contract";

function App() {
  const [block, setBlock] = useState(0);
  const [account, setAccount] = useState(null); // State to store user's account

  // Function to connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      // Check if MetaMask is installed
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }); // Request account access
        setAccount(accounts[0]); // Set the user's account in state
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask to use this feature!");
    }
  };

  useEffect(() => {
    if (!account) {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account}` : "Connect Wallet"}
      </button>
      <p>{block.hash}</p>
      <button onClick={() => buyTicket(1, account)}>Buy Ticket</button>
      <button onClick={() => checkIn(1, account)}>Check In</button>
      <button
        onClick={async () => {
          let o = await getOwner(account);
          console.log(o);
        }}
      >
        Get Owner
      </button>
    </>
  );
}

export default App;
