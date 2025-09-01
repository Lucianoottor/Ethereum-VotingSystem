import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import VotingPage from './pages/VotingPage';
import StatusPage from './pages/StatusPage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';


import { 
  getCandidates, 
  castVote, 
  checkUserStatus, 
  UserStatus,
  verifyAdmin,
  verifyClerk
} from './services/blockchain';
import ClerkPage from './pages/ClerkPage';


type AppStatus = 'loading' | 'login' | 'voting' | 'notQualified' | 'alreadyVoted' | 'success' | 'adm' | 'clerk';


interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

const App: React.FC = () => {

  const [appStatus, setAppStatus] = useState<AppStatus>('loading');
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedCandidates = await getCandidates();
        setCandidates(fetchedCandidates);
        setAppStatus('login'); 
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
        setError("Could not load candidate data from the blockchain.");
      }
    };
    fetchInitialData();
  }, []); 

  
  const handleLoginSuccess = async (address: string) => {
    setUserAddress(address);
    setError(null);
    
    try {
      const isAdmin = await verifyAdmin(address);
      if (isAdmin) {
        setAppStatus('adm');
        return; 
      }
	  const isClerk = await verifyClerk(address);
      if (isClerk) {
        setAppStatus('clerk');
        return;
      }
	  
      const status: UserStatus = await checkUserStatus(address);
      if (status.hasVoted) {
        setAppStatus('alreadyVoted');
      } else if (!status.canVote) {
        setAppStatus('notQualified');
      } else {
        setAppStatus('voting'); 
      }
    } catch (err) {
      console.error("Failed to check user status:", err);
      setError("Could not verify your voting eligibility.");
    }
  };

  const handleVote = async (candidateId: number) => {
    if (!userAddress) {
      setError("Wallet is not connected.");
      return;
    }
    try {
      await castVote(candidateId);
      setAppStatus('success'); 
    } catch (err: any) {
      console.error("Voting transaction failed:", err);
      setError(err.message || "An error occurred during the vote.");
    }
  };


  const renderContent = () => {
    switch (appStatus) {
      case 'loading':
        return <div className="text-center p-10 text-xl">Loading Election Data...</div>;
      
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;

      case 'voting':
        return (
          <VotingPage
            userAddress={userAddress || ''}
            candidates={candidates}
            onVote={handleVote}
          />
        );

      case 'notQualified':
        return <StatusPage status="notQualified" />;

      case 'alreadyVoted':
        return <StatusPage status="alreadyVoted" />;
        
      case 'success':
        return <SuccessPage />;

	  case 'adm':
		return <AdminPage />;
	  case 'clerk':
		return <ClerkPage />;

      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div>
      {renderContent()}
      
      {error && (
        <div 
          className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-xl animate-pulse cursor-pointer"
          onClick={() => setError(null)} 
        >
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default App;