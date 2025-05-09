import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:3002/api';
const socket = io('http://localhost:3002');

export const api = {
  getTasks: () => axios.get(`${API_URL}/tasks`),
  createTask: (task) => axios.post(`${API_URL}/tasks`, task),
  updateTask: (id, task) => axios.put(`${API_URL}/tasks/${id}`, task),
  deleteTask: (id) => axios.delete(`${API_URL}/tasks/${id}`),
  uploadFile: (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/tasks/${taskId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getTaskFiles: (taskId) => axios.get(`${API_URL}/tasks/${taskId}/files`),

  deleteFile: (taskId, fileId) => axios.delete(`${API_URL}/tasks/${taskId}/files/${fileId}`)
};

export const socketService = {
  subscribe: (callback) => {
    socket.on('taskUpdated', callback);
    socket.on('taskCreated', callback);
    socket.on('taskDeleted', callback);
  },
  unsubscribe: () => {
    socket.off('taskUpdated');
    socket.off('taskCreated');
    socket.off('taskDeleted');
  }
};