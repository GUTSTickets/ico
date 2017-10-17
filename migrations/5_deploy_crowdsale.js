const GetPricingStrategy = artifacts.require("./GetPricingStrategy.sol");
const GetToken = artifacts.require("./GetToken.sol");
const GetCrowdsale = artifacts.require("./GetCrowdsale.sol");
const GetPreCrowdsale = artifacts.require("./GetPreCrowdsale.sol");
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
            GetPreCrowdsale.address,
    
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
        return GetCrowdsale.deployed();
    }).then((crowdsale) => {
        return crowdsale.setFinalizeAgent(
            GetFinalizeAgent.address, {from: web3.eth.accounts[0]});
    }).then(() => {
        return GetToken.deployed();
    }).then((token) => {
        return Promise.all([
            token.setMintAgent(GetCrowdsale.address, true, {from: web3.eth.accounts[0]}),
            token.setMintAgent(GetFinalizeAgent.address, true, {from: web3.eth.accounts[0]}),
            token.setReleaseAgent(GetFinalizeAgent.address, {from: web3.eth.accounts[0]})
        ])
    }).then(() => {
        return GetWhitelist.deployed();
    }).then((whitelist) => {
        return whitelist.setWhitelister(GetPricingStrategy.address, true);
    });;
};
