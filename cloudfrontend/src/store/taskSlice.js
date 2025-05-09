import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  filters: {
    search: '',
    status: 'all',
    assignedUser: 'all'
  }
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload); // Add new task at the beginning
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  }
});

export const { setTasks, addTask, updateTask, deleteTask, setFilters } = taskSlice.actions;
export default taskSlice.reducer;