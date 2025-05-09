module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Ensure this matches the port Ganache is using
      network_id: "*", // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Specify the Solidity version you're using
    },
  },
};