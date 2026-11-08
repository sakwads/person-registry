const express = require('express');
const path = require('path');
const Datastore = require('@seald-io/nedb');

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'people.db');
const SEX_OPTIONS = ['Male', 'Female', 'Other'];

// Embedded NoSQL document store (MongoDB-like API), persisted to a file
const db = new Datastore({ filename: DB_FILE, autoload: true, timestampData: true });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// List all records (newest first)
app.get('/api/people', async (req, res) => {
  try {
    const people = await db.findAsync({}).sort({ createdAt: -1 });
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load records' });
  }
});

// Create a record
app.post('/api/people', async (req, res) => {
  const firstName = String(req.body.firstName || '').trim();
  const lastName = String(req.body.lastName || '').trim();
  const sex = String(req.body.sex || '').trim();

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }
  if (!SEX_OPTIONS.includes(sex)) {
    return res.status(400).json({ error: 'Sex must be Male, Female or Other' });
  }

  try {
    const doc = await db.insertAsync({ firstName, lastName, sex });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save record' });
  }
});

// Delete a record
app.delete('/api/people/:id', async (req, res) => {
  try {
    const removed = await db.removeAsync({ _id: req.params.id }, {});
    if (!removed) return res.status(404).json({ error: 'Record not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

app.listen(PORT, () => {
  console.log(`Person Registry running on http://localhost:${PORT}`);
});
