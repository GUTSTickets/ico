const GetPricingStrategy = artifacts.require("./GetPricingStrategy.sol");
const GetPrePricingStrategy = artifacts.require("./GetPrePricingStrategy.sol");
const GetWhitelist = artifacts.require("./GetWhitelist.sol");
const constants = require('../constants.js');



contract('GetPricingStrategy', function(accounts) {
    it("non crowdsale cannot call calculateprice", async function() {
        const pricingstrategy = await GetPricingStrategy.deployed();
        const whitelist = await GetWhitelist.deployed();
        await whitelist.setWhitelister(accounts[0], true)
        await whitelist.accept(accounts[0], true);
        
        try{
            await pricingstrategy.calculatePrice(
               100, 0, 0, accounts[0], 18
            );
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Could call calculate price");
    });
})

contract('GetPrePricingStrategy', function(accounts) {
    it("non crowdsale cannot call calculateprice", async function() {
        const pricingstrategy = await GetPrePricingStrategy.deployed();
        const whitelist = await GetWhitelist.deployed();
        await whitelist.setWhitelister(accounts[0], true)
        await whitelist.accept(accounts[0], true);
        
        try{
            await pricingstrategy.calculatePrice(
               100, 0, 0, accounts[0], 18
            );
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("bought more than cap");
    });
})