var contract = artifacts.require("/Users/lucianootto/Desktop/VS Code/Voting/Blockchain_VotingSystem/contracts/Ballot");
const candidateNames = ["Bolsonaro", "Ciro", "Lula"];

module.exports = function(deployer) {
  deployer.deploy(contract, candidateNames);
}