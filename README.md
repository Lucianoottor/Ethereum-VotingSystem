
# Blockchain Voting System
<p align="center">
  <img src="https://github.com/Lucianoottor/Ethereum-VotingSystem/blob/main/assets/DemoVoting.gif" alt="Demo Voting System GIF">
</p>

A decentralized voting application built on the Ethereum blockchain. This project is a transparent election system with role-based access control for an Administrator, Clerks, and Voters.

#### Disclaimer: this project is for study purposes and the role-based system is not the ideal for an election system. I would use DAO (Descentralized Autonomous Organization) to validate addresses that are able to vote.

## Tech Stack

**Tech Stack Smart Contract:** Solidity, Truffle Suite (Development, Testing, Deployment)

**Frontend:** React, TypeScript, TailwindCSS

**Blockchain Interaction:** Ethers.js

**Blockchain node:** Ganache
## Architecture Overview

The application is architecturally divided into three main layers: the Smart Contract (on-chain logic), the Blockchain Service (off-chain to on-chain communication), and the Frontend (user interface).

**Smart Contract (Ballot.sol):** The contract is the single source of truth for the election. It governs all rules, stores all data, and ensures the integrity of the voting process.


### Explaining the contract

**Key Features & Roles:** Administrator (adm): The address that deploys the contract. This is the highest level of authority.

**Responsibility:** The administrator is solely responsible for authorizing clerk accounts using the defineClerk function.

**Security:** This role is protected by the onlyAdm modifier, which ensures that critical functions can only be called by the contract's deployer.

**Clerk (isClerk):** An address authorized by the Administrator. Clerks are responsible for managing the voter list.

**Responsibility:** Clerks can grant voting rights to new addresses using the qualifyVoter function.

**Security:** This role is protected by the onlyClerk modifier.

**Voter:** An address that has been granted the right to vote by a Clerk.

**Actions:** A qualified voter can call the vote function once to cast their ballot for a chosen candidate.
<p align="center">
  <img src="https://github.com/Lucianoottor/Ethereum-VotingSystem/blob/main/assets/DemoVoting.gif" alt="Demo Voting System GIF" width="600" height="400">
</p>

**State:** A voter's status is tracked by two mappings: rightToVote (set by a clerk) and hasVoted (set upon voting).
<p align="center">
  <img src="https://github.com/Lucianoottor/Ethereum-VotingSystem/blob/main/assets/AlreadyVoted.gif" alt="Already Voted GIF" width="600" height="400">
</p>

**Core Functions:** defineClerk(address _newClerk): onlyAdm. Grants clerk privileges to a new address.
<p align="center">
  <img src="https://github.com/Lucianoottor/Ethereum-VotingSystem/blob/main/assets/AdminPanel.png" alt="Admin Panel Screenshot" width="600" height="400">
</p>

**qualifyVoter(address _voterAddress):** onlyClerk. Grants voting rights to a new address.
<p align="center">
  <img src="https://github.com/Lucianoottor/Ethereum-VotingSystem/blob/main/assets/ClerkPanel.png" alt="Clerk Panel Screenshot" width="600" height="400">
</p>

**vote(uint _candidateId):** Allows a qualified, non-voted address to cast a vote. It contains three require checks to enforce the rules.
<p align="center">
  <img src="https://github.com/Lucianoottor/Ethereum-VotingSystem/blob/main/assets/DemoNonAutorizedVoter.gif" alt="Demo Non-Authorized Voter GIF" width="600" height="400">
</p>

**getCandidates():** A view function that returns the array of all candidates along with their current vote counts.
## Blockchain Service

This layer acts as an abstraction between the frontend components and the complex Ethers.js logic required to communicate with the smart contract. It exposes simple, asynchronous functions for the UI to consume.
Core Concepts: Provider vs. Signer Provider: A Provider (ethers.BrowserProvider) provides read-only access to the blockchain. It is used for calling view functions that do not require a signature or transaction fee (e.g., getCandidates, isClerk, adm). A single provider instance is created and used for all read operations.

**Signer:** A Signer is an object that represents a specific user account (e.g., from MetaMask). It is required for any operation that changes the state of the blockchain (a "write" operation). To perform a write operation, we first get the signer from the provider and then connect it to the contract instance. The signer's address becomes the msg.sender in the smart contract.

**Key Service Functions:** connectWallet(): Prompts the user to connect their MetaMask account and retrieves the signer's address.

**getCandidates():** Calls the getCandidates view function and formats the returned data into a clean Candidate[] array for the frontend.

**verifyAdmin(address) / verifyClerk(address):** Checks if a given address matches the contract's adm or isClerk status.

**castVote(candidateId):** The primary write function. It gets a Signer, connects it to the contract (contract.connect(signer)), and then calls the vote function, which triggers a MetaMask transaction confirmation.

**defineClerk(address) / qualifyVoter(address):** Write functions similar to castVote that require a Signer to send a transaction.
## Front End

The frontend is built with React and uses a centralized "state machine" approach in App.tsx to manage the user flow.
Component Architecture: App.tsx: The main controller component.

It holds a critical state variable, appStatus, which dictates which page is currently rendered.

Upon login (handleLoginSuccess), it determines the user's role (Admin, Clerk, or Voter) by calling the blockchain service and sets the appStatus accordingly. This directs the user to the correct page.

It manages all high-level state, such as the user's address and the list of candidates, passing them down as props where necessary.

Page Components (LoginPage, AdminPage, ClerkPage, VotingPage, etc.) are primarily responsible for the UI.

They receive functions as props from App.tsx (e.g., onLoginSuccess, onVote) to report user actions back to the main controller.

Pages that need to display on-chain data (AdminPage, ClerkPage, SuccessPage) contain their own useEffect hooks to fetch that data directly from the blockchain service, keeping them encapsulated.

## Requirements

#### Check modules version

```http
  node -v
  yarn -v
```

| Module | Version    | 
| :-------- | :------- | 
| `Node.js` | `v18.20.8` | 
| `yarn` | `v1.22.22` | 

## How to use

Initialize your blockchain network (I am using Ganache)

Clone the repository:
```bash
  git clone https://github.com/Lucianoottor/Ethereum-VotingSystem.git
```
Go to the folder Blockchain_VotingSystem:
```bash
  cd Blockchain_VotingSystem/
```
Make sure the file truffle-config.js matches the requirements:
```bash
  module.exports = {
  networks: {
    development: {
     host: "127.0.0.1", // Your network
     port: 7545, // Your port
     network_id: "*"
    },
    dashboard: {
    }
  },
  compilers: {
    solc: {
      version: "0.8.13", // Solidity version
    }
  },
  db: {
    enabled: false,
    host: "127.0.0.1",
  }
};
```
Install the dependencies:
```bash
  npm install
```
Compile, test and migrate the contract:
```bash
  truffle compile
  truffle test
  truffle migrate
```
Now, we have to get the contract address and contract ABI where we deployed. Attention: the account used to deploy will be the contract administrator (generally in Ganache it will be the first account of the network)

In the path build/contracts, get the Ballot.json and locate the contractABI [];

And the contract address (generally it is all the way down):
```bash
"networks": {
    "5777": {
      "events": {},
      "links": {},
      "address": "0x1Bbef2DA7aD40A2f4BE7A6E22b1d03dd997E6915", // This guy right here
      "transactionHash": "0x223de67a9e6936fbd08285e06fc5618a8755b701c263422a75b248fe2febbe88"
    }
```

Perfect, now let's interact with the frontend using ethers.js.

First, go to FrontEnd/election-front and install the dependencies:
```bash
  npm install
```

Inside FrontEnd/election-front/src/services, open the blockchain.ts, this file is responsible for interacting with the contract using the ethers library. Paste the contract info here:
```bash
const contractAddress = '0x1Bbef2DA7aD40A2f4BE7A6E22b1d03dd997E6915'; // Your contract address
const contractABI = [...] // Your contract ABI
```
Run the frontend:
```bash
  yarn dev
```

Ok it is almost set up, make sure you configure your Metamask wallet network and connect with the private keys of your chain.

1. Connect with the admin account
2. Setup a Clerk account
3. Connect with the clerk account
4. Setup the valid voters
5. Connect with the voters account and start voting!




