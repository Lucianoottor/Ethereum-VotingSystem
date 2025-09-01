import { ethers } from "ethers";
import { Address } from "thirdweb";

// --- Contract Setup ---
const contractAddress = '0xc75b0218c8dcecDB22dCfF6e6A69c6BAF0E85B13';
const contractABI = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "clerkAddress",
          "type": "address"
        }
      ],
      "name": "ClerkDefined",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "voterAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "candidateId",
          "type": "uint256"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "voterAddress",
          "type": "address"
        }
      ],
      "name": "VoterQualified",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "adm",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasVoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "isClerk",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "rightToVote",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newClerk",
          "type": "address"
        }
      ],
      "name": "defineClerk",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_voterAddress",
          "type": "address"
        }
      ],
      "name": "qualifyVoter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateId",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCandidates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Ballot.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];


const provider = new ethers.BrowserProvider(window.ethereum);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export type Candidate = {
  id: number;
  name: string;
  voteCount: number;
};

export type UserStatus = {
  canVote: boolean;
  hasVoted: boolean;
};

export const connectWallet = async (): Promise<string> => {
  console.log('Connecting wallet...');
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  
  return signer.address;
};


export const checkUserStatus = async (address: string): Promise<UserStatus> => {
  console.log(`Checking status for address: ${address}`);
  const [canVote, hasVoted] = await Promise.all([
    contract.rightToVote(address),
    contract.hasVoted(address)
  ]);
  return { canVote, hasVoted };
};


export const getCandidates = async (): Promise<Candidate[]> => {
  console.log('Fetching candidates...');
  const rawCandidates = await contract.getCandidates();
  const formattedCandidates = rawCandidates.map((candidate: any, index: number) => ({
    id: index,
    name: candidate.name,
    voteCount: Number(candidate.voteCount),
  }));
  
  return formattedCandidates;
};

export const castVote = async (candidateId: number): Promise<void> => {
  console.log(`Casting vote for candidate ID: ${candidateId}`);
  try {
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    console.log('Sending transaction to vote...');
    const tx = await contractWithSigner.vote(candidateId);
    await tx.wait();
    console.log('Transaction confirmed!');
  } catch (err) {
    console.error("Error voting:", err);
    throw err;
  }
};

export const verifyAdmin = async (userAddress: string): Promise<boolean> => {
    try {
        const admAddress = await contract.adm();
        return userAddress.toLowerCase() === admAddress.toLowerCase();
    } catch (err) {
        console.error("Error fetching administrator address: ", err);
        return false;
    }
};


export const getClerks = async (): Promise<string[]> => {
    try {
        const filter = contract.filters.ClerkDefined();
        const logs = await contract.queryFilter(filter);
        const clerkAddresses = new Set(logs.map(log => log.args.clerkAddress)); 
        return Array.from(clerkAddresses);
    } catch (err) {
        console.error("Error fetching clerks:", err);
        return [];
    }
};

export const defineClerk = async (newClerkAddress: string): Promise<void> => {
    if (!ethers.isAddress(newClerkAddress)) {
        throw new Error("Invalid Ethereum address provided.");
    }
    
    try {
        const signer = await provider.getSigner();
        const contractWithSigner = contract.connect(signer);

        console.log(`Sending transaction to define ${newClerkAddress} as a clerk...`);
        const tx = await contractWithSigner.defineClerk(newClerkAddress);
        await tx.wait(); 
        console.log("Clerk defined successfully!");
    } catch (err) {
        console.error("Failed to define clerk:", err);
        throw err;
    }
};

export const getQualifiedVoters = async (): Promise<string[]> => {
    console.log("Fetching qualified voters...");
    try {
        const filter = contract.filters.VoterQualified();
        const logs = await contract.queryFilter(filter);
        const voterAddresses = new Set(logs.map(log => log.args.voterAddress));
        return Array.from(voterAddresses);
    } catch (err) {
        console.error("Error fetching qualified voters:", err);
        return []; 
    }
};

export const qualifyVoter = async (newVoterAddress: string): Promise<void> => {
    if (!ethers.isAddress(newVoterAddress)) {
        throw new Error("Invalid Ethereum address provided.");
    }
    console.log(`Attempting to qualify voter: ${newVoterAddress}`);
    try {
        const signer = await provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        console.log("Sending transaction to qualify voter...");
        const tx = await contractWithSigner.qualifyVoter(newVoterAddress);
        await tx.wait();     
        console.log("Voter qualified successfully!");
    } catch (err) {
        console.error("Failed to qualify voter:", err);
        throw err;
    }
};

export const verifyClerk = async (userAddress: string): Promise<boolean> => {
    console.log(`Verifying clerk status for ${userAddress}...`);
    try {
        // Call the public 'isClerk' mapping/getter function from the contract
        const isClerk = await contract.isClerk(userAddress);
        return isClerk;
    } catch (err) {
        console.error("Error verifying clerk status:", err);
        // In case of an error, it's safer to assume the user is not a clerk.
        return false;
    }
};
