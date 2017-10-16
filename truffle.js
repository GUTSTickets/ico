module.exports = {
  networks: {
    kovan: {
      host: "localhost",
      port: 8545,
      network_id: "42",
      gasPrice: 10000000000,
      gas: 4700000
    }, 
    testrpc: {
      host: "localhost",
      port: 9545,
      network_id: "2",
      gasPrice: 1000000000,
      gas: 4700000
    }
  }
};
