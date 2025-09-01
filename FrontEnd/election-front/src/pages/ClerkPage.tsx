import React, { useState, useEffect } from 'react';
import { qualifyVoter, getQualifiedVoters } from '../services/blockchain';

const ClerkPage: React.FC = () => {
  const [voters, setVoters] = useState<string[]>([]);
  const [newVoterAddress, setNewVoterAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch and update the list of qualified voters
  const fetchVoters = async () => {
    const voterList = await getQualifiedVoters();
    setVoters(voterList);
  };

  // Fetch the initial list of voters when the component loads
  useEffect(() => {
    fetchVoters();
  }, []);

  const handleQualifyVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await qualifyVoter(newVoterAddress);
      setNewVoterAddress(''); // Clear input on success
      await fetchVoters(); // Refresh the list to show the new voter
    } catch (err: any) {
      setError(err.message || "Failed to qualify voter. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          
          {/* Header */}
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Clerk Panel</h1>

          {/* Form to qualify a new voter */}
          <form onSubmit={handleQualifyVoter} className="mb-10 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-2xl font-semibold mb-4">Qualify a New Voter</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newVoterAddress}
                onChange={(e) => setNewVoterAddress(e.target.value)}
                placeholder="Enter new voter's Ethereum address"
                className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-400"
              >
                {isLoading ? 'Qualifying...' : 'Qualify Voter'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>

          {/* List of existing qualified voters */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Qualified Voters</h2>
            {voters.length > 0 ? (
              <ul className="space-y-3">
                {voters.map((voter, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded-lg font-mono text-gray-700 text-sm">
                    {voter}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No voters have been qualified yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkPage;
