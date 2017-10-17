const GetToken = artifacts.require("./GetToken.sol");
const GetPreCrowdsale = artifacts.require("./GetPreCrowdsale.sol");
const GetPreFinalizeAgent = artifacts.require("./GetPreFinalizeAgent.sol");
const GetPrePricingStrategy = artifacts.require("./GetPrePricingStrategy.sol");
const GetWhitelist = artifacts.require('./GetWhitelist.sol');
const constants = require('../constants.js');


module.exports = function(deployer) {    
    deployer.deploy(
        GetPrePricingStrategy,
        GetWhitelist.address,
        constants.pricingStrategy.PRESALE_PRICE_WEI
    ).then(() => {
        return deployer.deploy(
            GetPreCrowdsale,
    
            GetToken.address,
            GetPrePricingStrategy.address,
            constants.multisig.MAINADDRESS,
            
            constants.precrowdsale.START,
            constants.precrowdsale.END,
            constants.precrowdsale.PRESALE_TOKEN_CAP
        );
    }).then(() => {
        return deployer.deploy(
            GetPreFinalizeAgent,
            GetPreCrowdsale.address
        );
    }).then(() => {
        return GetPreCrowdsale.deployed();
    }).then((precrowdsale) => {
        return precrowdsale.setFinalizeAgent(
            GetPreFinalizeAgent.address, {from: web3.eth.accounts[0]});
    }).then(() => {
        return GetToken.deployed();
    }).then((token) => {
        return token.setMintAgent(GetPreCrowdsale.address, true, {from: web3.eth.accounts[0]});
    }).then(() => {
        return GetWhitelist.deployed();
    }).then((whitelist) => {
        return whitelist.setWhitelister(GetPrePricingStrategy.address, true);
    });
};
