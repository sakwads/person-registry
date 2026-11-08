# Person Registry

A minimal web app to capture **First name**, **Last name** and **Sex** (Male / Female / Other), stored in an embedded NoSQL document database ([NeDB](https://github.com/seald/nedb) — MongoDB-style API, persisted to a local file). Saved records appear in a scrollable table with a Delete action.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm start
```

Open http://localhost:3000

## Configuration

| Variable  | Default             | Purpose                         |
|-----------|---------------------|---------------------------------|
| `PORT`    | `3000`              | Port the server listens on      |
| `DB_FILE` | `./data/people.db`  | Where the NoSQL data file lives |

## API

| Method | Path               | Body                                   |
|--------|--------------------|----------------------------------------|
| GET    | `/api/people`      | —                                      |
| POST   | `/api/people`      | `{ "firstName", "lastName", "sex" }`   |
| DELETE | `/api/people/:id`  | —                                      |

Each record is stored as a JSON document, e.g.:

```json
{ "_id": "a1B2c3", "firstName": "Jane", "lastName": "Doe", "sex": "Female", "createdAt": "...", "updatedAt": "..." }
```

## Note on hosting

Data is written to a file on the server's disk. On hosts with ephemeral storage, records reset on redeploy unless `DB_FILE` points to a persistent volume.
