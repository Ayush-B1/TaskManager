const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jiraService = require('../services/jiraService');

router.post('/', async (req, res) => {
  try {
    console.log('Creating new task with Jira integration:', req.body);
    const task = new Task(req.body);
    
    // Create Jira issue first
    console.log('Initiating Jira issue creation...');
    const jiraIssue = await jiraService.createIssue(task);
    console.log('Jira issue created:', jiraIssue.key);
    
    task.jiraKey = jiraIssue.key;
    const savedTask = await task.save();
    
    console.log('Task saved successfully with Jira key:', savedTask.jiraKey);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error in task creation:', error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update Jira issue if it exists
    if (task.jiraKey) {
      await jiraService.updateIssue(task.jiraKey, req.body);
    }

    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete Jira issue if it exists
    if (task.jiraKey) {
      await jiraService.deleteIssue(task.jiraKey);
    }

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update Jira issue if exists
    if (task.jiraKey) {
      try {
        await jiraService.updateIssue(task.jiraKey, req.body);
      } catch (jiraError) {
        console.error('Error updating Jira issue:', jiraError);
      }
    }

    Object.assign(task, req.body);
    const updatedTask = await task.save();
    
    const io = req.app.get('io');
    io.emit('taskUpdated', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update Jira issue if exists
    if (task.jiraKey) {
      try {
        await jiraService.updateIssue(task.jiraKey, task);
      } catch (jiraError) {
        console.error('Error updating Jira issue:', jiraError);
      }
    }
    
    const io = req.app.get('io');
    io.emit('taskUpdated', task);
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const io = req.app.get('io');
    io.emit('taskDeleted', req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;