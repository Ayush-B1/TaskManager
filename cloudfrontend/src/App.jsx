import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTasks, setFilters } from './store/taskSlice';
import { api, socketService } from './services/api';
import TaskModal from './components/TaskModal';
import ListView from './components/ListView';
import KanbanBoard from './components/KanbanBoard';

function App() {
  const [viewMode, setViewMode] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.getTasks();
        dispatch(setTasks(response.data));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
    socketService.subscribe(fetchTasks);

    return () => socketService.unsubscribe();
}, [dispatch]);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-slate-900">Task Management</h1>
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
          >
            Create Task
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search tasks..."
              className="input flex-1"
              onChange={handleSearch}
            />
            <select
              onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
              className="select"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`btn ${viewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Kanban View
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <ListView onEditTask={handleEditTask} />
        ) : (
          <KanbanBoard onEditTask={handleEditTask} />
        )}

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      </div>
    </div>
  );
}

export default App;
