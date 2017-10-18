const GetWhitelist = artifacts.require("./GetWhitelist.sol");
const VanityEth = require('vanity-eth/libs/VanityEth.js');
const constants = require('../constants.js');



contract('GetWhitelist', function(accounts) {
    it("whitelister can add presale entries", async function() {
        let whitelist = await GetWhitelist.deployed();
        await whitelist.setWhitelister(accounts[0], true);
        
        await whitelist.accept(accounts[1], true);

        entry = await whitelist.entries.call(accounts[1]);

        assert.equal(entry[0].valueOf(), constants.whitelist.presaleCap, 'Incorrect presaleCap');
        assert.equal(entry[1].valueOf(), constants.whitelist.tier1Cap, 'Incorrect tier1Cap');
        assert.equal(entry[2].valueOf(), constants.whitelist.tier2Cap, 'Incorrect tier2Cap');
        assert.equal(entry[3].valueOf(), constants.whitelist.tier3Cap, 'Incorrect tier3Cap');
        assert.equal(entry[4].valueOf(), constants.whitelist.tier4Cap, 'Incorrect tier2Cap');
        assert.equal(entry[5].valueOf(), true, 'Incorrect iswhitelisted');
    });

    it("whitelister can add sale entries", async function() {
        let whitelist = await GetWhitelist.deployed();
        
        await whitelist.accept(accounts[2], false);

        entry = await whitelist.entries.call(accounts[2]);

        assert.equal(entry[0].valueOf(), 0, 'Incorrect presaleCap');
        assert.equal(entry[1].valueOf(), constants.whitelist.tier1Cap, 'Incorrect tier1Cap');
        assert.equal(entry[2].valueOf(), constants.whitelist.tier2Cap, 'Incorrect tier2Cap');
        assert.equal(entry[3].valueOf(), constants.whitelist.tier3Cap, 'Incorrect tier3Cap');
        assert.equal(entry[4].valueOf(), constants.whitelist.tier4Cap, 'Incorrect tier2Cap');
        assert.equal(entry[5].valueOf(), true, 'Incorrect iswhitelisted');
    });

    it("non whitelister cannot add entries", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            const entry = await whitelist.entries.call(accounts[1]);

            await whitelist.subtractAmount(accounts[1], 1, entry[1].valueOf() - 100, {from: accounts[1]});            
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Non whitelister subtracted");
    });
    
    it("whitelister cannot add the same member", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            await whitelist.accept(accounts[2], false);            
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Added same member again");
    });

    it("whitelister can subtract amounts of members", async function() {
        const value = 0.1*10**18
        const whitelist = await GetWhitelist.deployed();
        await whitelist.subtractAmount(accounts[1], 0, value);
        await whitelist.subtractAmount(accounts[1], 1, value);
        await whitelist.subtractAmount(accounts[1], 2, value);
        await whitelist.subtractAmount(accounts[1], 3, value);
        await whitelist.subtractAmount(accounts[1], 4, value);

        const entry = await whitelist.entries.call(accounts[1]);
        assert.equal(entry[0].valueOf(), constants.whitelist.tier1Cap - value, 'Incorrect presaleCap');
        assert.equal(entry[1].valueOf(), constants.whitelist.tier1Cap - value, 'Incorrect tier1Cap');
        assert.equal(entry[2].valueOf(), constants.whitelist.tier2Cap - value, 'Incorrect tier2Cap');
        assert.equal(entry[3].valueOf(), constants.whitelist.tier3Cap - value, 'Incorrect tier3Cap');
        assert.equal(entry[4].valueOf(), constants.whitelist.tier4Cap - value, 'Incorrect tier2Cap');
        assert.equal(entry[5].valueOf(), true, 'Incorrect iswhitelisted');
    });


    it("whitelister cannot subtract amounts of non whitelisted", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            await whitelist.subtractAmount(accounts[0], 0, 100);            
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Subtracted from non-whitelisted");
    });

    it("whitelister cannot subtract amounts higher than remaining cap- PRESALE", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            const entry = await whitelist.entries.call(accounts[1]);

            await whitelist.subtractAmount(accounts[0], 0, entry[0].valueOf() + 1);            
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Subtracted higher than cap from whitelisted");
    });

    it("whitelister cannot subtract amounts higher than remaining cap- TIER1", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            const entry = await whitelist.entries.call(accounts[1]);

            await whitelist.subtractAmount(accounts[0], 1, entry[1].valueOf() + 1);            
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Subtracted higher than cap from whitelisted");
    });

    it("whitelister cannot subtract amounts higher than remaining cap- TIER2", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            const entry = await whitelist.entries.call(accounts[1]);

            await whitelist.subtractAmount(accounts[0], 2, entry[2].valueOf() + 1);            
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Subtracted higher than cap from whitelisted");
    });


    it("whitelister cannot subtract amounts higher than remaining cap- TIER3", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            const entry = await whitelist.entries.call(accounts[1]);

            await whitelist.subtractAmount(accounts[0], 3, entry[3].valueOf() + 1);            
        }catch (error){
            
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Subtracted higher than cap from whitelisted");
    });


    it("whitelister cannot subtract amounts higher than remaining cap- TIER4", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            const entry = await whitelist.entries.call(accounts[1]);

            await whitelist.subtractAmount(accounts[0], 4, entry[4].valueOf() + 1);            
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Subtracted higher than cap from whitelisted");
    });

    it("whitelister cannot subtract amount from non existent tier", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            const entry = await whitelist.entries.call(accounts[1]);

            await whitelist.subtractAmount(accounts[0], 6, entry[0].valueOf() - 100);            
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Subtracted from non existent tier");
    });

    it("non whitelister cannot subtract amount", async function() {
        const whitelist = await GetWhitelist.deployed();
        try{
            const entry = await whitelist.entries.call(accounts[1]);

            await whitelist.subtractAmount(accounts[1], 1, entry[1].valueOf() - 100, {from: accounts[1]});            
        }catch (error){
            assert(error.message.indexOf("invalid opcode") != -1, "Incorrect throw");
            return;
        }
        throw new Error("Non whitelister subtracted");
    });
    
    it("whitelister can add multiple addresses", async function(){
        const n = 38; //38 is the max without out of gas exception
        var whitelist = await GetWhitelist.deployed();
        let randomAccounts = (new Array(n)).fill(true).map(() => {
            return VanityEth.getVanityWallet().address
        });
        await whitelist.acceptBatched(randomAccounts, true);

        // lets check some of them
        for (let index of [10, 12, 14, 16]) {
            let entry = await whitelist.entries.call(randomAccounts[index]);
            assert.equal(entry[0].valueOf(), constants.whitelist.presaleCap, 'correct value entry');
            assert.equal(entry[1].valueOf(), constants.whitelist.tier1Cap, 'correct tier1Cap entry');
            assert.equal(entry[2].valueOf(), constants.whitelist.tier2Cap, 'correct tier2Cap entry');
            assert.equal(entry[3].valueOf(), constants.whitelist.tier3Cap, 'correct tier3Cap entry');
            assert.equal(entry[4].valueOf(), constants.whitelist.tier4Cap, 'correct tier4Cap entry');
            assert.equal(entry[5].valueOf(), true, 'entry has right to buy');
        }
    });
});