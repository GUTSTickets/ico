const GetPricingStrategy = artifacts.require('./GetPricingStrategy.sol');
const GetPrePricingStrategy = artifacts.require('./GetPrePricingStrategy.sol');
const GetToken = artifacts.require('./GetToken.sol');
const GetCrowdsale = artifacts.require('./GetCrowdsale.sol');
const GetPreCrowdsale = artifacts.require('./GetPreCrowdsale.sol');
const SafeMathLib = artifacts.require('./token_market_net/SafeMathLib.sol');
const GetFinalizeAgent = artifacts.require('./GetFinalizeAgent.sol');
const GetWhitelist = artifacts.require("./GetWhitelist.sol");


module.exports = function(deployer) {
    deployer.deploy(SafeMathLib);
    deployer.link(
        SafeMathLib, 
        [GetPrePricingStrategy, GetPricingStrategy, GetToken, GetCrowdsale, GetPreCrowdsale, GetFinalizeAgent, GetWhitelist]
    );
};
