1. Install truffle https://github.com/trufflesuite/truffle
2. yarn
3. npm install -g ethereumjs-testrpc
3. truffle compile
4. start testrpc 

`./start_testrpc <pk> <pk> <pk>`


5. start parity 

`parity --chain kovan`

6. truffle migrate --network kovan
7. truffle migrate --network testrpc


 - In contracts/token_market_net there are only token_market_net contracts.
 - In contracts/gnosis the MultiSigWallet contract.
 - In node_modules/zeppelin-solidity/contracts OpenZeppelin contracts.
 - The Get.... contracts are the ones that i think we ll need. I try to reuse as much as possible.

For Stavros testrpc (cloning kovan): (In start_testrpc the network-id has to match the network_id in truffle.js)
```
./start_testrpc 0xea8256c0ed7005af3557878957e05bbfd9ceb9950f3cd73343b66bc7be377175 0xa2d826dd37ca69224911602975fd88c090f75f481a1ed748513e7e7fadb844bc 0xe50b87fc07f4948908085f92c2ac13f568d9c9842871e509492b0ff68177e137
```

For parity again

`parity --chain kovan`

Note that in truffle.js network_id 42 is mandatory for kovan.

The contracts can be imported to the parity UI by moving address_book.json to ~/.local/share/io.parity.ethereum/keys/kovan/ (or /main/)