// var GetTeamMinter = artifacts.require("./GetTeamMinter.sol");
// var GetToken = artifacts.require("./GetToken.sol");
// const value1 = 10000000;
// const value2 = 5000000
// const tokenAmount1 = 200000;
// const tokenAmount2 = 100000;


// contract('GetTeamMinter', function(accounts) {
//     it("Owner can add members", async function() {
//         let minter = await GetTeamMinter.deployed();
        
//         await minter.acceptBatched([accounts[1], accounts[2]], [value1, value2], [tokenAmount1, tokenAmount2])
//         entry1 = await minter.entries.call(accounts[1]);
//         entry2 = await minter.entries.call(accounts[2]);

//         assert.equal(entry1[0].valueOf(), value1, 'correct value entry1');
//         assert.equal(entry2[0].valueOf(), value2, 'correct value entry1');


//         assert.equal(entry1[1].valueOf(), tokenAmount1, 'correct tokenAmount entry1');
//         assert.equal(entry2[1].valueOf(), tokenAmount2, 'correct tokenAmount entry2');
        
        
//         assert.equal(entry1[2].valueOf(), true, 'entry1 has right to buy');
//         assert.equal(entry2[2].valueOf(), true, 'entry2 has right to buy');
//     });

//     it("Not owner cannot add members", async function() {
//         let minter = await GetTeamMinter.deployed();
//         try{
//             await minter.accept(accounts[1], value1, tokenAmount1, {from: accounts[1]});
//         } catch (error) {
//             return true;
//         }
//         throw new Error('Non owner added members');
//     });

//     it("Team member can not buy more than the amount", async function() {
//         try {    
//             await web3.eth.sendTransaction({
//                 from: accounts[1], to: GetTeamMinter.address, value: value1 + 1
//             })
            
//         } catch (error) {
//             return true;
//         }
//         throw new Error('Managed to send more ether');
//     });

//     it("Team member can not buy less than the amount", async function() {
//         try {    
//             await web3.eth.sendTransaction({
//                 from: accounts[1], to: GetTeamMinter.address, value: value1 - 1
//             })
            
//         } catch (error) {
//             return true;
//         }
//         throw new Error('Managed to send less ether');
//     });
  
//     it("Team member can not buy less than the amount", async function() {  
//         let minter = await GetTeamMinter.deployed();

//         await web3.eth.sendTransaction({
//             from: accounts[1], to: GetTeamMinter.address, value: value1
//         })
//         let token = await GetToken.deployed();
//         let balance = await token.balanceOf(accounts[1]);
//         assert.equal(balance.valueOf(), tokenAmount1, "corect amount in token contract");
//     });

// });