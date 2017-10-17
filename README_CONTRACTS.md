GET ICO
=======

GET ICO has 2 phases:
---------------------
- PreICO:
    - Only whitelisted accounts.
    - limited to a specific amount.
- ICO:
    - different contract from PreICO
    - Only whitelisted acounts
    - 4 different pricing tiers. Pricing is calculated depending on the amount that is already invested. The price of the token follows the pattern: 
        - Price is A between 0, x , x > 0
        - Price is B between x, y , y > x , B > A
        - Price is C between y, z , z > y , C > B
        - Price id D between z, w , w > z , D > C
    - Each account has a limit that he can buy on that tier.



CONTRACTS
=========

GetToken:
---------
- Tokenmarketnet CrowdsaleToken contract
    - 18 decimals
    - "GET" symbol
    - "Guaranteed Entrance Token" name
- No custom code

GetCrowdsale:
-------------
- Only responsible for the sale, we use a different contract for the presale. The reason is that we want to have different address for the sale contract which will be shared through our app in a different time.
- Tokenmarketnet MintedTokenCappedCrowdsale
- Custom code:
    - Enable the fallback function. We want an account to get tokens if he transfers money to the GetCrowdsale.
    - Disable setEarlyParicipantWhitelist function (not needed)
    - Implement a timelock on the finalize() function. The crowdsale will be able to be finalized (Token becomes tradable and more tokens are minted) after some time (3 weeks).
    - logPresaleResults: Moves the presale values to the crowdsale contract
    - preallocate: The default function was not adding the preallocated amounts as presale amounts, so it is overriden.

GetFinalizeAgent:
-----------------
- Tokenmarketnet FinalizeAgent
- almost the same as BonusFinalizeAgent from Tokenmarketnet, but needs some customization for the specific amounts.
- Releases token
- Custom code:
    - Mints tokens to 3 multisig addresses
        - Bounty: 1800000
        - Stability: 12600000
        - userGrowth: percentage based on tokens sold (0.73170731707 * tokens sold)
    

GetPricingStrategy:
-------------------
- Tokenmarketnet EthTranchePricing
- handles whitelist entries
- Custom code:
    - calculatePrice: needs to check if a user is part of the whitelist.
    - calculatePrice: needs to update the user limits in the correct Tier (called Tranche in the contract).
    - isPresalePurchase: always false, since we handle presale in a different contract.

GetWhitelist:
-------------
- Custom contract
- Ownable (zeppelin)
- whitelisters: list of accounts that can add accounts to the whitelist
- entries: whitelisted accounts. They start off with the caps defined 
- WhitelistInfo: struct containing:
    - isWhitelisted bool
    - isEarly bool: for PreICO investors
    - presaleAmount uint
    - tier1Amount: uint
    - tier2Amount: uint
    - tier3Amount: uint
    - tier4Amount: uint
- setWhitelister: onlyOwner modifier. Owner can add or remove whitelisters
- onlyWhitelister modifier: only whitelisters can perform this action
- accept: onlyWhitelister modifier: add a new entry to the entries. Fails on existing one.
- acceptBatched: onlyWhitelister modifier: add multiple entries to the entries
- setCaps: onlyOwner modifier: change the tier caps
- subtractAmount onlyWhitelister modifier: reduces the amount that an account can buy in a specific tiers


GetPreCrowdsale:
-------------
- Only responsible for the presale, we use a different contract for the sale.
- Tokenmarketnet MintedTokenCappedCrowdsale
- Custom code:
    - Enable the fallback function. We want an account to get tokens if he transfers money to the GetCrowdsale.
    - Disable setEarlyParicipantWhitelist function (not needed)


GetPreFinalizeAgent:
-----------------
- Tokenmarketnet FinalizeAgent
- Custom code:
    - updates Crowdsale with the amounts of GetPreCrowdsale


GetPrePricingStrategy:
-----------------
- Tokenmarketnet FlatPricing
- Custom code:
    - checks whitelist
    - updates the presaleAmount of entries.
