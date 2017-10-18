pragma solidity ^0.4.11;

import "./GetCrowdsale.sol";
import "../token_market_net/SafeMathLib.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract GetPreFinalizeAgent is FinalizeAgent, Ownable {
    GetCrowdsale public crowdsale;
    GetCrowdsale public preCrowdsale;

    function GetPreFinalizeAgent(GetCrowdsale _preCrowdsale) {
        
        if(address(_preCrowdsale) == 0) {
            revert();
        }
        preCrowdsale = _preCrowdsale;
        
    }

    function setCrowdsale(GetCrowdsale _crowdsale) onlyOwner {
        require(address(_crowdsale) != 0);
        crowdsale = _crowdsale;
    }

    function isSane() public constant returns (bool) {
        // cannot check crowdsale yet since it is not set.
        return true;
    }

    function finalizeCrowdsale() {
        if(msg.sender != address(preCrowdsale)) {
            revert();
        }

        // log the results to the main crowdsale
        uint tokensSold = preCrowdsale.tokensSold();
        uint weiRaised = preCrowdsale.weiRaised();
        if (!crowdsale.logPresaleResults(tokensSold, weiRaised)) {
            revert();
        }
    }
    
    function() payable {
        revert();
    }
}