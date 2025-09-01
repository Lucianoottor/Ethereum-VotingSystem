// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Ballot {

    address public adm;

    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public isClerk;
    mapping(address => bool) public rightToVote;
    mapping(address => bool) public hasVoted;

    // --- Events ---
    event ClerkDefined(address indexed clerkAddress);
    event VoterQualified(address indexed voterAddress);
    event Voted(address indexed voterAddress, uint indexed candidateId);

    // --- Constructor ---
    // Runs only once when the contract is deployed.
    // Initializes candidates and sets the administrator.
    constructor(string[] memory _candidateNames) {
        adm = msg.sender;
        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
    }

    // --- Modifiers ---
    modifier onlyAdm() {
        require(msg.sender == adm, "Only the administrator can perform this action.");
        _;
    }

    modifier onlyClerk() {
        require(isClerk[msg.sender], "Only a clerk can perform this action.");
        _;
    }

    // --- Functions ---
    /**
     * @notice Allows the administrator to authorize a new clerk.
     * @param _newClerk The address of the new clerk.
     */
    function defineClerk(address _newClerk) public onlyAdm {
        isClerk[_newClerk] = true;
        emit ClerkDefined(_newClerk);
    }

    /**
     * @notice Allows a clerk to grant an address the right to vote.
     * @param _voterAddress The address of the voter to qualify.
     */
    function qualifyVoter(address _voterAddress) public onlyClerk {
        rightToVote[_voterAddress] = true;
        emit VoterQualified(_voterAddress);
    }

    /**
     * @notice Allows a qualified voter to cast their vote.
     * @param _candidateId The ID (index) of the candidate to vote for.
     */
    function vote(uint _candidateId) public {
        // 1. Check voter eligibility
        require(rightToVote[msg.sender], "Voter does not have the right to vote.");
        require(!hasVoted[msg.sender], "Voter has already cast their vote.");

        // 3. Update state
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        // 4. Emit an event
        emit Voted(msg.sender, _candidateId);
    }

    function getCandidates() public view returns(Candidate[] memory) {
        return candidates;
    }
}
