import React from 'react';
import { Terminal, Database, RefreshCw, ShieldCheck, AlertTriangle, Code, Package, Zap } from 'lucide-react';

const concepts = [
    {
        id: 1,
        title: "Stored Procedure",
        desc: "INSERT / UPDATE operations with validation",
        icon: Database,
        snippet: "PROCEDURE add_batch(...)"
    },
    {
        id: 2,
        title: "Stored Function",
        desc: "Returns calculated health status",
        icon: Zap,
        snippet: "FUNCTION get_batch_status(...)"
    },
    {
        id: 3,
        title: "Cursor FOR Loop",
        desc: "Multi-row processing for recalls",
        icon: RefreshCw,
        snippet: "FOR r_batch IN (...) LOOP"
    },
    {
        id: 4,
        title: "Exception Handling",
        desc: "Error management & rollback",
        icon: ShieldCheck,
        snippet: "EXCEPTION WHEN ... THEN"
    },
    {
        id: 5,
        title: "Database Trigger",
        desc: "Automatic FDA audit logging",
        icon: AlertTriangle,
        snippet: "AFTER INSERT OR DELETE"
    },
    {
        id: 6,
        title: "Sequence",
        desc: "Auto-generated batch IDs",
        icon: Code,
        snippet: "batch_id_seq.NEXTVAL"
    },
    {
        id: 7,
        title: "Package",
        desc: "Modular DRUG_TRAK API",
        icon: Package,
        snippet: "CREATE PACKAGE drug_trak"
    }
];

const PLSQLShowcase = () => {
    return (
        <div>
            <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {concepts.map((concept) => {
                    const IconComponent = concept.icon;
                    return (
                        <div key={concept.id} className="stat-card" style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    padding: '10px',
                                    background: '#f3f4f6',
                                    borderRadius: '8px'
                                }}>
                                    <IconComponent size={20} style={{ color: '#374151' }} />
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>
                                        {concept.id}. {concept.title}
                                    </h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        {concept.desc}
                                    </p>
                                </div>
                            </div>
                            <div style={{
                                background: '#1f2937',
                                borderRadius: '8px',
                                padding: '12px',
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                color: '#93c5fd'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#6b7280' }}>
                                    <Terminal size={12} />
                                    <span>PL/SQL</span>
                                </div>
                                <code>{concept.snippet}</code>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PLSQLShowcase;
