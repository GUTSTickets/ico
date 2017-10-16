pragma solidity ^0.4.11;
import '../token_market_net/CrowdsaleToken.sol';
import '../token_market_net/BurnableToken.sol';


contract GetToken is CrowdsaleToken, BurnableToken {
    function GetToken() CrowdsaleToken(
            "Guaranteed Entrance Token", 
            "GET", 
            0,  // We don't want to have initial supply
            18,
            true // Mintable
        )
    {}
}
