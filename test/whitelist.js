var GetWhitelist = artifacts.require("./GetWhitelist.sol");
var GetCrowdsale = artifacts.require("./GetCrowdsale.sol");
var VanityEth = require('vanity-eth/libs/VanityEth.js');
const value1 = 10000000;
const value2 = 5000000;


contract('GetWhitelist', function(accounts) {
    it("whitelister can add members", async function() {
        let whitelist = await GetWhitelist.deployed();
        
        await whitelist.acceptBatched([accounts[1], accounts[2]], [value1, value2], true);
        entry1 = await whitelist.entries.call(accounts[1]);
        entry2 = await whitelist.entries.call(accounts[2]);

        assert.equal(entry1[0].valueOf(), value1, 'correct value entry1');
        assert.equal(entry2[0].valueOf(), value2, 'correct value entry1');


        assert.equal(entry1[1].valueOf(), true, 'correct isEarly entry1');
        assert.equal(entry2[1].valueOf(), true, 'correct isEarly entry2');
        
        
        assert.equal(entry1[2].valueOf(), true, 'entry1 has right to buy');
        assert.equal(entry2[2].valueOf(), true, 'entry2 has right to buy');
    });

    it("whitelister cannot add malformed", async function() {
        let whitelist = await GetWhitelist.deployed();
        try {    
            await whitelist.acceptBatched([accounts[1], accounts[2]], [value1], false);
        } catch (error) {
            return true;
        }
        throw new Error('Imported malformed');
    });

    it("whitelister can edit member", async function() {
        let whitelist = await GetWhitelist.deployed();
        await whitelist.accept(accounts[1], value2, false);
        let entry = await whitelist.entries.call(accounts[1]);
        assert.equal(entry[0].valueOf(), value2, 'correct value entry');
        assert.equal(entry[1].valueOf(), false, 'correct isEarly entry');
        assert.equal(entry[2].valueOf(), true, 'entry has right to buy');
    });

    it("whitelister cannot add malformed - part2", async function() {
        let whitelist = await GetWhitelist.deployed();
        try {    
            await whitelist.acceptBatched([accounts[2]], [value1, value2], true);
        } catch (error) {
            return true;
        }
        throw new Error('Imported malformed');
    });

    it("whitelister can add multiple addresses", async function(){
        const n = 98; //98 is the max without out of gas exception
        var whitelist = await GetWhitelist.deployed();
        let randomAccounts = (new Array(n)).fill(true).map(() => {
            return VanityEth.getVanityWallet().address
        });
        await whitelist.acceptBatched(randomAccounts, (new Array(n)).fill(value1), false);

        // lets check some of them
        for (let index of [10, 20, 30, 40]) {
            let entry = await whitelist.entries.call(randomAccounts[index]);
            assert.equal(entry[0].valueOf(), value1, 'correct value entry');
            assert.equal(entry[1].valueOf(), false, 'correct isEarly entry');
            assert.equal(entry[2].valueOf(), true, 'entry has right to buy');
        }
    });
});