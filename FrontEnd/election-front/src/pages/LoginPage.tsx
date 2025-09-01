import React, { useState } from 'react';
import { connectWallet } from '../services/blockchain';
// Define the props for the component.
// For now, we'll anticipate a function to handle the connect wallet action.
interface LoginPageProps{
    onLoginSuccess: (address: string) => void;
}
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        setError(null);
        try{
            const address = await connectWallet();
            console.log("Wallet connected: ", address);
            onLoginSuccess(address);
        } catch (err:any){
            console.log(err.msg);
            console.log("Unnable to connect");
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Blockchain Election System
          </h1>
          <p className="text-gray-600 mb-8">
            Please connect your MetaMask wallet to proceed.
          </p>
          <button
            onClick={handleConnect}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center mx-auto"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              ></path>
            </svg>
            Connect with MetaMask
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
