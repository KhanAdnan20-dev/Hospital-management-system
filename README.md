# Hospital Management System

## Run the backend

1. Create and activate a Python virtual environment.
2. Install dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Set your database URL:

```bash
cp .env.example .env
```

4. Start the API:

```bash
uvicorn backend.main:app --reload
```

The backend runs on `http://localhost:8000`.

## Run the frontend

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Start the React app:

```bash
npm run dev
```

The frontend runs with Vite and should connect to the API at `http://localhost:8000`.