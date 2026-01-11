import React, { useState } from 'react';
import {
    Database,
    Code2,
    Terminal,
    Zap,
    ShieldCheck,
    Layers,
    IterationCcw,
    AlertTriangle,
    FileCode2,
    ChevronRight,
    Copy,
    Check
} from 'lucide-react';

const PLSQLCore = () => {
    const [activeConcept, setActiveConcept] = useState('procedure');
    const [copied, setCopied] = useState(false);

    const concepts = [
        {
            id: 'procedure',
            name: 'Stored Procedure',
            icon: Terminal,
            title: 'DRUG_TRAK.add_batch',
            description: 'Used for secure, transactional data entry of new pharmaceutical batches with atomic consistency.',
            code: `CREATE OR REPLACE PROCEDURE add_batch (
    p_name     IN VARCHAR2,
    p_mfg      IN DATE,
    p_exp      IN DATE,
    p_quantity IN NUMBER,
    p_location IN VARCHAR2
) AS
BEGIN
    INSERT INTO batches (drug_name, mfg_date, exp_date, quantity, location)
    VALUES (p_name, p_mfg, p_exp, p_quantity, p_location);
    COMMIT;
END add_batch;`,
            mapping: 'Triggered when you click "Add Batch" in the UI.'
        },
        {
            id: 'function',
            name: 'Stored Function',
            icon: Code2,
            title: 'DRUG_TRAK.get_health_index',
            description: 'Calculates the complex safety and expiration risk score for a specific drug batch.',
            code: `CREATE OR REPLACE FUNCTION get_health_index (
    p_batch_id IN NUMBER
) RETURN NUMBER AS
    v_risk NUMBER;
BEGIN
    SELECT (exp_date - SYSDATE) / 365 * 100 INTO v_risk
    FROM batches WHERE batch_id = p_batch_id;
    RETURN ROUND(GREATEST(0, LEAST(100, v_risk)), 2);
END get_health_index;`,
            mapping: 'Used in Analytics to calculate "Supply Integrity" and "Risk Scores".'
        },
        {
            id: 'cursor',
            name: 'Cursor (FOR Loop)',
            icon: IterationCcw,
            title: 'DRUG_TRAK.process_recall',
            description: 'Iterates through sets of affected batches to apply bulk status updates during recall events.',
            code: `CREATE OR REPLACE PROCEDURE process_recall (
    p_drug_name IN VARCHAR2
) AS
    CURSOR c_batches IS 
        SELECT batch_id FROM batches 
        WHERE drug_name = p_drug_name AND status = 'ACTIVE';
BEGIN
    FOR r_batch IN c_batches LOOP
        UPDATE batches SET status = 'RECALLED', location = 'QUARANTINE'
        WHERE batch_id = r_batch.batch_id;
    END LOOP;
    COMMIT;
END process_recall;`,
            mapping: 'Logic behind the "Recall Confirmation" in the Recall Center.'
        },
        {
            id: 'exception',
            name: 'Exception Handling',
            icon: AlertTriangle,
            title: 'PRAGMA EXCEPTION_INIT',
            description: 'Intercepts database-level errors (like invalid dates or integrity violations) and returns clean responses.',
            code: `EXCEPTION
    WHEN invalid_date_exception THEN
        DBMS_OUTPUT.PUT_LINE('Error: Expiry cannot be before MFG date');
        ROLLBACK;
    WHEN OTHERS THEN
        INSERT INTO error_logs (msg, timestamp)
        VALUES (SQLERRM, SYSDATE);
        RAISE;`,
            mapping: 'Handles the "Invalid Date" validation in the Add Batch form.'
        },
        {
            id: 'trigger',
            name: 'Audit Trigger',
            icon: Zap,
            title: 'TRG_AUDIT_LOG',
            description: 'Automatically captures and archives every state change for compliance and traceability.',
            code: `CREATE OR REPLACE TRIGGER trg_audit_log
    AFTER INSERT OR UPDATE ON batches
    FOR EACH ROW
BEGIN
    INSERT INTO manufacturing_audit (batch_id, action, timestamp)
    VALUES (:NEW.batch_id, 'STATE_CHANGE', SYSDATE);
END;`,
            mapping: 'Populates the "Manufacturing Log" in the Production Line page automatically.'
        },
        {
            id: 'sequence',
            name: 'Database Sequence',
            icon: ShieldCheck,
            title: 'seq_batch_id',
            description: 'Generates globally unique, sequential primary keys for pharmaceutical traceability.',
            code: `CREATE SEQUENCE seq_batch_id
    START WITH 1001
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- Usage in Procedure
INSERT INTO batches (batch_id, ...)
VALUES (seq_batch_id.NEXTVAL, ...);`,
            mapping: 'Auto-generates the "Batch #10XX" IDs seen throughout the app.'
        },
        {
            id: 'package',
            name: 'PL/SQL Package',
            icon: Layers,
            title: 'PACKAGE DRUG_TRAK',
            description: 'The high-level container that bundles all PharmaTrack logic into a clean, modular API.',
            code: `CREATE OR REPLACE PACKAGE DRUG_TRAK AS
    PROCEDURE add_batch(...);
    FUNCTION get_health_index(...) RETURN NUMBER;
    PROCEDURE process_recall(...);
END DRUG_TRAK;

CREATE OR REPLACE PACKAGE BODY DRUG_TRAK AS
    -- Actual implementations go here
END DRUG_TRAK;`,
            mapping: 'The complete system architecture of the PharmaTrack backend.'
        }
    ];

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const current = concepts.find(c => c.id === activeConcept);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto', height: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '12px' }}>
                        <Database size={24} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.03em' }}>PL/SQL System Intelligence</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Enterprise Database Layer Architecture & Business Logic Mapping.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Navigation Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {concepts.map((concept) => (
                        <button
                            key={concept.id}
                            onClick={() => setActiveConcept(concept.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '1px solid',
                                borderColor: activeConcept === concept.id ? 'var(--primary)' : 'var(--border)',
                                background: activeConcept === concept.id ? 'var(--primary)' : 'white',
                                color: activeConcept === concept.id ? 'white' : 'var(--text-dark)',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                textAlign: 'left'
                            }}
                        >
                            <concept.icon size={18} style={{ opacity: activeConcept === concept.id ? 1 : 0.6 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{concept.name}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Concept {concepts.indexOf(concept) + 1} of 7</div>
                            </div>
                            <ChevronRight size={16} style={{ opacity: activeConcept === concept.id ? 1 : 0 }} />
                        </button>
                    ))}

                    <div style={{ marginTop: '24px', padding: '24px', background: '#f8f8f8', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>System Status</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                            <span style={{ fontSize: '0.8125rem', fontWeight: '600' }}>Oracle DB Connected</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            All frontend actions are bound to PL/SQL modules within the <code>DRUG_TRAK</code> package.
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                                    {current.name} (Oracle Professional)
                                </div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                                    {current.title}
                                </h2>
                                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '600px' }}>
                                    {current.description}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#f4f4f4', borderRadius: '12px' }}>
                                <FileCode2 size={18} />
                                <span style={{ fontSize: '0.8125rem', fontWeight: '700' }}>sql_module.v2.3</span>
                            </div>
                        </div>

                        <div style={{ background: '#1e1e1e', borderRadius: '20px', padding: '32px', position: 'relative', marginBottom: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                                <button
                                    onClick={() => handleCopy(current.code)}
                                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy Code'}
                                </button>
                            </div>
                            <pre style={{ margin: 0, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem', color: '#e5e7eb', lineHeight: '1.7', overflow: 'auto' }}>
                                <code>{current.code}</code>
                            </pre>
                        </div>

                        <div style={{ padding: '24px', background: '#fdfdfd', border: '1px solid var(--border)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '4px' }}>Functional UI Mapping</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                    {current.mapping} This ensures data integrity and business logic compliance across the <code>DRUG_TRAK</code> ecosystem.
                                </div>
                            </div>
                        </div>
                    </div>

                    <Database size={300} style={{ position: 'absolute', right: '-100px', bottom: '-100px', opacity: 0.03, color: 'var(--primary)' }} />
                </div>
            </div>
        </div>
    );
};

export default PLSQLCore;
