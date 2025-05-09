const { MongoClient } = require('mongodb');

async function initializeDatabase() {
    const uri = 'mongodb://localhost:27017/taskmanager';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('taskmanager');

        // Create collections
        await db.createCollection('tasks');
        await db.createCollection('users');

        // Create indexes
        await db.collection('tasks').createIndex({ title: 1 });
        await db.collection('users').createIndex({ email: 1 }, { unique: true });

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await client.close();
    }
}

initializeDatabase();