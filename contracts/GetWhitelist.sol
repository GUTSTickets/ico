pragma solidity ^0.4.15;
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../token_market_net/SafeMathLib.sol";


contract GetWhitelist is Ownable {
    using SafeMathLib for uint;

    event NewEntry(address whitelisted);
    event EdittedEntry(address whitelisted, uint tier);
    event WhitelisterChange(address whitelister, bool iswhitelister);

    struct WhitelistInfo {
        uint presaleAmount;
        uint tier1Amount;
        uint tier2Amount;
        uint tier3Amount;
        uint tier4Amount;
        bool isWhitelisted;
    }

    mapping (address => bool) public whitelisters;
    
    mapping (address => WhitelistInfo) public entries;
    uint presaleCap;
    uint tier1Cap;
    uint tier2Cap;
    uint tier3Cap;
    uint tier4Cap;

    modifier onlyWhitelister() {
        require(whitelisters[msg.sender]);
        _;
    }

    function GetWhitelist(uint _presaleCap, uint _tier1Cap, uint _tier2Cap, uint _tier3Cap, uint _tier4Cap) {
        presaleCap = _presaleCap;
        tier1Cap = _tier1Cap;
        tier2Cap = _tier2Cap;
        tier3Cap = _tier3Cap;
        tier4Cap = _tier4Cap;
    }

    function isGetWhiteList() constant returns (bool) {
        return true;
    }

    function acceptBatched(address[] _addresses, bool _isEarly) onlyWhitelister {
        for (uint i=0; i<_addresses.length; i++) {
            accept(_addresses[i], _isEarly);
        }
    }

    function accept(address _address, bool isEarly) onlyWhitelister {
        require(!entries[_address].isWhitelisted);
        uint _presaleCap;
        if (isEarly) {
            _presaleCap = presaleCap;
        } else {
            _presaleCap = 0;
        }
        entries[_address] = WhitelistInfo(_presaleCap, tier1Cap, tier2Cap, tier3Cap, tier4Cap, true);
        NewEntry(_address);
    }

    function subtractAmount(address _address, uint _tier, uint _amount) onlyWhitelister {
        require(_amount > 0);
        require(entries[_address].isWhitelisted);
        if (_tier == 0) {
            entries[_address].presaleAmount = entries[_address].presaleAmount.minus(_amount);
            EdittedEntry(_address, 0);
            return;
        }else if (_tier == 1) {
            entries[_address].tier1Amount = entries[_address].tier1Amount.minus(_amount);
            EdittedEntry(_address, 1);
            return;
        }else if (_tier == 2) {
            entries[_address].tier2Amount = entries[_address].tier2Amount.minus(_amount);
            EdittedEntry(_address, 2);
            return;
        }else if (_tier == 3) {
            entries[_address].tier3Amount = entries[_address].tier3Amount.minus(_amount);
            EdittedEntry(_address, 3);
            return;
        }else if (_tier == 4) {
            entries[_address].tier4Amount = entries[_address].tier4Amount.minus(_amount);
            EdittedEntry(_address, 4);
            return;
        }
        revert();
    }

    function setWhitelister(address _whitelister, bool _isWhitelister) onlyOwner {
        whitelisters[_whitelister] = _isWhitelister;
        WhitelisterChange(_whitelister, _isWhitelister);
    }

    function setCaps(uint _presaleCap, uint _tier1Cap, uint _tier2Cap, uint _tier3Cap, uint _tier4Cap) onlyOwner {
        presaleCap = _presaleCap;
        tier1Cap = _tier1Cap;
        tier2Cap = _tier2Cap;
        tier3Cap = _tier3Cap;
        tier4Cap = _tier4Cap;
    }

    function() payable {
        throw;
    }
}
