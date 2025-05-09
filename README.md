# Task Management Application

A modern task management application built with React, Node.js, and Blockchain integration. This application allows users to manage tasks with both traditional database storage and blockchain verification.

## Features

- **Dual View System**: Switch between List and Kanban board views
- **Drag-and-Drop**: Intuitive task management in Kanban view
- **Real-time Updates**: Using Socket.IO for live task updates
- **Blockchain Integration**: Task verification using Ethereum smart contracts
- **Jira Integration**: Synchronize tasks with Jira project management
- **Rich Task Details**: 
  - Priority levels
  - Status tracking
  - Due dates
  - Checklists
  - File attachments
- **Search & Filter**: Easy task filtering by status and search terms
- **Responsive Design**: Built with Tailwind CSS for a modern, responsive UI

## Tech Stack

### Frontend
- React
- Redux Toolkit for state management
- Tailwind CSS for styling
- Socket.IO client for real-time updates
- Axios for API communication
- @hello-pangea/dnd for drag-and-drop functionality

### Backend
- Node.js & Express
- MongoDB with Mongoose
- Web3.js for blockchain integration
- Socket.IO for real-time communication
- Jira API integration
- Multer for file uploads

### Blockchain
- Solidity smart contract
- Ethereum network integration

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Ethereum network access (local or testnet)
- Jira account (for Jira integration)

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend