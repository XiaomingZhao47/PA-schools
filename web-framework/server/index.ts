import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { openDb } from './database';
import dataRoutes from './routes/dataRoutes';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/data', dataRoutes);

openDb().then(async (db) => {
  await db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)');
});

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
