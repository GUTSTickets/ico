var GetWhitelist = artifacts.require("./GetWhitelist.sol");
var GetPreCrowdsale = artifacts.require("./GetPreCrowdsale.sol");
var GetCrowdsale = artifacts.require("./GetCrowdsale.sol");
var GetToken = artifacts.require("./GetToken.sol");
var constants = require('../constants.js');
const fullAmount = constants.precrowdsale.PRESALE_TOKEN_CAP / 10**18 * constants.pricingStrategy.PRESALE_PRICE_WEI;


contract('GetPreCrowdsale', function(accounts) {
    it("whitelisted presale should be able to buy", async function() {
        const whitelist = await GetWhitelist.deployed();
        const precrowdsale = await GetPreCrowdsale.deployed();
        await whitelist.setWhitelister(accounts[0], true);

        await whitelist.accept(accounts[0], true);
        
        await precrowdsale.buy({value: fullAmount, from: accounts[0]});
    });

    it("whitelisted sale should not be able to buy", async function() {
        const whitelist = await GetWhitelist.deployed();
        const precrowdsale = await GetPreCrowdsale.deployed();

        await whitelist.accept(accounts[1], false);
        try{
            await precrowdsale.buy({value: 100, from: accounts[1]});
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("whitelisted in sale bought coins");
    });
    
    it("correct token amount", async function(){
        const token = await GetToken.deployed();
        const balance = await token.balanceOf.call(accounts[0]); 
        assert.equal(balance.valueOf(), constants.precrowdsale.PRESALE_TOKEN_CAP);
    })

    it("Correct data in precrowdsale", async function() {
        const precrowdsale = await GetPreCrowdsale.deployed();
        const investorCount = await precrowdsale.investorCount.call();
        assert.equal(investorCount.valueOf(), 1, "1 wasn't the investor count");
        const tokensSold = await precrowdsale.tokensSold.call();
        const tokenAmount = await precrowdsale.tokenAmountOf(accounts[0]);
        const tokenCount = constants.precrowdsale.PRESALE_TOKEN_CAP;
        assert.equal(tokenAmount.valueOf(), tokenCount, "Incorrect token count");
        assert.equal(tokensSold.valueOf(), tokenCount, "Incorrect total token count");
    });

    it("precrowdsale is full", async function() {
        const precrowdsale = await GetPreCrowdsale.deployed();
        const full = await precrowdsale.isCrowdsaleFull();
        const state = await precrowdsale.getState();
        assert.equal(state.valueOf(), 4, "Not in success state");
        assert.equal(full, true, "Not full");
    });

    it("cannot buy in full precrowdsale", async function() {
        const precrowdsale = await GetPreCrowdsale.deployed();
        try{
            await precrowdsale.buy({value: 100, from: accounts[0]});
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Bought in full");
    });

    it("cannot finalize from a non owner", async function() {
        const precrowdsale = await GetPreCrowdsale.deployed();
        try{
            await precrowdsale.finalize({from: accounts[1]});
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("non owner finalized");
    });


    it("owner can finalize", async function() {
        const precrowdsale = await GetPreCrowdsale.deployed();
        const state = await precrowdsale.getState();
        await precrowdsale.finalize({from: accounts[0]});
    });

    it("crowdsale is updated", async function() {
        const precrowdsale = await GetPreCrowdsale.deployed();
        const crowdsale = await GetCrowdsale.deployed();
        const crowdsaleTokens = await crowdsale.tokensSold();
        const precrowdsaleTokens = await precrowdsale.tokensSold();
        assert.equal(crowdsaleTokens.valueOf(), precrowdsaleTokens.valueOf(), "Incorrect tokensSold");
        assert.equal(crowdsaleTokens.valueOf(), constants.precrowdsale.PRESALE_TOKEN_CAP, "Incorrect tokensSold")
        
        const crowdsaleWeiRaised = await crowdsale.weiRaised();
        const precrowdsaleWeiRaised = await precrowdsale.weiRaised();
        assert.equal(crowdsaleWeiRaised.valueOf(), precrowdsaleWeiRaised.valueOf(), "Incorrect weiRaised");
        assert.equal(precrowdsaleWeiRaised.valueOf(), fullAmount, "Incorrect weiRaised")
        

        const crowdsalePresaleWeiRaised = await crowdsale.presaleWeiRaised();
        assert.equal(crowdsalePresaleWeiRaised.valueOf(), precrowdsaleWeiRaised.valueOf(), "Incorrect presaleweiRaised");
        
    });

});