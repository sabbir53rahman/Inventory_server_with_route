

import express from 'express'; 
import cors from 'cors'; 
import router from './src/app/route/route.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
const app = express();

// Enable CORS for all routes
app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://inventory-client-sjt1.onrender.com",
      ],
      credentials: true,
    })
  );

// Middleware for parsing JSON bodies
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.at16f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    // strict: true,
    deprecationErrors: true,
  },
});


await client.connect();

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express server!' });
});

// Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});