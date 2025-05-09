// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskManagement {
    struct Task {
        uint256 id;
        string title;
        string description;
        string status;
        string assignedUser;
        uint256 timestamp;
        bool isCompleted;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    event TaskCreated(uint256 id, string title, string assignedUser);
    event TaskUpdated(uint256 id, string status);
    event TaskCompleted(uint256 id);

    function createTask(string memory _title, string memory _description, string memory _assignedUser) public {
        taskCount++;
        tasks[taskCount] = Task(
            taskCount,
            _title,
            _description,
            "Pending",
            _assignedUser,
            block.timestamp,
            false
        );
        emit TaskCreated(taskCount, _title, _assignedUser);
    }

    function updateTaskStatus(uint256 _id, string memory _status) public {
        require(_id <= taskCount, "Task does not exist");
        Task storage task = tasks[_id];
        task.status = _status;
        emit TaskUpdated(_id, _status);
    }

    function completeTask(uint256 _id) public {
        require(_id <= taskCount, "Task does not exist");
        Task storage task = tasks[_id];
        task.isCompleted = true;
        task.status = "Completed";
        emit TaskCompleted(_id);
    }
}