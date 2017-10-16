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
    });
};
