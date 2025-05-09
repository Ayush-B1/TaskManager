const blockchainService = require('./services/blockchainService');

async function viewBlockchainData() {
  try {
    const tasks = await blockchainService.getAllTasks();
    console.log('All tasks:', tasks);
  } catch (error) {
    console.error('Error:', error);
  }
}

viewBlockchainData();