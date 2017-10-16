const GetToken = artifacts.require("./GetToken.sol");
const GetWhitelist = artifacts.require("./GetWhitelist.sol");
const constants = require('../constants.js');


module.exports = function(deployer) {
    deployer.deploy(GetToken)
    deployer.deploy(
        GetWhitelist,
        constants.whitelist.presaleCap,
        constants.whitelist.tier1Cap,
        constants.whitelist.tier2Cap,
        constants.whitelist.tier3Cap,
        constants.whitelist.tier4Cap
    )
};