const TaskContract = artifacts.require("TaskManagement");

module.exports = function(deployer) {
  deployer.deploy(TaskContract);
};