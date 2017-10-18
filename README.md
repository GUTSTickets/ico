GENERAL INFO
============

This repo contains the contracts that are going to be used in the GET ICO. The Ico consists of a public presale phase starting on 25th of October and a sale phase starting on 15th of November. Both phases are whitelist only. The contract addresses will be revealed by GUTS through a customized version of the GUTS Tickets application. Presale and sale are handled by different contracts, so that we can assure that we can reveal the crowdsale address when it starts and be able to lock the token price at a closer date to the crowdsale start.

Presale phase
-------------

Presale uses the contracts GetPreCrowdsale, GetPrePricingStrategy and GetPreFinalizeAgent, following the TokenMarketNet structure for Crowdsales. Pricing is a flat price per coin. Presale has a total maximum cap and a maximum cap per user, which is applied by the GetWhitelist contract. When Presale is finalized the variables holding the tokens sold and the wei raised are moved to the crowdsale contract, which means that crowdsale needs to be deployed before presale is finalized.

Sale phase
-------------

Sale uses the contracts GetCrowdsale, GetPricingStrategy and GetFinalizeAgent, following the TokenMarketNet structure for Crowdsales. Pricing follows consists of four flat prices per coin (tiers) chosen depending on the amount of wei invested already in the crowdsale.  Presale has a total maximum cap and a maximum cap per user per tier, which is applied by the GetWhitelist contract. It also has a minimum funding goal and if it is not reached the contract will move to Refunding mode. When sale is finalized tokens are minted to User Growth Multisig, Stability Fund Multisig and the Bounty Fund Multisig.

INSTALLATION - TESTING
======================

1. Install truffle https://github.com/trufflesuite/truffle
2. yarn
3. npm install -g ethereumjs-testrpc
3. truffle compile
4. start testrpc 
`./start_testrpc`

5. migrate
`truffle migrate --network=testrpc`

6. run tests (you need node v8.6.0 for that - or a version that supports async-await)
`truffle test --network=testrpc`
Note: after running tests you need to restart testrpc or migrate again, because we change the time of testrpc, so next runs will fail.

7. structure
 - In token_market_net/ -- only token_market_net contracts.
 - In node_modules/zeppelin-solidity/contracts -- OpenZeppelin contracts.
 - in util/ -- test helpers and some parity helpers (to update addressbook). 
 - The Get.... contracts are the GET ico contracts

Note that in truffle.js network_id 42 is mandatory for kovan.
