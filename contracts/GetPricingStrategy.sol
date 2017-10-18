pragma solidity ^0.4.15;

/**
 * This smart contract code is Copyright 2017 TokenMarket Ltd. For more information see https://tokenmarket.net
 *
 * Licensed under the Apache License, version 2.0: https://github.com/TokenMarketNet/ico/blob/master/LICENSE.txt
 */

import "../token_market_net/EthTranchePricing.sol";
import "./GetWhitelist.sol";


/// @dev Tranche based pricing with special support for pre-ico deals.
///      Implementing "first price" tranches, meaning, that if byers order is
///      covering more than one tranche, the price of the lowest tranche will apply
///      to the whole order.
contract GetPricingStrategy is EthTranchePricing {
    GetWhitelist public whitelist;
    address crowdsale;

    function GetPricingStrategy(GetWhitelist _whitelist, uint[] _tranches) EthTranchePricing(_tranches) {
        assert(_whitelist.isGetWhiteList());
        whitelist = _whitelist;
    }

    function isPresalePurchase(address purchaser) public constant returns (bool) {
        return false;
    }

    function setCrowdsale(address _crowdsale) onlyOwner {
        require(_crowdsale != 0);
        crowdsale = _crowdsale;
    }

    function isSane(address _crowdsale) public constant returns (bool) {
        return crowdsale == _crowdsale;
    }

    // needed to update the correct tier in whitelist
    function getCurrentTrancheIndex(uint weiRaised) public constant returns (uint) {
        uint i;

        for(i=0; i < tranches.length; i++) {
            if(weiRaised < tranches[i].amount) {
                return i-1;
            }
        }
    }


    /// @dev Calculate the current price for buy in amount.
    function calculatePrice(uint value, uint weiRaised, uint tokensSold, address msgSender, uint decimals) public constant returns (uint) {
        require(msg.sender == crowdsale);
        uint amount;
        bool isEarly;
        bool isWhitelisted;
        uint trancheIndex = getCurrentTrancheIndex(weiRaised);
        whitelist.subtractAmount(msgSender, trancheIndex + 1, value);

        uint multiplier = 10 ** decimals;
        return value.times(multiplier) / tranches[trancheIndex].price;
    }

}
