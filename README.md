# node_api

A simple Node.js REST API with JWT authentication and a MySQL database, run with Docker Compose.

## Requirements

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose **2.22 or later** (needed for `watch`). Check with `docker compose version`.

Node.js and MySQL are not needed on your machine: both run in containers (`node:20-alpine` and `mysql:latest`).

## Project structure

```
.
├── .env.example          # template for the environment variables
├── docker-compose.yaml   # app + mysql services
└── backend/              # Express app (build context of the app image)
    ├── Dockerfile
    ├── index.js
    ├── controllers/  routes/  middlewares/
    └── database/
        └── schema.sql    # run by MySQL on first start
```

## Getting started

1. **Create the `.env` file** in the project root from the template:

   ```bash
   cp .env.example .env
   ```

   Then fill in the empty values (`DB_USER`, `DB_NAME`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `JWT_SECRET`). `DB_HOST` is ignored: inside Compose the app always reaches the database at `mysql`.

2. **Build and start the containers:**

   ```bash
   docker compose up -d --build
   ```

   The app waits for MySQL to be healthy before starting. On the first start MySQL creates the database and runs `backend/database/schema.sql`.

3. **Check that it is running:**

   ```bash
   docker compose ps
   ```

   The API listens on `http://localhost:${APP_PORT}` (`5050` by default), bound to `127.0.0.1` only.

## Development

To sync code changes into the container automatically, start the file watcher in a separate terminal:

```bash
docker compose watch --no-up
```

- Changes in `backend/` are copied into the container and the app is restarted.
- Changes in `backend/package.json` rebuild the image.
- `node_modules/` is never synced: dependencies are installed inside the image.

Without the watcher, changes reach the container only after a rebuild (`docker compose up -d --build`).

Useful commands:

| Command | Description |
|---|---|
| `docker compose logs -f app` | Follow the app logs |
| `docker compose down` | Stop and remove the containers |
| `docker compose down -v` | Same, and delete the database volume (`schema.sql` runs again on next start) |

## API

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Create a user (`username`, `email`, `password`) |
| `POST` | `/auth/login` | — | Get a JWT (`username`, `password`) |
| `GET` | `/users` | Bearer token | List users |
| `GET` | `/users/:user_id` | Bearer token | Get a user |
| `POST` | `/users` | Bearer token | Create a user |
| `PATCH` | `/users/:user_id` | Bearer token | Update a user |
| `DELETE` | `/users/:user_id` | Bearer token | Delete a user |

Example:

```bash
curl -sS localhost:5050/auth/login --json '{"username":"testuser01","password":"Test1234!x"}'
curl -sS localhost:5050/users -H 'Authorization: Bearer <token>'
```
