module.exports = {
    crowdsale: {
        START: Math.round(new Date().getTime()/1000) + 60*60*2, // starts in two hours
        END: Math.round(new Date().getTime()/1000) + 60*60*26, // ends in four hours
        MINIMUM_WEI_FUNDING_GOAL: 3 * 10**18,
        MAXIMUM_SELLABLE_TOKENS: 10 * 10 ** 18,
        LOCKTIME: 60 * 60 //1hour
    },

    precrowdsale: {
        START: Math.round(new Date().getTime()/1000),
        END: Math.round(new Date().getTime()/1000) + 60*60*2, 
        PRESALE_TOKEN_CAP: 3000000 * 10 ** 18
    },
    
    finalizeagent: {    
    },

    multisig: {
        MAINADDRESS: '0x00c9b8f5c03de53059b6f21238b070f50e986c25',
        USERGROWTHADDRESS: '0x00c9b8f5c03de53059b6f21238b070f50e986c25',
        STABILITYADDRESS: '0x00c9b8f5c03de53059b6f21238b070f50e986c25',
        BOUNTYADDRESS: '0x00c9b8f5c03de53059b6f21238b070f50e986c25'
    },

    pricingStrategy: {
        TRANCHES:  [
            0, // start limit has to be 0
            0.001 * 10 ** 18 , // 1st price
            1 * 10 ** 18, //1st cap
            2000000000000000, // 2nd price
            2 * 10 ** 18, // 2nd cap
            3000000000000000, // 3nd price
            3* 10 ** 18, // 3nd cap
            4000000000000000, // 4nd price
            4* 10 ** 18, // 4nd cap
            0 // end price has to be 0
        ],
        PRESALE_PRICE_WEI: 500000000000000
    },

    whitelist: {
        WHITELISTERS: [
            '0x00c9b8f5c03de53059b6f21238b070f50e986c25',
            '0x002941C2DfAE6a6058915B58D6B28c4dcd8f1542'
        ],
        presaleCap: 1 * 10 ** 18,
        tier1Cap: 1 * 10 ** 18,
        tier2Cap: 1 * 10 ** 18,
        tier3Cap: 1 * 10 ** 18,
        tier4Cap: 1 * 10 ** 18

    }

}