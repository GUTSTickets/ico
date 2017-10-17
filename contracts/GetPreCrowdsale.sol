pragma solidity ^0.4.11;
import '../token_market_net/PricingStrategy.sol';
import '../token_market_net/MintedTokenCappedCrowdsale.sol';
import '../token_market_net/MintableToken.sol';


contract GetPreCrowdsale is MintedTokenCappedCrowdsale {

    function GetPreCrowdsale(
        address _token, PricingStrategy _pricingStrategy, address _multisigWallet,
        uint _start, uint _end, uint _maximumSellableTokens)
        MintedTokenCappedCrowdsale(_token, _pricingStrategy, _multisigWallet,
            _start, _end, 0, _maximumSellableTokens)
    {
    }

    function setEarlyParicipantWhitelist(address addr, bool status) onlyOwner {
        // We don't need this function, we have external whitelist
        revert();
    }

    function() payable {
        invest(msg.sender);
    }
}