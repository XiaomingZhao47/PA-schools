import { Router } from 'express';
import { openDb } from '../database';

const router = Router();

// READ
router.get('/', async (req, res) => {
  const db = await openDb();
  const schools = await db.all('SELECT * FROM schools');
  res.json(schools);
});

// CREATE
router.post('/', async (req, res) => {
  const { school_name, location } = req.body;
  const db = await openDb();
  const result = await db.run('INSERT INTO schools (school_name, location) VALUES (?, ?)', [school_name, location]);
  res.json({ id: result.lastID });
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { school_name, location } = req.body;
  const { id } = req.params;
  const db = await openDb();
  await db.run('UPDATE schools SET school_name = ?, location = ? WHERE id = ?', [school_name, location, id]);
  res.sendStatus(200);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await openDb();

  console.log(`${id}: id`)
  if (id === "*") {
    console.log("Running all")
    await db.run('DELETE FROM schools');
  }
  await db.run('DELETE FROM schools WHERE id = ?', [id]);
  res.sendStatus(200);
});

// SEARCH
router.get('/search', async (req, res) => {
  const searchQuery = req.query.q as string;
  const db = await openDb();
  const schools = await db.all('SELECT * FROM schools WHERE school_name LIKE ?', [`%${searchQuery}%`]);
  res.json(schools);
});

export default router;

