import React from 'react';
import { useSelector } from 'react-redux';
import TaskCard from './TaskCard';

const ListView = ({ onEditTask }) => {
  const tasks = useSelector((state) => {
    const allTasks = state.tasks.tasks;
    const filters = state.tasks.filters;
    
    return allTasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
};

export default ListView;