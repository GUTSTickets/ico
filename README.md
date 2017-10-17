1. Install truffle https://github.com/trufflesuite/truffle
2. yarn
3. npm install -g ethereumjs-testrpc
3. truffle compile
4. start testrpc 

`./start_testrpc`
5. migrate
`truffle migrate --network=testrpc`

5. run tests (you need node v8.6.0 for that - or a version that supports async-await)
`truffle test --network=testrpc`
Note: after running tests you need to restart testrpc or migrate again, because we change the time of testrpc, so next runs will fail.

6. structure
 - In contracts/token_market_net there are only token_market_net contracts.
 - In node_modules/zeppelin-solidity/contracts OpenZeppelin contracts.
 - in util/ there are: test helpers and some parity helpers (to update addressbook). 
 - The Get.... contracts are the GET ico contracts

Note that in truffle.js network_id 42 is mandatory for kovan.
