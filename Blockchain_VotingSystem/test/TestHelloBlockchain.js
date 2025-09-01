// Import the contract artifact
const Ballot = artifacts.require("/Users/lucianootto/Desktop/VS Code/Blockchain_VotingSystem/contracts/Election.sol");

// Truffle test suite
contract("Ballot", (accounts) => {

    // Define accounts for different roles to make tests readable
    const adm = accounts[0];
    const clerk = accounts[1];
    const voter1 = accounts[2];
    const voter2 = accounts[3];
    const stranger = accounts[4]; // An unauthorized account

    let ballotInstance;
    const candidateNames = ["Candidate A", "Candidate B"];

    // Deploy a new contract instance before each test
    beforeEach(async () => {
        ballotInstance = await Ballot.new(candidateNames, { from: adm });
    });

    // Test Suite for Initialization
    describe("Initialization", () => {
        it("should initialize with the correct candidates", async () => {
            const candidateA = await ballotInstance.candidates(0);
            assert.equal(candidateA.name, "Candidate A", "Candidate A was not initialized correctly.");
            assert.equal(candidateA.voteCount, 0, "Candidate A vote count should be 0.");

            const candidateB = await ballotInstance.candidates(1);
            assert.equal(candidateB.name, "Candidate B", "Candidate B was not initialized correctly.");
            assert.equal(candidateB.voteCount, 0, "Candidate B vote count should be 0.");
        });

        it("should set the contract deployer as the administrator", async () => {
            const contractAdm = await ballotInstance.adm();
            assert.equal(contractAdm, adm, "The administrator was not set correctly.");
        });
    });

    // Test Suite for Role Management
    describe("Role Management", () => {
        it("should allow the administrator to define a clerk", async () => {
            await ballotInstance.defineClerk(clerk, { from: adm });
            const isClerk = await ballotInstance.isClerk(clerk);
            assert.isTrue(isClerk, "The address should be a clerk.");
        });

        it("should NOT allow a non-administrator to define a clerk", async () => {
            try {
                await ballotInstance.defineClerk(clerk, { from: stranger });
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "Only the administrator can perform this action.", "Error message should contain revert reason.");
            }
        });

        it("should allow a clerk to qualify a voter", async () => {
            await ballotInstance.defineClerk(clerk, { from: adm }); // Arrange
            await ballotInstance.qualifyVoter(voter1, { from: clerk }); // Act
            const hasRightToVote = await ballotInstance.rightToVote(voter1); // Assert
            assert.isTrue(hasRightToVote, "The voter should have the right to vote.");
        });

        it("should NOT allow a non-clerk to qualify a voter", async () => {
            try {
                await ballotInstance.qualifyVoter(voter1, { from: stranger });
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "Only a clerk can perform this action.", "Error message should contain revert reason.");
            }
        });
    });

    // Test Suite for Voting Logic
    describe("Voting Logic", () => {
        // Setup: define a clerk and qualify a voter before each voting test
        beforeEach(async () => {
            await ballotInstance.defineClerk(clerk, { from: adm });
            await ballotInstance.qualifyVoter(voter1, { from: clerk });
        });

        it("should allow a qualified voter to cast a vote", async () => {
            const candidateId = 0; // Vote for Candidate A
            const tx = await ballotInstance.vote(candidateId, { from: voter1 });

            // 1. Check if the vote count increased
            const candidate = await ballotInstance.candidates(candidateId);
            assert.equal(candidate.voteCount, 1, "The candidate's vote count should be 1.");

            // 2. Check if the voter's status is updated
            const hasVoted = await ballotInstance.hasVoted(voter1);
            assert.isTrue(hasVoted, "The voter's status should be marked as voted.");

            // 3. (Optional but good practice) Check for the event
            assert.equal(tx.logs[0].event, "Voted", "The Voted event should be emitted.");
            assert.equal(tx.logs[0].args.voterAddress, voter1, "The event should log the correct voter address.");
        });

        it("should NOT allow a voter to vote twice", async () => {
            await ballotInstance.vote(0, { from: voter1 }); // First vote
            try {
                await ballotInstance.vote(1, { from: voter1 }); // Second vote
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "Voter has already cast their vote.", "Error message should prevent double voting.");
            }
        });

        it("should NOT allow an unqualified voter to vote", async () => {
            try {
                await ballotInstance.vote(0, { from: stranger });
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "Voter does not have the right to vote.", "Error message should prevent unqualified voting.");
            }
        });

        it("should NOT allow a vote for an invalid candidate", async () => {
            try {
                await ballotInstance.vote(99, { from: voter1 }); // Invalid ID
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "Invalid candidate ID.", "Error message should prevent voting for non-existent candidates.");
            }
        });
    });
});
