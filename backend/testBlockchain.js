const blockchainService = require('./services/blockchainService');

async function test() {
  try {
    console.log('Testing blockchain connection...');
    const tasks = await blockchainService.getAllTasks();
    console.log('Tasks:', tasks);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();