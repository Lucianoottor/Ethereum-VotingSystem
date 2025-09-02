
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
