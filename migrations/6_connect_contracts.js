const GetToken = artifacts.require("./GetToken.sol");
const GetCrowdsale = artifacts.require("./GetCrowdsale.sol");
const GetFinalizeAgent = artifacts.require("./GetFinalizeAgent.sol");
const GetWhitelist = artifacts.require('./GetWhitelist.sol');
const GetPreCrowdsale = artifacts.require('./GetPreCrowdsale.sol');
const constants = require('../constants.js');


module.exports = function(deployer) {

    deployer.then(() => {
        return Promise.all([
            GetCrowdsale.deployed().then((crowdsale) => {
                return crowdsale.setFinalizeAgent(GetFinalizeAgent.address, {from: web3.eth.accounts[0]});    
            }),
            GetWhitelist.deployed().then((whitelist) => {
                let whitelisters = constants.whitelist.WHITELISTERS;
                whitelisters.push(GetCrowdsale.address)
                whitelisters.push(GetPreCrowdsale.address);
                return Promise.all(whitelisters.map((address) => {
                    whitelist.setWhitelister(address, true);  
                }))
            }),
            GetToken.deployed().then((token) => {
                return Promise.all([
                    token.setMintAgent(GetFinalizeAgent.address, true, {from: web3.eth.accounts[0]}),
                    token.setMintAgent(GetCrowdsale.address, true, {from: web3.eth.accounts[0]}),
                    token.setMintAgent(GetPreCrowdsale.address, true, {from: web3.eth.accounts[0]}),
                    token.setReleaseAgent(GetFinalizeAgent.address, {from: web3.eth.accounts[0]})
                ])
            }),
        ]);
    });
};