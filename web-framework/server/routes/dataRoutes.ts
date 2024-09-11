import { Router } from 'express';
import { openDb } from '../database';

const router = Router();

// get user
router.get('/', async (req, res) => {
  const db = await openDb();
  const users = await db.all('SELECT * FROM users');
  res.json(users);
});

// add user
router.post('/', async (req, res) => {
  const { name, age } = req.body;
  const db = await openDb();
  const result = await db.run('INSERT INTO users (name, age) VALUES (?, ?)', [name, age]);
  res.json({ id: result.lastID });
});

// update user
router.put('/:id', async (req, res) => {
  const { name, age } = req.body;
  const { id } = req.params;
  const db = await openDb();
  await db.run('UPDATE users SET name = ?, age = ? WHERE id = ?', [name, age, id]);
  res.sendStatus(200);
});

// delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await openDb();
  await db.run('DELETE FROM users WHERE id = ?', [id]);
  res.sendStatus(200);
});

export default router;
