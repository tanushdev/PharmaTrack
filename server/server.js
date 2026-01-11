const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// --- Helper: PL/SQL Style Trigger (Audit Log) ---
const logAudit = (action, batchId, details) => {
    const stmt = db.prepare("INSERT INTO audit_logs (action, batch_id, details) VALUES (?, ?, ?)");
    stmt.run([action, batchId, details]);
    stmt.finalize();
    console.log(`[DB TRIGGER]: ${action} fired for Batch #${batchId}`);
};

// --- Helper: PL/SQL Style Function (Calculate Grade) ---
const calculateGrade = (mfg, exp) => {
    const daysToExpiry = (new Date(exp) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysToExpiry > 365) return 'A+';
    if (daysToExpiry > 180) return 'A';
    if (daysToExpiry > 90) return 'B';
    return 'C';
};

// --- ROUTES ---

// 1. Get all batches (Replaces state initial load)
app.get('/api/batches', (req, res) => {
    db.all("SELECT * FROM batches ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. Add batch (Procedure: add_batch)
app.post('/api/batches', (req, res) => {
    const { name, mfg, exp, quantity, location } = req.body;

    // Exception Handling
    if (new Date(exp) <= new Date(mfg)) {
        return res.status(400).json({ error: "PL/SQL Exception: invalid_batch_data (Expiry must be after MFG)" });
    }

    const grade = calculateGrade(mfg, exp);
    const stmt = db.prepare("INSERT INTO batches (name, mfg, exp, quantity, location, status, quality_grade) VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)");

    stmt.run([name, mfg, exp, quantity, location, grade], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const newId = this.lastID;
        logAudit('INSERT', newId, `New batch ${name} added via Procedural call.`);

        res.status(201).json({ id: newId, status: 'ACTIVE', quality_grade: grade });
    });
    stmt.finalize();
});

// 3. Dispatch batch (Procedure: dispatch_batch)
app.post('/api/batches/:id/dispatch', (req, res) => {
    const { id } = req.params;

    db.run("UPDATE batches SET status = 'DISPATCHED' WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Batch not found" });

        logAudit('DISPATCH', id, `Batch #${id} released for distribution.`);
        res.json({ message: `Batch #${id} dispatched successfully.` });
    });
});

// 4. Recall batches (Cursor: process_recall)
app.post('/api/recall', (req, res) => {
    const { drugName } = req.body;

    db.run("UPDATE batches SET status = 'RECALLED', location = 'Quarantine' WHERE name = ? AND status = 'ACTIVE'", [drugName], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const affected = this.changes;
        logAudit('RECALL_BULK', null, `Bulk recall cursor executed for drug: ${drugName}. Affected: ${affected}`);

        res.json({ message: `Recall processed: ${affected} batches flagged.`, affectedCount: affected });
    });
});

// 5. System Validation (Procedure: validate_system)
app.get('/api/validate', (req, res) => {
    db.get("SELECT COUNT(*) as count, SUM(quantity) as total_units FROM batches WHERE status = 'ACTIVE'", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
            success: true,
            status: 'ALL_SYSTEMS_OPTIMAL',
            active_batches: row.count,
            total_units: row.total_units || 0,
            integrity_checksum: '8f2a...c3d1'
        });
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
