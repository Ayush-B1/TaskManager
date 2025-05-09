import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import { updateTask } from '../store/taskSlice';
import { api } from '../services/api';

const TaskBoard = () => {
  const tasks = useSelector(state => state.tasks.tasks);
  console.log('Current tasks:', tasks); // Add this debug line
  const dispatch = useDispatch();

  const columns = {
    Pending: tasks.filter(task => task.status === 'Pending'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    Completed: tasks.filter(task => task.status === 'Completed')
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // If dropped outside a valid droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Find the task that was dragged
    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;

    // Update task status based on destination column
    const updatedTask = {
      ...task,
      status: destination.droppableId
    };

    try {
      // Update in backend
      const response = await api.updateTask(task._id, updatedTask);
      // Update in Redux store
      dispatch(updateTask(response.data));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-4">
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
                          className={`bg-white rounded-lg p-4 shadow ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {task.description}
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
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

export default TaskBoard;