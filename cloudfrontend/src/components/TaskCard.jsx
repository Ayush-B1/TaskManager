import React from 'react';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit }) => {
  const priorityColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <div className="flex gap-2">
          {task.blockchainTxHash && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ✓ Blockchain Verified
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-gray-600 text-sm">{task.description}</p>

        {task.checklist && task.checklist.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Checklist Progress</p>
            <div className="space-y-1">
              {task.checklist.map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className={`mr-2 ${item.completed ? 'text-green-600' : 'text-gray-400'}`}>
                    {item.completed ? '✓' : '○'}
                  </span>
                  <span className={item.completed ? 'line-through text-gray-400' : 'text-gray-600'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Assigned to: {task.assignedUser || 'Unassigned'}</span>
            {task.dueDate && (
              <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            )}
          </div>
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>

        {task.blockchainTxHash && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-500 break-all">
            TX: {task.blockchainTxHash}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;