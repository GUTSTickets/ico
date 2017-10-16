const coder = require('web3/lib/solidity/coder');
const SHA3 = require('sha3');
const RLP = require('rlp');

class Util {
    constructor(_web3) {
        this.web3 = _web3;
    }

    createContractAddress(address, nonce) {
        address = address.substring(2);
        var r = RLP.encode([new Buffer(address, "hex"), nonce.toString()])
        var d = new SHA3.SHA3Hash(256);
        d.update(r);
        var res = '0x' + d.digest('hex').substring(24);
        console.log("Called createdconaddress with :" + address + " " + nonce + " " + res );
        return res;
    }

    createConstructorParams(abi, params) {
        return abi.filter(function (json) {
            return json.type === 'constructor' && json.inputs.length === params.length;
        }).map(function (json) {
            return json.inputs.map(function (input) {
                return input.type;
            });
        }).map(function (types) {
            return coder.encodeParams(types, params);
        })[0] || '';
    }

    createContractData(multisig, Contract, params, nonce) {
        const data = Contract.binary + this.createConstructorParams(Contract.abi, params);
        if (nonce === undefined || nonce === null){
            return multisig.getTransactionCount.call(true, true).then((nonce) => {  
                return {
                    address: this.createContractAddress(multisig.address, nonce),
                    data: data
                }
            });
        }
        return new Promise((resolve, reject) => {
            resolve({
                address: this.createContractAddress(multisig.address, nonce),
                data: data
            });
        });
    }

    submitMultisigContract(multisig, data) {
        return multisig.submitTransaction(
            0,
            0,
            data.data,
            true,
            { from: this.web3.eth.accounts[0], gas: 4700000 }
        );
    }

    submitMultisigTransaction(multisig, instance, methodName, ...params) {
        return multisig.submitTransaction(
            instance.address,
            0,
            instance.contract[methodName].getData(...params),
            false,
            { from: this.web3.eth.accounts[0] }
        );
    }
}

module.exports = Util;
