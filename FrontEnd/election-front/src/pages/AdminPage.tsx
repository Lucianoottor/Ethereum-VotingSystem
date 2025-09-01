import React, { useState, useEffect } from 'react';
import { defineClerk, getClerks } from '../services/blockchain';

const AdminPage: React.FC = () => {
  const [clerks, setClerks] = useState<string[]>([]);
  const [newClerkAddress, setNewClerkAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchClerks = async () => {
    const clerkList = await getClerks();
    setClerks(clerkList);
  };

  
  useEffect(() => {
    fetchClerks();
  }, []);

  const handleAddClerk = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await defineClerk(newClerkAddress);
      setNewClerkAddress(''); 
      await fetchClerks(); 
    } catch (err: any) {
      setError(err.message || "Failed to add clerk. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          

          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Admin Panel</h1>

          <form onSubmit={handleAddClerk} className="mb-10 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-2xl font-semibold mb-4">Authorize a New Clerk</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newClerkAddress}
                onChange={(e) => setNewClerkAddress(e.target.value)}
                placeholder="Enter new clerk's Ethereum address"
                className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-400"
              >
                {isLoading ? 'Authorizing...' : 'Authorize Clerk'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Authorized Clerks</h2>
            {clerks.length > 0 ? (
              <ul className="space-y-3">
                {clerks.map((clerk, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded-lg font-mono text-gray-700 text-sm">
                    {clerk}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No clerks have been authorized yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
