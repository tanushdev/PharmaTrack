-- ==========================================
-- 6️⃣ SEQUENCE: Auto-generates primary keys
-- ==========================================
CREATE SEQUENCE batch_id_seq START WITH 1001 INCREMENT BY 1;
CREATE SEQUENCE log_id_seq START WITH 1 INCREMENT BY 1;

-- ==========================================
-- TABLES: Core data structures
-- ==========================================

-- Drugs catalog
CREATE TABLE drugs (
    drug_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    manufacturer VARCHAR2(100),
    category VARCHAR2(50)
);

-- Batches tracking
CREATE TABLE batches (
    batch_id NUMBER PRIMARY KEY,
    drug_id NUMBER REFERENCES drugs(drug_id),
    mfg_date DATE NOT NULL,
    exp_date DATE NOT NULL,
    quantity NUMBER DEFAULT 0,
    status VARCHAR2(20) DEFAULT 'ACTIVE', -- ACTIVE, RECALLED, EXPIRED
    location VARCHAR2(100)
);

-- Audit logs for FDA traceability
CREATE TABLE audit_logs (
    log_id NUMBER PRIMARY KEY,
    table_name VARCHAR2(30),
    action VARCHAR2(20),
    record_id NUMBER,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR2(50)
);

-- Seed Data
INSERT INTO drugs VALUES (1, 'Paracetamol 500mg', 'PharmaCorp', 'Analgesic');
INSERT INTO drugs VALUES (2, 'Amoxicillin 250mg', 'BioHealth', 'Antibiotic');
INSERT INTO drugs VALUES (3, 'Insulin Glargine', 'MediLife', 'Diabetes');
commit;
