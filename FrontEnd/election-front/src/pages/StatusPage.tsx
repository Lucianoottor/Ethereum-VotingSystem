import React from 'react';

// Define the possible statuses a user can have.
type UserStatus = 'notQualified' | 'alreadyVoted';

// Define the props for the component.
interface StatusPageProps {
  status: UserStatus;
}

// Data mapping for different statuses to keep the component clean.
const statusDetails = {
  notQualified: {
    icon: (
      <svg
        className="w-16 h-16 text-red-500 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        ></path>
      </svg>
    ),
    title: "Not Qualified to Vote",
    titleColor: "text-red-600",
    message: "Your connected wallet address does not have the right to vote in this election. Please contact the administrator if you believe this is an error.",
  },
  alreadyVoted: {
    icon: (
      <svg
        className="w-16 h-16 text-blue-500 mx-auto mb-4"
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
    ),
    title: "You Have Already Voted",
    titleColor: "text-blue-600",
    message: "Our records show that a vote has already been cast from this wallet address. Each address is only permitted to vote once.",
  },
};

const StatusPage: React.FC<StatusPageProps> = ({ status }) => {
  const details = statusDetails[status];

  // If the status prop is invalid or not provided, render nothing to prevent a crash.
  if (!details) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          {details.icon}
          <h1 className={`text-3xl font-bold ${details.titleColor} mb-4`}>
            {details.title}
          </h1>
          <p className="text-gray-600">{details.message}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;

