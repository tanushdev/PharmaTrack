const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'pharma_v2.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
    }
});

// Initialize Tables
db.serialize(() => {
    // Drops to ensure schema compatibility during transition
    // db.run("DROP TABLE IF EXISTS batches"); 

    // Batches Table
    db.run(`CREATE TABLE IF NOT EXISTS batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        mfg TEXT NOT NULL,
        exp TEXT NOT NULL,
        quantity INTEGER DEFAULT 0,
        location TEXT,
        status TEXT DEFAULT 'ACTIVE',
        quality_grade TEXT,
        line TEXT
    )`, (err) => {
        if (err) console.error('Error creating batches table:', err.message);
    });

    // Audit Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        batch_id INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        details TEXT
    )`, (err) => {
        if (err) console.error('Error creating audit_logs table:', err.message);
    });

    // Seed data if empty
    db.get("SELECT COUNT(*) as count FROM batches", (err, row) => {
        if (row && row.count <= 3) { // Seed if we only have the initial 3 or none
            console.log('Seeding 15 medication records...');
            const initialBatches = [
                ['Paracetamol 500mg', '2024-01-10', '2026-06-15', 5000, 'Warehouse A', 'ACTIVE', 'A+', 'Solid Dosage A'],
                ['Amoxicillin 250mg', '2023-11-20', '2026-12-20', 2500, 'Warehouse B', 'ACTIVE', 'A', 'Solid Dosage A'],
                ['Insulin Glargine', '2024-02-05', '2027-02-05', 1200, 'Cold Storage', 'ACTIVE', 'A+', 'Injectables'],
                ['Metformin 850mg', '2023-05-12', '2025-05-12', 3000, 'Warehouse C', 'ACTIVE', 'B', 'Solid Dosage A'],
                ['Lisinopril 10mg', '2024-03-15', '2027-03-15', 4500, 'Warehouse A', 'ACTIVE', 'A+', 'Solid Dosage A'],
                ['Atorvastatin 20mg', '2023-08-20', '2026-08-20', 6000, 'Distribution Center', 'ACTIVE', 'A', 'Packaging'],
                ['Omeprazole 40mg', '2024-01-05', '2026-01-05', 3500, 'Warehouse B', 'ACTIVE', 'A', 'Solid Dosage A'],
                ['Aspirin 81mg', '2023-12-01', '2025-12-01', 8000, 'Warehouse C', 'ACTIVE', 'A', 'Solid Dosage A'],
                ['Furosemide 20mg', '2024-02-14', '2027-02-14', 2000, 'Cold Storage', 'ACTIVE', 'A+', 'Injectables'],
                ['Gabapentin 300mg', '2023-10-10', '2025-10-10', 4000, 'Distribution Center', 'ACTIVE', 'B', 'Solid Dosage A'],
                ['Sertraline 50mg', '2024-04-01', '2027-04-01', 5500, 'Warehouse A', 'ACTIVE', 'A+', 'Solid Dosage A'],
                ['Montelukast 10mg', '2023-11-15', '2026-11-15', 3200, 'Warehouse B', 'ACTIVE', 'A', 'Solid Dosage A'],
                ['Levothyroxine 50mcg', '2024-01-20', '2026-01-20', 1500, 'Cold Storage', 'ACTIVE', 'A+', 'Injectables'],
                ['Amlodipine 5mg', '2023-09-30', '2025-09-30', 4800, 'Warehouse C', 'ACTIVE', 'A', 'Solid Dosage A'],
                ['Prednisone 5mg', '2024-03-01', '2027-03-01', 2200, 'Distribution Center', 'ACTIVE', 'A+', 'Solid Dosage A']
            ];

            const stmt = db.prepare("INSERT INTO batches (name, mfg, exp, quantity, location, status, quality_grade, line) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            initialBatches.forEach(b => stmt.run(b));
            stmt.finalize();
        }
    });
});

module.exports = db;
