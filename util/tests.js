const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545")) // Hardcoded testrpc port

module.exports = {
    timeTravel: function (time) {
        return new Promise((resolve, reject) => {
            web3.currentProvider.sendAsync({
                jsonrpc: "2.0",
                method: "evm_increaseTime",
                params: [time], // 86400 is num seconds in day
                id: new Date().getTime()
            }, (err, result) => {
                if(err){ return reject(err) }
                return resolve(result)
            });
        })
    },

    now: function() {
        return web3.eth.getBlock('latest').timestamp;
    },
    
    balanceOf: function(address) {
        return web3.eth.getBalance(address);
    }
}