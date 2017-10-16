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
 - The Get.... contracts are the ones that we ll need

For parity again

`parity --chain kovan`

Note that in truffle.js network_id 42 is mandatory for kovan.

The contracts can be imported to the parity UI by moving address_book.json to ~/.local/share/io.parity.ethereum/keys/kovan/ (or /main/)