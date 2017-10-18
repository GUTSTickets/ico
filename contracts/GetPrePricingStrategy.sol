pragma solidity ^0.4.15;

/**
 * This smart contract code is Copyright 2017 TokenMarket Ltd. For more information see https://tokenmarket.net
 *
 * Licensed under the Apache License, version 2.0: https://github.com/TokenMarketNet/ico/blob/master/LICENSE.txt
 */

import "../token_market_net/FlatPricing.sol";
import "./GetWhitelist.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/// @dev Tranche based pricing with special support for pre-ico deals.
///      Implementing "first price" tranches, meaning, that if byers order is
///      covering more than one tranche, the price of the lowest tranche will apply
///      to the whole order.
contract GetPrePricingStrategy is FlatPricing, Ownable {
    address precrowdsale;
    GetWhitelist public whitelist;
    uint public presalePrice;

    function GetPrePricingStrategy(GetWhitelist _whitelist, uint _oneTokenInWei) FlatPricing(_oneTokenInWei) {
        assert(_whitelist.isGetWhiteList());
        whitelist = _whitelist;
    }

    function isPresalePurchase(address purchaser) public constant returns (bool) {
        // we log sales in presale contract as normal sales.
        return false;
    }

    function setPrecrowdsale(address _precrowdsale) onlyOwner {
        require(_precrowdsale != 0);
        precrowdsale = _precrowdsale;
    }

    function isSane(address crowdsale) public constant returns (bool) {
        return precrowdsale != 0;
    }

    /// @dev Calculate the current price for buy in amount.
    function calculatePrice(uint value, uint weiRaised, uint tokensSold, address msgSender, uint decimals) public constant returns (uint) {
        // only precrowdsale can call this
        require(msg.sender == precrowdsale);
        // 0 is the presale tier.
        whitelist.subtractAmount(msgSender, 0, value);
        return super.calculatePrice(value, weiRaised, tokensSold, msgSender, decimals);
    }

    function() payable {
        revert(); // No money on this contract
    }
}
