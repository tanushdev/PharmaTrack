import React, { useMemo } from 'react';
import {
    Factory,
    Settings,
    Activity,
    CheckCircle2,
    PauseCircle,
    AlertCircle,
    Clock,
    ArrowRight,
    ChevronRight,
    Database
} from 'lucide-react';

const ProductionLine = ({ batches, onAddBatch }) => {
    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    const recentProduction = [...batches].sort((a, b) => new Date(b.mfg) - new Date(a.mfg)).slice(0, 5);

    const capacityStats = useMemo(() => {
        const totalLines = 4;
        // Real dynamic lines based on batch data
        const activeLinesSet = new Set(activeBatches.map(b => b.line).filter(Boolean));
        const activeLinesCount = activeLinesSet.size;

        const totalQuantity = activeBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);
        const avgLoad = activeBatches.length > 0 ? (totalQuantity / (activeLinesCount * 5000) * 100).toFixed(0) : 0;

        return {
            utilization: Math.min(avgLoad, 100),
            active: activeLinesCount,
            total: totalLines,
            hourlyYield: activeBatches.length > 0 ? (totalQuantity / 24).toFixed(0) : 0
        };
    }, [activeBatches]);

    const productionLines = useMemo(() => {
        const lines = [
            { id: 'L1', name: 'Solid Dosage A' },
            { id: 'L2', name: 'Injectables' },
            { id: 'L3', name: 'Packaging' },
            { id: 'L4', name: 'Sterile Solutions' },
        ];

        return lines.map(line => {
            const lineBatches = activeBatches.filter(b => b.line === line.name);
            const lineQuantity = lineBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);
            const load = Math.min((lineQuantity / 5000) * 100, 100);

            return {
                ...line,
                status: lineBatches.length > 0 ? 'Optimal' : 'Idle',
                load: load.toFixed(0),
                batch: lineBatches[0]?.name || 'N/A'
            };
        });
    }, [activeBatches]);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>Production Operations</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Monitor real-time manufacturing throughput and line efficiency.</p>
                </div>
                <button onClick={onAddBatch} className="btn btn-primary" style={{ height: '48px', padding: '0 24px' }}>
                    <Factory size={18} /> Direct Line Injection
                </button>
            </div>

            {/* Production KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                {[
                    { label: 'Capacity Utilization', value: `${capacityStats.utilization}%`, icon: Activity, subtitle: 'Real-time system load' },
                    { label: 'Active Lines', value: capacityStats.active, icon: Settings, subtitle: `of ${capacityStats.total} total lines` },
                    { label: 'Avg Throughput', value: capacityStats.hourlyYield, icon: Factory, subtitle: 'Units per hour (est.)' },
                    { label: 'Line Resilience', value: capacityStats.active > 0 ? 'High' : 'Standby', icon: CheckCircle2, subtitle: 'Status verified' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                            <stat.icon size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.subtitle}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
                {/* Real-time Status Board */}
                <div>
                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '24px' }}>Manufacturing Line Status (Real-Time)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {productionLines.map((line, i) => (
                                <div key={i} style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                                                {line.id}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{line.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Working on: <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>{line.batch}</span></div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '600', color: line.status === 'Idle' ? 'var(--text-muted)' : 'var(--text-dark)' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: line.status === 'Idle' ? '#9ca3af' : 'var(--primary)' }}></div>
                                                {line.status}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Line Load: {line.load}%</div>
                                        </div>
                                    </div>
                                    <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${line.load}%`, height: '100%', background: 'var(--primary)', transition: 'width 1s ease' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Manufacturing Log */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="stat-card">
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} /> Production Record
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {recentProduction.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    No manufacturing activity recorded
                                </div>
                            ) : (
                                recentProduction.map((batch, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                        {i !== recentProduction.length - 1 && <div style={{ position: 'absolute', left: '7px', top: '24px', bottom: '-16px', width: '1px', background: '#e5e7eb' }}></div>}
                                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: '2px solid var(--primary)', zIndex: 1, marginTop: '4px' }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.8125rem', fontWeight: '700' }}>{batch.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{batch.quantity.toLocaleString()} units • {batch.line}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '2px' }}>{new Date(batch.mfg).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div style={{ padding: '20px', background: '#f4f4f4', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <Database size={20} />
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '700' }}>Compliance Sync</h4>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Live synchronization with Oracle <code>DRUG_TRAK</code> tables. All line injections are auditable.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductionLine;
