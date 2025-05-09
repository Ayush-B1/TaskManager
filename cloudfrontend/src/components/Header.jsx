import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <div className="app-header">
      <h1 className="app-title">Task Management</h1>
      <div className="header-actions">
        <input
          type="text"
          placeholder="Search tasks..."
          className="search-input"
        />
        <ThemeToggle />
        <button className="btn btn-primary">Create Task</button>
      </div>
    </div>
  );
};

export default Header;