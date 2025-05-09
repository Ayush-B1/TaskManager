const Web3 = require('web3');
const TaskContract = require('../build/contracts/TaskManagement.json');
require('dotenv').config();

class BlockchainService {
    constructor() {
        try {
            this.web3 = new Web3(process.env.BLOCKCHAIN_NETWORK || 'http://localhost:8545');
            
            // Enhanced connection check
            this.web3.eth.net.isListening()
                .then(() => {
                    console.log('Connected to:', this.web3.currentProvider.host);
                    return this.web3.eth.getAccounts();
                })
                .then(accounts => console.log('Available accounts:', accounts))
                .catch(err => console.error('Connection error:', err));
            
            this.contract = new this.web3.eth.Contract(
                TaskContract.abi,
                process.env.CONTRACT_ADDRESS || '0x9C201F4eeD3389d09CD4961fE97F512298Ec2916'
            );
            console.log('Blockchain service initialized with contract at:', process.env.CONTRACT_ADDRESS);
        } catch (error) {
            console.error('Error initializing blockchain service:', error);
        }
    }

    async createTask(task) {
        try {
            const accounts = await this.web3.eth.getAccounts();
            return await this.contract.methods
                .createTask(task.title, task.description, task.assignedUser)
                .send({ from: accounts[0] });
        } catch (error) {
            console.error('Blockchain error:', error);
            throw error;
        }
    }

    async updateTaskStatus(taskId, status) {
        try {
            const accounts = await this.web3.eth.getAccounts();
            return await this.contract.methods
                .updateTaskStatus(taskId, status)
                .send({ from: accounts[0] });
        } catch (error) {
            console.error('Blockchain error:', error);
            throw error;
        }
    }

    async getTask(taskId) {
        try {
            return await this.contract.methods.tasks(taskId).call();
        } catch (error) {
            console.error('Error fetching task from blockchain:', error);
            throw error;
        }
    }

    async getAllTasks() {
        try {
            console.log('Verifying contract connection...');
            const contractCode = await this.web3.eth.getCode(this.contract.options.address);
            if (contractCode === '0x') {
                console.error('Contract verification failed - no code at address:', this.contract.options.address);
                throw new Error('Contract not deployed at specified address');
            }

            console.log('Fetching task count...');
            const taskCount = await this.contract.methods.taskCount().call();
            console.log(`Found ${taskCount} tasks`);
            
            // Create batch requests for better performance
            const taskPromises = Array.from({length: taskCount}, (_, i) => 
                this.contract.methods.tasks(i + 1).call()
                    .catch(err => {
                        console.error(`Error fetching task ${i + 1}:`, err);
                        return null;
                    })
            );

            const tasks = await Promise.all(taskPromises);
            
            // Filter out failed requests and validate task structure
            return tasks.filter(task => task !== null).map((task, index) => {
                if (!task || !task.id) {
                    console.warn(`Invalid task structure at index ${index + 1}`);
                    return null;
                }
                return {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    assignedUser: task.assignedUser,
                    timestamp: new Date(parseInt(task.timestamp) * 1000).toISOString(),
                    isCompleted: task.isCompleted
                };
            }).filter(task => task !== null);

        } catch (error) {
            console.error('Critical error in getAllTasks:', {
                message: error.message,
                stack: error.stack,
                contractAddress: this.contract.options.address
            });
            throw error;
        }
    }
    
    
    

}

module.exports = new BlockchainService();