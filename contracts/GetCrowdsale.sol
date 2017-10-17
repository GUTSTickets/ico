pragma solidity ^0.4.11;
import '../token_market_net/MintedTokenCappedCrowdsale.sol';
import '../token_market_net/MintableToken.sol';
import './GetWhitelist.sol';


contract GetCrowdsale is MintedTokenCappedCrowdsale {

    uint public lockTime;
    address presale;

    event PresaleUpdated(uint weiAmount, uint tokenAmount);

    function GetCrowdsale(
        uint _lockTime, address _presale,
        address _token, PricingStrategy _pricingStrategy, address _multisigWallet,
        uint _start, uint _end, uint _minimumFundingGoal, uint _maximumSellableTokens)

        MintedTokenCappedCrowdsale(_token, _pricingStrategy, _multisigWallet,
            _start, _end, _minimumFundingGoal, _maximumSellableTokens)
    {
        require(_presale != 0x0);
        require(_lockTime > 0);
        lockTime = _lockTime;
        presale = _presale;
    }

    function logPresaleResults(uint tokenAmount, uint weiAmount) returns (bool) {

        require(msg.sender == presale);
        weiRaised = weiRaised.plus(weiAmount);
        tokensSold = tokensSold.plus(tokenAmount);
        presaleWeiRaised = presaleWeiRaised.plus(weiAmount);

        PresaleUpdated(weiAmount, tokenAmount);
        return true;
    }

    // overriden because presaleWeiRaised was not altered and would mess with the TranchePricing
    function preallocate(address receiver, uint fullTokens, uint weiPrice) public onlyOwner {

        uint tokenAmount = fullTokens * 10**token.decimals();
        uint weiAmount = weiPrice * fullTokens; // This can be also 0, we give out tokens for free

        weiRaised = weiRaised.plus(weiAmount);
        tokensSold = tokensSold.plus(tokenAmount);

        presaleWeiRaised = presaleWeiRaised.plus(weiAmount);

        investedAmountOf[receiver] = investedAmountOf[receiver].plus(weiAmount);
        tokenAmountOf[receiver] = tokenAmountOf[receiver].plus(tokenAmount);

        assignTokens(receiver, tokenAmount);

        // Tell us invest was success
        Invested(receiver, weiAmount, tokenAmount, 0);
    }

    function setEarlyParicipantWhitelist(address addr, bool status) onlyOwner {
        // We don't need this function, we have external whitelist
        revert();
    }

    // added this here because it was not visible by preallocate
    function assignTokens(address receiver, uint tokenAmount) private {
        MintableToken mintableToken = MintableToken(token);
        mintableToken.mint(receiver, tokenAmount);
    }


    function finalize() public inState(State.Success) onlyOwner stopInEmergency {
        require(now > endsAt + lockTime);
        super.finalize();
    }

    function() payable {
        invest(msg.sender);
    }
}
