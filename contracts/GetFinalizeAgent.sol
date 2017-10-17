pragma solidity ^0.4.11;

import "../token_market_net/Crowdsale.sol";
import "../token_market_net/CrowdsaleToken.sol";
import "../token_market_net/SafeMathLib.sol";

/**
 * At the end of the successful crowdsale allocate % bonus of tokens to the team.
 *
 * Unlock tokens.
 *
 * BonusAllocationFinal must be set as the minting agent for the MintableToken.
 *
 */
contract GetFinalizeAgent is FinalizeAgent {

    using SafeMathLib for uint;

    CrowdsaleToken public token;
    Crowdsale public crowdsale;

    /** Where we move the tokens at the end of the sale. */
    address public userGrowthMultisig;
    address public stabilityMultisig;
    address public bountyMultisig;

    function GetFinalizeAgent(CrowdsaleToken _token, Crowdsale _crowdsale, 
            address _userGrowthMultisig, address _stabilityMultisig, address _bountyMultisig) {
        token = _token;
        crowdsale = _crowdsale;
        if(address(crowdsale) == 0) {
            revert();
        }
        
        require(_userGrowthMultisig != 0);
        require(_stabilityMultisig != 0);
        require(_bountyMultisig != 0);

        userGrowthMultisig = _userGrowthMultisig;
        stabilityMultisig = _stabilityMultisig;
        bountyMultisig = _bountyMultisig;
    }

    /* Can we run finalize properly */
    function isSane() public constant returns (bool) {
        return (token.mintAgents(address(this)) == true) && (token.releaseAgent() == address(this));
    }

    /** Called once by crowdsale finalize() if the sale was success. */
    function finalizeCrowdsale() {
        if(msg.sender != address(crowdsale)) {
            revert();
        }

        uint tokensSold = crowdsale.tokensSold();
        uint decimals = token.decimals();

        // maximum digits here (10 + 18 + 12)
        token.mint(userGrowthMultisig, tokensSold.times(73170731707) / 100000000000);
        
        token.mint(stabilityMultisig, 12600000 * (10**decimals));
        token.mint(bountyMultisig, 1800000 * (10**decimals));

        // Make token transferable
        token.releaseTokenTransfer();
    }
}
