import React from 'react';

// --- TYPE DEFINITIONS ---
// This defines what a "candidate" object looks like.
interface Candidate {
  name: string;
  // In a real app, you might also have an ID, image URL, etc.
}

// This defines the props our VotingPage component will accept.
interface VotingPageProps {
  userAddress: string;
  candidates: Candidate[];
  onVote: (candidateId: number) => void;
}


// --- COMPONENT: CandidateCard ---
// A smaller, reusable component for displaying a single candidate.
// It's good practice to break down UIs into smaller components like this.
const CandidateCard: React.FC<{ candidate: Candidate; candidateId: number; onVote: (id: number) => void; }> = ({ candidate, candidateId, onVote }) => {
  return (
    <div className="card bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:-translate-y-1">
      <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mb-4">
        <span className="text-4xl font-bold text-gray-600">
          {candidate.name.charAt(0)}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 h-14 flex items-center">
        {candidate.name}
      </h3>
      <button 
        onClick={() => onVote(candidateId)}
        className="vote-btn w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-lg transition duration-300 ease-in-out"
      >
        Vote
      </button>
    </div>
  );
};


// --- COMPONENT: VotingPage ---
// The main component for this file.
const VotingPage: React.FC<VotingPageProps> = ({ userAddress, candidates, onVote }) => {
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="w-full max-w-4xl mx-auto p-4">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Cast Your Vote</h1>
          <p className="text-gray-600 mt-2">Select a candidate below to submit your choice.</p>
          <p className="text-sm text-gray-500 mt-4 bg-gray-200 inline-block px-3 py-1 rounded-full">
            Your address: <span className="font-mono font-semibold">{userAddress}</span>
          </p>
        </div>

        {/* Candidates Grid */}
        {candidates && candidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.map((candidate, index) => (
              <CandidateCard 
                key={index} 
                candidate={candidate} 
                candidateId={index}
                onVote={onVote} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <p className="text-gray-600">No candidates are available for this election at the moment.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default VotingPage;
