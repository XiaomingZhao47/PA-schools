import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { openDb } from './database';
import dataRoutes from './routes/dataRoutes';

const app = express();
const port = 5001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

// routes
app.use('/api/data', dataRoutes);

openDb().then(async (db) => {
  await db.exec('CREATE TABLE IF NOT EXISTS schools (id INTEGER PRIMARY KEY, school_name TEXT, location TEXT)');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
