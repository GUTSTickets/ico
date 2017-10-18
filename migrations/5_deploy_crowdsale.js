const GetPricingStrategy = artifacts.require("./GetPricingStrategy.sol");
const GetToken = artifacts.require("./GetToken.sol");
const GetCrowdsale = artifacts.require("./GetCrowdsale.sol");
const GetPreFinalizeAgent = artifacts.require("./GetPreFinalizeAgent.sol");
const GetWhitelist = artifacts.require('./GetWhitelist.sol');
const GetFinalizeAgent = artifacts.require('./GetFinalizeAgent.sol');
const constants = require('../constants.js');


module.exports = function(deployer) {    
    deployer.deploy(
        GetPricingStrategy,
        GetWhitelist.address,
        constants.pricingStrategy.TRANCHES
    ).then(() => {
        return deployer.deploy(
            GetCrowdsale,
            constants.crowdsale.LOCKTIME,
            GetPreFinalizeAgent.address,
    
            GetToken.address,
            GetPricingStrategy.address,
            constants.multisig.MAINADDRESS,
            
            constants.crowdsale.START,
            constants.crowdsale.END,
            constants.crowdsale.MINIMUM_WEI_FUNDING_GOAL,
            constants.crowdsale.MAXIMUM_SELLABLE_TOKENS
        );
    }).then(() => {
        return deployer.deploy(
            GetFinalizeAgent,
            GetToken.address,
            GetCrowdsale.address,
            constants.multisig.USERGROWTHADDRESS,
            constants.multisig.STABILITYADDRESS,
            constants.multisig.BOUNTYADDRESS
        );
    }).then(() => {
        return GetPricingStrategy.deployed();
    }).then((pricingStrategy) => {
        return pricingStrategy.setCrowdsale(GetCrowdsale.address);
    }).then(() => {
        return GetCrowdsale.deployed();
    }).then((crowdsale) => {
        return crowdsale.setFinalizeAgent(
            GetFinalizeAgent.address);
    }).then(() => {
        return GetToken.deployed();
    }).then((token) => {
        return Promise.all([
            token.setMintAgent(GetCrowdsale.address, true),
            token.setMintAgent(GetFinalizeAgent.address, true),
            token.setReleaseAgent(GetFinalizeAgent.address)
        ])
    }).then(() => {
        return GetWhitelist.deployed();
    }).then((whitelist) => {
        return whitelist.setWhitelister(GetPricingStrategy.address, true);
    }).then(() => {
        return GetPreFinalizeAgent.deployed();
    }).then((prefinalizeagent) => {
        return prefinalizeagent.setCrowdsale(GetCrowdsale.address);
    });
};
