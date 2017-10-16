var GetWhitelist = artifacts.require("./GetWhitelist.sol");
var GetCrowdsale = artifacts.require("./GetCrowdsale.sol");
var GetToken = artifacts.require("./GetToken.sol");
var testUtils = require('../util/tests.js');
var constants = require('../constants.js');
const value = web3.toWei(0.1, 'ether');;
const whitelistedValue = web3.toWei(1, 'ether');
const tokenCount = value * 10**18 / constants.pricingStrategy.PRESALE_PRICE_WEI;


contract('GetCrowdsale', function(accounts) {
    it("whitelisted presale should be able to buy", async function() {
        let whitelist = await GetWhitelist.deployed();
        let crowdsale = await GetCrowdsale.deployed();
        await whitelist.accept(accounts[0], whitelistedValue, true, {from: accounts[0]});
        await crowdsale.buy({value: value, from: accounts[0]});
    });
    
    it("whitelisted on sale should not be able to buy", async function(){
        let whitelist = await GetWhitelist.deployed();
        let crowdsale = await GetCrowdsale.deployed();
        await whitelist.accept(accounts[2], whitelistedValue, false, {from: accounts[0]});
        try {    
            await crowdsale.buy({value: value, from: accounts[0]});
        } catch (error) {
            return true;
        } 
        throw new Error("Whitelisted in sale bought during presale");
    })

    it("Correct data in crowdsale", async function() {

        let crowdsale = await GetCrowdsale.deployed();
        let investors = await crowdsale.investorCount.call();
        assert.equal(investors.valueOf(), 1, "1 wasn't the investor count");
        let tokensSold = await crowdsale.tokensSold.call();
        let tokenAmount = await crowdsale.tokenAmountOf(accounts[0]);
        assert.equal(tokenAmount.valueOf(), tokenCount, "Incorrect token count");
        assert.equal(tokensSold.valueOf(), tokenCount, "Incorrect total token count");
        
    });

    it("correct balance after buy", async function(){
        let token = await GetToken.deployed();
        let balance = await token.balanceOf.call(accounts[0]);
        assert.equal(
            balance.valueOf(),
            10000000000 * 10**18 / constants.pricingStrategy.PRESALE_PRICE_WEI,
            "Incorrect balance"
        );
    });
    
    it("whitelisted amount correct", async function(){
        let whitelist = await GetWhitelist.deployed();
        let entry = await whitelist.entries.call(accounts[0]);
        assert.equal(
            entry[0].valueOf(),
            whitelistedValue - value,
            "Incorrect whitelist amount"
        );
    });

    it("cannot buy more than whitelisted", async function(){
        let crowdsale = await GetCrowdsale.deployed();
        try {    
            await crowdsale.buy({value: whitelistedValue - value + 10, from: accounts[0]});
        } catch (error) {
            return true;
        }
        throw new Error("Whitelisted bought more than whitelisted");
    });

    it("non whitelisted should not be able to buy", async function() {
        let crowdsale = await GetCrowdsale.deployed();
        try {    
            await crowdsale.buy({value: value, from: accounts[1]});
        } catch (error) {
            return true;
        }
        throw new Error("Non-whitelisted bought");
    });


    it("can buy for another whitelisted", async function() {
        let crowdsale = await GetCrowdsale.deployed();
        let whitelist = await GetWhitelist.deployed();
        let investedBefore = await crowdsale.weiRaised();
        await whitelist.accept(accounts[2], whitelistedValue, true, {from: accounts[0]});
        await crowdsale.invest(accounts[2], {value: value, from: accounts[1]});
        let invested = await crowdsale.weiRaised();
        assert.equal(invested.valueOf(), parseInt(investedBefore.valueOf()) + value, "Incorrect investment amount in contract");
    });


    it("crowdsale should go to funding state", async function() {
        let crowdsale = await GetCrowdsale.deployed();
        let state = await crowdsale.getState.call();
        let whitelist = await GetWhitelist.deployed();
        assert.equal(state.valueOf(), 2);
        console.log(testUtils.now());
        await testUtils.timeTravel(constants.crowdsale.START - testUtils.now() + 1000);
        console.log(testUtils.now());
        await whitelist.accept(accounts[2], whitelistedValue, false, {from: accounts[0]}); // One transaction is needed to have a new block in testrpc
        state = await crowdsale.getState.call();
        assert.equal(state.valueOf(), 3);

    });

    it("Whitelisted for early cannot buy now", async function() {
        let crowdsale = await GetCrowdsale.deployed();
        try {
            await crowdsale.buy({value: value, from: accounts[0]});
        } catch (error) {
            return true;
        }
        throw new Error("Whitelisted for presale bought");
    });

});