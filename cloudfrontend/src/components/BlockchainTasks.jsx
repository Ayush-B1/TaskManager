import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlockchainTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/blockchain/tasks');
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blockchain tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div className="p-4">Loading blockchain tasks...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Blockchain Tasks</h2>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p className="text-gray-600 mt-2">{task.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className={`px-2 py-1 rounded ${
                task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
              <span className="text-sm text-gray-500">
                Assigned to: {task.assignedUser}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Created: {new Date(task.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainTasks; 