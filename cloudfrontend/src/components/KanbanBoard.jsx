import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../store/taskSlice';
import { api } from '../services/api';

const KanbanBoard = ({ onEditTask }) => {
  const tasks = useSelector(state => state.tasks.tasks);
  const filters = useSelector(state => state.tasks.filters);
  const dispatch = useDispatch();

  // Filter tasks based on search and status filters
  const filteredTasks = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignedUser.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      
      return matchesSearch && matchesStatus;
  });

  const columns = {
    Pending: filteredTasks.filter(task => task.status === 'Pending'),
    'In Progress': filteredTasks.filter(task => task.status === 'In Progress'),
    Completed: filteredTasks.filter(task => task.status === 'Completed')
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;

    const updatedTask = {
      ...task,
      status: destination.droppableId
    };

    try {
      const response = await api.updateTask(task._id, updatedTask);
      dispatch(updateTask(response.data));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      dispatch(deleteTask(taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, tasks]) => (
          <div key={status} className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">{status}</h2>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 min-h-[200px]"
                >
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white rounded-lg p-4 shadow cursor-pointer relative ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(task._id);
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                          <div onClick={() => onEditTask(task)} className="cursor-pointer">
                            <h3 className="font-medium truncate pr-6">{task.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                            {task.checklist && task.checklist.length > 0 && (
                              <div className="mt-2">
                                <div className="text-sm text-gray-600">
                                  Checklist ({task.checklist.filter(item => item.completed).length}/{task.checklist.length})
                                </div>
                                <div className="mt-1 max-h-[120px] overflow-y-auto overflow-x-auto custom-scrollbar">
                                  <div className="min-w-[200px] pr-2">
                                    {task.checklist.map((item, index) => (
                                      <div key={index} className="flex items-start gap-2 py-1">
                                        <input
                                          type="checkbox"
                                          checked={item.completed}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            const updatedTask = {
                                              ...task,
                                              checklist: task.checklist.map((i, idx) =>
                                                idx === index ? { ...i, completed: !i.completed } : i
                                              )
                                            };
                                            dispatch(updateTask(updatedTask));
                                            api.updateTask(task._id, updatedTask);
                                          }}
                                          className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0"
                                        />
                                        <span 
                                          className={`text-sm ${item.completed ? 'line-through text-gray-500' : ''} break-words flex-1`}
                                        >
                                          {item.text}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-sm text-gray-500 truncate max-w-[50%]">
                                {task.assignedUser}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;