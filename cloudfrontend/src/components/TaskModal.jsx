import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../store/taskSlice';
import { api } from '../services/api';

const TaskModal = ({ isOpen, onClose, task = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedUser: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    checklist: [] // Add checklist array
  });
  const [files, setFiles] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assignedUser: task.assignedUser || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate || '',
        checklist: task.checklist || [] // Initialize checklist from task
      });
      // Load task files if task exists
      const loadFiles = async () => {
        try {
          const response = await api.getTaskFiles(task._id);
          setFiles(response.data);
        } catch (error) {
          console.error('Error loading files:', error);
        }
      };
      loadFiles();
    }
  }, [task]);

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData({
        ...formData,
        checklist: [
          ...formData.checklist,
          { text: newChecklistItem.trim(), completed: false }
        ]
      });
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = async (index) => {
    try {
      // Create a deep copy of the checklist array
      const updatedChecklist = JSON.parse(JSON.stringify(formData.checklist));
      updatedChecklist[index].completed = !updatedChecklist[index].completed;
      
      // Update local state immediately for UI responsiveness
      setFormData(prevState => ({
        ...prevState,
        checklist: updatedChecklist
      }));

      // Only make API call if we're editing an existing task
      if (task && task._id) {
        const updatedFormData = {
          ...formData,
          checklist: updatedChecklist
        };
        const response = await api.updateTask(task._id, updatedFormData);
        dispatch(updateTask(response.data));
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
      // Revert the change if update fails
      const revertedChecklist = [...formData.checklist];
      revertedChecklist[index].completed = !revertedChecklist[index].completed;
      setFormData(prevState => ({
        ...prevState,
        checklist: revertedChecklist
      }));
    }
  };

  const handleRemoveChecklistItem = (index) => {
    const updatedChecklist = formData.checklist.filter((_, i) => i !== index);
    setFormData({ ...formData, checklist: updatedChecklist });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        const response = await api.updateTask(task._id, formData);
        dispatch(updateTask(response.data));
      } else {
        const response = await api.createTask(formData);
        // Create corresponding Jira issue
        try {
          await jiraService.createIssue(response.data);
        } catch (jiraError) {
          console.error('Error creating Jira issue:', jiraError);
          // Continue with task creation even if Jira creation fails
        }
        dispatch(addTask(response.data));
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await api.uploadFile(task._id, file);
      setFiles([...files, response.data]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      await api.deleteFile(task._id, fileId);
      setFiles(files.filter(f => f._id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                className="input w-full"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="input w-full h-32"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Checklist
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add checklist item..."
                />
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                {formData.checklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklistItem(index)}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                    />
                    <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-80 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="select w-full"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <input
                type="text"
                className="input w-full"
                value={formData.assignedUser}
                onChange={(e) => setFormData({ ...formData, assignedUser: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="select w-full"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="input w-full"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            {task && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Files
                </label>
                <input
                  type="file"
                  className="w-full"
                  onChange={handleFileUpload}
                  multiple
                />
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((file) => (
                      <div key={file._id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{file.originalName}</span>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(file._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;