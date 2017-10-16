var fs = require('fs');

function convertToParityFormat(contract, name, description="") {
    return {
        name: name,
        meta: JSON.stringify(contractParityMeta(contract, description)),
        uuid: null
    };
}

function contractParityMeta(contract, description) {
    return {
        abi: contract.abi,
        contract: true,
        deleted: false,
        description: description,
        timestamp: (new Date()).getTime(),
        type: "custom"
    }
}



// I am not moving the file over because I will overwrite the existing ones
function createParityFile(contracts, filename="address_book.json"){
    result = {};
    contracts.forEach(function(contract) {
        result[contract.address] = convertToParityFormat(
            contract, contract.contract_name || "", contract.contract_name || ""
        );
    });

    fs.writeFile(filename, JSON.stringify(result), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`The file was saved in ! ${filename}`);
    });

}

module.exports = createParityFile;