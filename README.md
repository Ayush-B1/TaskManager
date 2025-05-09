# Task Management Application

A full-stack application designed for efficient task management, featuring multiple views, real-time collaboration, and detailed task tracking.

## Features

-   **CRUD Operations**: Create, Read, Update, and Delete tasks.
-   **Dual Views**:
    -   **List View**: A comprehensive list of all tasks.
    -   **Kanban Board View**: Organize tasks in columns (e.g., Pending, In Progress, Completed) with drag-and-drop functionality.
-   **Real-time Updates**: Task changes are reflected instantly across all connected clients using Socket.IO.
-   **Rich Task Details**:
    -   Title & Description
    -   Status (e.g., Pending, In Progress, Completed)
    -   Priority (e.g., High, Medium, Low)
    -   Due Date
    -   Assigned User
    -   Checklist with progress tracking
    -   File Attachments
-   **Search & Filtering**:
    -   Search tasks by keywords.
    -   Filter tasks by their status.
-   **User-Friendly Interface**: Intuitive modal for creating and editing tasks, styled with Tailwind CSS.

## Tech Stack

### Frontend

-   **React**: JavaScript library for building user interfaces (using Vite for a fast development experience).
-   **Redux Toolkit**: For efficient state management.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **@hello-pangea/dnd**: For drag-and-drop functionality in the Kanban board.
-   **socket.io-client**: For real-time communication with the backend.
-   **date-fns**: For date formatting.

### Backend

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web application framework for Node.js.
-   **MongoDB**: NoSQL database for storing task data.
    -   **Mongoose**: ODM library for MongoDB and Node.js.
-   **Socket.IO**: Enables real-time, bidirectional event-based communication.
-   **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads.

## Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js**: Version 16.x or higher (includes npm). You can download it from [nodejs.org](https://nodejs.org/).
-   **MongoDB**: A running instance of MongoDB (local or a cloud service like MongoDB Atlas). You can find installation instructions at [mongodb.com](https://www.mongodb.com/try/download/community).

## Project Structure

The project is organized into two main directories:

-   `cloudfrontend/`: Contains the React frontend application.
-   `backend/`: Contains the Node.js Express backend server and API logic.

## Setup and Installation

1.  **Clone the repository (or navigate to your existing project directory):**
    If you haven't cloned it yet:
    ```bash
    git clone https://github.com/Ayush-B1/Task-Management.git
    cd Task-Management
    ```
    If you are in your project directory (`/Users/admin/Desktop/cloudfrontend 2`), you can skip this cloning step.

2.  **Set up the Backend:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory (`backend/.env`) and add the following environment variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string_here # e.g., mongodb://localhost:27017/task_management_db
    PORT=3002 # Port for the backend server
    ```

3.  **Set up the Frontend:**
    Navigate back to the project root if needed, then into the frontend directory:
    ```bash
    cd ../cloudfrontend # Or simply 'cd cloudfrontend' if you are in the project root
    npm install
    ```
    Create a `.env` file in the `cloudfrontend` directory (`cloudfrontend/.env`) and add the following environment variables:
    ```env
    VITE_API_URL=http://localhost:3002/api
    VITE_SOCKET_URL=http://localhost:3002
    ```
    (Ensure the `PORT` in `VITE_API_URL` and `VITE_SOCKET_URL` matches the `PORT` specified in the backend's `.env` file.)

## Running the Application

1.  **Start the Backend Server:**
    Open a terminal, navigate to the `backend` directory, and run:
    ```bash
    npm start
    ```
    The backend server should start, typically on `http://localhost:3002` (or the port you configured).

2.  **Start the Frontend Development Server:**
    Open another terminal, navigate to the `cloudfrontend` directory, and run:
    ```bash
    npm run dev
    ```
    The frontend development server will start, usually on `http://localhost:5173` (Vite will indicate the exact port).

3.  **Access the Application:**
    Open your web browser and go to `http://localhost:5173` (or the port shown by Vite).

---

This README should provide a good overview for anyone looking at your project.
