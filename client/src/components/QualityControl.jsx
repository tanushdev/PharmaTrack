import React, { useMemo } from 'react';
import {
    ShieldCheck,
    Search,
    FlaskConical,
    ClipboardCheck,
    AlertTriangle,
    History,
    ArrowRight,
    ShieldAlert,
    Dna,
    FileText
} from 'lucide-react';

const QualityControl = ({ batches, onValidate }) => {
    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    const recalledBatches = batches.filter(b => b.status === 'RECALLED');

    const qcStats = useMemo(() => {
        const complianceRate = batches.length > 0
            ? ((activeBatches.length / batches.length) * 100).toFixed(1)
            : '100';
        return {
            compliance: complianceRate,
            pending: Math.floor(activeBatches.length * 0.2), // Simulated pending checks
            validated: activeBatches.length,
            failed: recalledBatches.length
        };
    }, [batches, activeBatches, recalledBatches]);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>Quality Assurance & Validation</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Validate product integrity through molecular and clinical compliance standards.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ border: '1px solid var(--border)' }}>
                        <FileText size={18} /> Export Compliance Log
                    </button>
                    <button className="btn btn-primary" onClick={onValidate}>
                        <ClipboardCheck size={18} /> Run System Validation
                    </button>
                </div>
            </div>

            {/* QC Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                {[
                    { label: 'Integrity Rate', value: `${qcStats.compliance}%`, icon: ShieldCheck, status: 'Optimal' },
                    { label: 'Pending Validation', value: qcStats.pending, icon: FlaskConical, status: 'Active Queue' },
                    { label: 'Validated Inventory', value: qcStats.validated, icon: ClipboardCheck, status: 'Verified' },
                    { label: 'Risk Incident(s)', value: qcStats.failed, icon: ShieldAlert, status: 'Alert Tracking' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ padding: '8px', background: '#f4f4f4', borderRadius: '8px' }}>
                                <stat.icon size={18} style={{ color: 'var(--primary)' }} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '4px', fontWeight: '500' }}>{stat.status}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
                {/* Inspection Queue */}
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Validation Queue</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input type="text" placeholder="Filter batch..." style={{ padding: '6px 12px 6px 30px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.75rem', outline: 'none' }} />
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>BATCH ID</th>
                                <th style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>SUBSTANCE</th>
                                <th style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>PROTOCOL</th>
                                <th style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>STATUS</th>
                                <th style={{ padding: '12px 8px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeBatches.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No batches under validation</td>
                                </tr>
                            ) : (
                                activeBatches.slice(0, 6).map((batch, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '16px 8px', fontSize: '0.8125rem', fontWeight: '700' }}>#{batch.id}</td>
                                        <td style={{ padding: '16px 8px', fontSize: '0.8125rem' }}>{batch.name}</td>
                                        <td style={{ padding: '16px 8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STD-PLSQL-0{i + 1}</td>
                                        <td style={{ padding: '16px 8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: '700' }}>
                                                <div style={{ width: '4px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                                VALIDATED
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                            <button className="btn btn-ghost" style={{ padding: '4px' }}><ArrowRight size={14} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Security & Protocols */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="stat-card" style={{ background: '#f4f4f4', border: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Dna size={18} />
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '700' }}>Molecular Fingerprint</h4>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                            Every batch is cryptographically hashed via the supply chain ledger. Validation protocols ensure zero tampering during production phases.
                        </p>
                        <div style={{ padding: '12px', background: 'white', borderRadius: '8px', fontSize: '0.7rem', border: '1px solid var(--border)' }}>
                            <code>SHA-256: 8f2a...c3d1</code>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={16} /> Compliance Warnings
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { msg: 'Expiring in < 30 days', count: activeBatches.filter(b => (new Date(b.exp) - new Date()) / (1000 * 60 * 60 * 24) < 30).length },
                                { msg: 'Recall events pending', count: recalledBatches.length }
                            ].map((warn, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{warn.msg}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: warn.count > 0 ? 'var(--text-dark)' : 'var(--text-light)' }}>{warn.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QualityControl;
