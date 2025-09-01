import React, { useState, useEffect } from 'react';
import { getCandidates, Candidate } from '../services/blockchain';

const SuccessPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const fetchedCandidates = await getCandidates();
        setCandidates(fetchedCandidates);
      } catch (err) {
        setError("Could not fetch voting results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-2xl mx-auto p-4">
        {/* Success Message Card */}
        <div className="text-center bg-white p-8 rounded-xl shadow-lg mb-8">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Obrigado!</h1>
          <p className="text-gray-600">
            Seu voto foi registrado com sucesso na blockchain.
          </p>
        </div>

        {/* Voting Results Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Resultados Atuais</h2>
          {loading ? (
            <p className="text-center text-gray-500">Carregando resultados...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-700">{candidate.name}</span>
                    <span className="text-sm font-bold text-gray-600">
                      {candidate.voteCount} Voto(s)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
