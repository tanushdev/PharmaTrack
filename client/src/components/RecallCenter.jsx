import React from 'react';
import { ShieldAlert, AlertTriangle, Package, History, ArrowRight, Activity, Search } from 'lucide-react';

const RecallCenter = ({ batches, onRecall }) => {
    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    const recalledBatches = batches.filter(b => b.status === 'RECALLED');

    const totalRecalledUnits = recalledBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);
    const activeRecallCount = recalledBatches.length;

    const initiateRecall = () => {
        const activeDrugs = [...new Set(activeBatches.map(b => b.name))];
        if (activeDrugs.length === 0) {
            alert('No active batches available for recall.');
            return;
        }

        const drug = window.prompt(`CRITICAL: Enter drug name to initiate recall protocol:\n\nActive drugs in system:\n${activeDrugs.join('\n')}`);
        if (drug) {
            const matching = activeBatches.find(b => b.name.toLowerCase() === drug.toLowerCase());
            if (matching) {
                if (window.confirm(`CONFIRM RECALL: Batch #${matching.id} (${matching.name}) - ${matching.quantity} units. This will trigger local quarantine and PL/SQL recall procedures.`)) {
                    onRecall(matching.id);
                }
            } else {
                alert('Drug not found in active inventory.');
            }
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>Security & Recall Center</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Monitor safety compliance and manage emergency batch withdrawals.</p>
                </div>
                <button
                    onClick={initiateRecall}
                    className="btn btn-primary"
                    style={{ height: '48px', padding: '0 24px', fontSize: '1rem' }}
                >
                    <ShieldAlert size={20} />
                    Initiate Batch Recall
                </button>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '8px', background: '#f4f4f4', borderRadius: '8px' }}>
                            <Activity size={20} style={{ color: 'var(--primary)' }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Active Recalls</span>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: '700' }}>{activeRecallCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Batches currently in quarantine</div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '8px', background: '#f4f4f4', borderRadius: '8px' }}>
                            <Package size={20} style={{ color: 'var(--primary)' }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Impact Assessment</span>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: '700' }}>{totalRecalledUnits.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Total units withdrawn from market</div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '8px', background: '#f4f4f4', borderRadius: '8px' }}>
                            <ShieldAlert size={20} style={{ color: 'var(--primary)' }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>System Status</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '12px' }}>Operational</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>PL/SQL Triggers: AR_RECALL_SYNC ACTIVE</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
                {/* Recall Logs */}
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Recall Tracking Log</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                style={{ padding: '6px 12px 6px 30px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.75rem', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {recalledBatches.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                            <History size={40} style={{ margin: '0 auto 16px', color: 'var(--text-light)', opacity: 0.5 }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No active recalls in the system.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Batch ID</th>
                                        <th style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reference</th>
                                        <th style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quantity</th>
                                        <th style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recalledBatches.map((batch, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 8px', fontSize: '0.875rem', fontWeight: '600' }}>#{batch.id}</td>
                                            <td style={{ padding: '16px 8px' }}>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{batch.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Loc: {batch.location}</div>
                                            </td>
                                            <td style={{ padding: '16px 8px', fontSize: '0.875rem' }}>{batch.quantity?.toLocaleString()} units</td>
                                            <td style={{ padding: '16px 8px' }}>
                                                <span style={{ padding: '4px 8px', background: 'var(--primary)', color: 'white', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }}>
                                                    QUARANTINED
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                                    <ArrowRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Protocol Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="stat-card" style={{ background: '#f4f4f4', border: 'none' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={18} />
                            Compliance Note
                        </h3>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Initiating a recall triggers the <code>DRUG_TRAK.process_recall</code> cursor logic in the Oracle backend. This ensures all downstream nodes in the supply chain are notified.
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Safety Guidelines</h3>
                        <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                'Instant warehouse quarantine',
                                'Batch traceability locked',
                                'Distribution partner alert',
                                'FDA/Regulatory sync'
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecallCenter;
