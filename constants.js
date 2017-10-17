const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545")) // Hardcoded testrpc port


module.exports = {
    crowdsale: {
        START: Math.round(new Date().getTime()/1000),
        END: Math.round(new Date().getTime()/1000) + 60*60,
        MINIMUM_WEI_FUNDING_GOAL: 3 * 10**18,
        MAXIMUM_SELLABLE_TOKENS: 2200 * 10 ** 18,
        LOCKTIME: 60 * 60 //1hour
    },

    precrowdsale: {
        START: Math.round(new Date().getTime()/1000),
        END: Math.round(new Date().getTime()/1000) + 60*60*2, 
        PRESALE_TOKEN_CAP: 1000 * 10 ** 18
    },
    
    finalizeagent: {    
    },

    multisig: {
        MAINADDRESS: web3.eth.accounts[16],
        USERGROWTHADDRESS: web3.eth.accounts[17],
        STABILITYADDRESS: web3.eth.accounts[18],
        BOUNTYADDRESS: web3.eth.accounts[19]
    },

    pricingStrategy: {
        TRANCHES:  [
            0, // start limit has to be 0
            0.001 * 10 ** 18, // 1st price
            1 * 10 ** 18, //1st cap
            0.002 * 10 ** 18, // 2nd price
            2 * 10 ** 18, // 2nd cap
            0.0025 * 10 ** 18, // 3nd price
            3* 10 ** 18, // 3nd cap
            0.004 * 10 ** 18, // 4nd price
            8* 10 ** 18, // 4nd cap (should be higher by far from the token cap of crowdsale)
            0 // end price has to be 0
        ],
        PRESALE_PRICE_WEI: 0.0005 * 10**18
    },

    whitelist: {
        presaleCap: 1 * 10 ** 18,
        tier1Cap: 1 * 10 ** 18,
        tier2Cap: 1 * 10 ** 18,
        tier3Cap: 1 * 10 ** 18,
        tier4Cap: 1 * 10 ** 18
    }
}