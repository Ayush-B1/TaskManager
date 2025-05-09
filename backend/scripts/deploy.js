const fs = require('fs');
const Web3 = require('web3');
const TaskContract = require('../build/contracts/TaskManagement.json'); // Changed from TaskContract to TaskManagement
require('dotenv').config();

async function deployContract() {
    const web3 = new Web3(process.env.BLOCKCHAIN_NETWORK || 'http://localhost:8545');
    const accounts = await web3.eth.getAccounts();
    
    const contract = new web3.eth.Contract(TaskContract.abi);
    const deployedContract = await contract.deploy({
        data: TaskContract.bytecode
    }).send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '30000000000'
    });

    return deployedContract.options.address;
}

deployContract();