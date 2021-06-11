const RecycoinFunds = artifacts.require("RecycoinFunds");

module.exports = function(deployer) {
    deployer.deploy(RecycoinFunds);
};