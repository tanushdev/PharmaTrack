# PharmaTrack - Pharmaceutical Supply Chain & Traceability System

**PharmaTrack** is an enterprise-grade batch traceability system designed to ensure the safety, integrity, and compliance of pharmaceutical products. It features real-time production monitoring, global distribution tracking, and FDA-compliant audit logging.

## Key Features

*   **SQLite Backend Persistence**: Data is securely stored on disk ("without caching") using a specialized SQLite database.
*   **Real-Time Production Line**: Visual monitoring of manufacturing throughput, line utilization, and batch status.
*   **Global Distribution Hub**: Tracking of batches across Primary, Cold Nexus, and Regional hubs with interactive dispatch controls.
*   **Compliance & Audit**: Automatic `audit_logs` for every batch creation, dispatch, or recall event, simulating an Oracle `DRUG_TRAK` environment.
*   **Recall Center**: "One-Click" batch recall system that triggers quarantine protocols across the entire supply chain.

## Technology Stack

*   **Frontend**: React (Vite), Lucide-React Icons, Glassmorphism UI
*   **Backend**: Node.js, Express.js
*   **Database**: SQLite3 (Persistent file storage)

## Getting Started

To run the full application (Frontend + Backend), you will need two terminal windows.

### 1. Start the Backend Server
This handles the database connections and API endpoints.

```bash
cd server
npm install  # First time only
node server.js
```
*Port: 5000*

### 2. Start the Frontend Client
This launches the user interface.

```bash
cd client
npm install  # First time only
npm run dev
```
*Port: 5173 (usually)*

## API Architecture

The system uses a RESTful API to communicate with the SQLite database:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/batches` | Retrieve all active, recalled, and dispatched batches. |
| `POST` | `/api/batches` | Create a new batch (triggers `add_batch` logic). |
| `POST` | `/api/batches/:id/dispatch` | Dispatch a batch to a new location. |
| `POST` | `/api/recall` | Process a recall for a specific drug name. |
| `GET` | `/api/validate` | Run system validation checks. |

## Default Seed Data

The system comes pre-seeded with **15 realistic medication batches** across various production lines (Solid Dosage, Injectables, Packaging) to demonstrate the analytics capabilities immediately upon start.
