const GetWhitelist = artifacts.require("./GetWhitelist.sol");
const GetCrowdsale = artifacts.require("./GetCrowdsale.sol");
const GetPricingStrategy = artifacts.require("./GetPricingStrategy.sol");
const GetToken = artifacts.require("./GetToken.sol");
const testUtils = require('../util/tests.js');
const constants = require('../constants.js');
// assume that tiers have equal volume for simplicity
const tierVolume = constants.pricingStrategy.TRANCHES[2];


contract('GetCrowdsale', function(accounts) {
    it("pricing strategy starts at tier1", async function() {
        const pricingStrategy = await GetPricingStrategy.deployed();
        const tier = await pricingStrategy.getCurrentTrancheIndex(0);
        assert.equal(tier, 0, "Did not start at tier1");
    });

    it("whitelisted presale should be able to buy", async function() {
        const whitelist = await GetWhitelist.deployed();
        const crowdsale = await GetCrowdsale.deployed();
        await whitelist.setWhitelister(accounts[0], true);

        await whitelist.accept(accounts[0], true);
        await crowdsale.buy({value: tierVolume * 0.8, from: accounts[0]});
    });

    it("whitelist is updated properly", async function() {
        const whitelist = await GetWhitelist.deployed();

        const entry = await whitelist.entries(accounts[0]);
        assert.equal(
            entry[1].valueOf(),
            constants.whitelist.tier1Cap - tierVolume * 0.8,
            "Correct remaining in whitelist"
        );
    });

    it("whitelisted presale should not be able to buy more than his cap in tier1", async function() {
        
        const crowdsale = await GetCrowdsale.deployed();
        try{
            await crowdsale.buy({
                value: constants.whitelist.tier1Cap - tierVolume * 0.79,
                from: accounts[0]}
            );
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("bought more than cap");
    });

    it("whitelisted sale should be able to buy", async function() {
        const whitelist = await GetWhitelist.deployed();
        const precrowdsale = await GetCrowdsale.deployed();

        await whitelist.accept(accounts[1], false);
        await precrowdsale.buy({value: tierVolume * 0.4, from: accounts[1]});
    });
    

    it("tier1 token amount", async function(){
        const token = await GetToken.deployed();
        const balance1 = await token.balanceOf.call(accounts[0]);
        assert.equal(balance1.valueOf(), tierVolume * 0.8 / (constants.pricingStrategy.TRANCHES[1] / 10**18) );
    
        const balance2 = await token.balanceOf.call(accounts[1]);
        // Higher than tier limit transactions are given the lower limit price
        assert.equal(balance2.valueOf(), tierVolume * 0.4 / (constants.pricingStrategy.TRANCHES[1] / 10**18) );
    
    })

    it("pricing strategy is at tier2", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        const weiRaised = await crowdsale.weiRaised();
        const pricingStrategy = await GetPricingStrategy.deployed();
        const tier = await pricingStrategy.getCurrentTrancheIndex(weiRaised);
        assert.equal(tier, 1, "not at tier2");
    });

    it("Correct data in crowdsale", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        const investorCount = await crowdsale.investorCount.call();
        assert.equal(investorCount.valueOf(), 2, "2 wasn't the investor count");
        const tokensSold = await crowdsale.tokensSold.call();
        const tokenAmountOfFirst = await crowdsale.tokenAmountOf(accounts[0]);
        const tierTokenCount = tierVolume / (constants.pricingStrategy.TRANCHES[1] / 10**18);
        assert.equal(tokenAmountOfFirst.valueOf(), tierTokenCount*0.8, "Incorrect token count");
        assert.equal(tokensSold.valueOf(), tierTokenCount*1.2, "Incorrect total token count");
    });


    it("account can buy again", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        await crowdsale.buy({value: tierVolume, from: accounts[0]});
    });

    
    it("pricing strategy is at tier3", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        const weiRaised = await crowdsale.weiRaised();
        const pricingStrategy = await GetPricingStrategy.deployed();
        const tier = await pricingStrategy.getCurrentTrancheIndex(weiRaised);
        assert.equal(tier.valueOf(), 2, "not at tier3");
    });

    it("Correct data in crowdsale (after Tier2)", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        const investorCount = await crowdsale.investorCount.call();
        assert.equal(investorCount.valueOf(), 2, "2 wasn't the investor count");
        const tokensSold = await crowdsale.tokensSold.call();
        const tokenAmountOfFirst = await crowdsale.tokenAmountOf(accounts[0]);
        const tier1TokenCount = tierVolume / (constants.pricingStrategy.TRANCHES[1] / 10**18);
        const tier2TokenCount = tierVolume / (constants.pricingStrategy.TRANCHES[3] / 10**18);
        assert.equal(tokenAmountOfFirst.valueOf(), tier1TokenCount*0.8 + tier2TokenCount, "Incorrect token count");
        assert.equal(tokensSold.valueOf(), tier1TokenCount*1.2 + tier2TokenCount, "Incorrect total token count");
    });

    it("whitelist is updated properly (after Tier2)", async function() {
        const whitelist = await GetWhitelist.deployed();

        const entry = await whitelist.entries(accounts[0]);
        assert.equal(
            entry[2].valueOf(),
            constants.whitelist.tier2Cap - tierVolume,
            "Correct remaining in whitelist"
        );
    });

    it("account can buy again", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        await crowdsale.buy({value: tierVolume, from: accounts[1]});
    });

    it("pricing strategy is at tier4", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        const weiRaised = await crowdsale.weiRaised();
        const pricingStrategy = await GetPricingStrategy.deployed();
        const tier = await pricingStrategy.getCurrentTrancheIndex(weiRaised);
        assert.equal(tier.valueOf(), 3, "not at tier4");
    });

    it("Correct data in crowdsale (after Tier3)", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        const investorCount = await crowdsale.investorCount.call();
        assert.equal(investorCount.valueOf(), 2, "2 wasn't the investor count");
        const tokensSold = await crowdsale.tokensSold.call();
        const tokenAmountOfSecond = await crowdsale.tokenAmountOf(accounts[1]);
        const tier1TokenCount = tierVolume / (constants.pricingStrategy.TRANCHES[1] / 10**18);
        const tier2TokenCount = tierVolume / (constants.pricingStrategy.TRANCHES[3] / 10**18);
        const tier3TokenCount = tierVolume / (constants.pricingStrategy.TRANCHES[5] / 10**18);
        assert.equal(
            tokenAmountOfSecond.valueOf(),
            tier1TokenCount*0.4 + tier3TokenCount,
            "Incorrect token count"
        );
        assert.equal(
            tokensSold.valueOf(), 
            tier1TokenCount*1.2 + tier2TokenCount + tier3TokenCount,
            "Incorrect total token count"
        );
    });

    it("whitelist is updated properly (after Tier3)", async function() {
        const whitelist = await GetWhitelist.deployed();

        const entry = await whitelist.entries(accounts[1]);
        assert.equal(
            entry[3].valueOf(),
            constants.whitelist.tier3Cap - tierVolume,
            "Correct remaining in whitelist"
        );
    });

    it("Cannot buy over crowdsale limit", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        try{

            // this would get over the token limits
            await crowdsale.buy({value: tierVolume, from: accounts[0]});
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Bought above crowdsale limit");
    });

    it("Can buy rest of tokens and correct data in crowdsale", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        let tokensSold = await await crowdsale.tokensSold.call();
        remainingTokensTier4 = tokensSold.valueOf();
        const tier4TokenCount = constants.crowdsale.MAXIMUM_SELLABLE_TOKENS - tokensSold.valueOf();
        await crowdsale.buy({
            value: (tier4TokenCount / 10**18) * constants.pricingStrategy.TRANCHES[7],
            from: accounts[0]
        });
        const investorCount = await crowdsale.investorCount.call();
        assert.equal(investorCount.valueOf(), 2, "2 wasn't the investor count");
        tokensSold = await crowdsale.tokensSold.call();
        const tokenAmountOfFirst = await crowdsale.tokenAmountOf(accounts[0]);
        const tier1TokenCount = tierVolume / (constants.pricingStrategy.TRANCHES[1] / 10**18);
        const tier2TokenCount = tierVolume / (constants.pricingStrategy.TRANCHES[3] / 10**18);
        const tier3TokenCount = tierVolume / (constants.pricingStrategy.TRANCHES[5] / 10**18);
        
        assert.equal(
            tokenAmountOfFirst.valueOf(),
            tier1TokenCount*0.8 + tier2TokenCount + tier4TokenCount,
            "Incorrect token count"
        );
        assert.equal(
            tokensSold.valueOf(), 
            tier1TokenCount*1.2 + tier2TokenCount + tier3TokenCount + tier4TokenCount,
            "Incorrect total token count"
        );
    });
    
    it("crowdsale in success state", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        const state = await crowdsale.getState();
        assert.equal(state.valueOf(), 4, "Not in success state");
    });


    it("owner cant finalize yet", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        try{
            await crowdsale.finalize();
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Could finalize immediatelly");
    });

    // note : you have to restart testrpc after this test    
    it("owner can finalize after the locktime", async function() {
        const travelTime = constants.crowdsale.END + constants.crowdsale.LOCKTIME - testUtils.now() + 60*60;
        await testUtils.timeTravel(travelTime);
        const crowdsale = await GetCrowdsale.deployed();
        await crowdsale.finalize();
    });

    it("correct token counts in multisigs", async function() {
        const token = await GetToken.deployed();
        const crowdsale = await GetCrowdsale.deployed();
        let totalTokens = await crowdsale.tokensSold();
        totalTokens = parseFloat(totalTokens.valueOf());

        const bountyBalance = await token.balanceOf(constants.multisig.BOUNTYADDRESS);
        const stabilityBalance = await token.balanceOf(constants.multisig.STABILITYADDRESS);
        const userGrowthBalance = await token.balanceOf(constants.multisig.USERGROWTHADDRESS);
        assert.equal(bountyBalance.valueOf(), 1800000 * 10**18, "Incorrect amount in bounty");
        assert.equal(stabilityBalance.valueOf(), 12600000 * 10**18, "Incorrect amount in stability");
        assert.equal(userGrowthBalance.valueOf(), totalTokens * 0.73170731707, "Incorrect amount in userGrowth");
    });

    it("correct amount in main multisig", async function() {
        const crowdsale = await GetCrowdsale.deployed();
        let weiRaised = await crowdsale.weiRaised();
        weiRaised = parseFloat(weiRaised.valueOf());

        // accounts already have 100 ether in testrpc
        assert.equal(
            await testUtils.balanceOf(constants.multisig.MAINADDRESS), 
            weiRaised + 100 * 10**18,
            "incorrect amount in multisig"
        );
        
    });
});