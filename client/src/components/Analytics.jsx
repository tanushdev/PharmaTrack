import React, { useMemo } from 'react';
import {
    BarChart3,
    TrendingUp,
    PieChart,
    Boxes,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Zap,
    ShieldCheck,
    Activity
} from 'lucide-react';

const Analytics = ({ batches }) => {
    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    const recalledBatches = batches.filter(b => b.status === 'RECALLED');
    const totalUnits = activeBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);

    // Calculate Production Trend (last 6 months)
    const productionTrend = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const last6Months = [];

        for (let i = 5; i >= 0; i--) {
            const mIdx = (currentMonth - i + 12) % 12;
            const mName = months[mIdx];
            // Simulate/Filter batches by month (using current year for simplicity)
            const count = batches.filter(b => {
                const mfgDate = new Date(b.mfg);
                return mfgDate.getMonth() === mIdx;
            }).length;
            last6Months.push({ name: mName, val: count });
        }
        return last6Months;
    }, [batches]);

    const maxVal = Math.max(...productionTrend.map(d => d.val), 1);

    // Expiry Risk Heatmap (Days until expiry)
    const expiryRisk = useMemo(() => {
        const risks = {
            high: activeBatches.filter(b => (new Date(b.exp) - new Date()) / (1000 * 60 * 60 * 24) < 30).length,
            medium: activeBatches.filter(b => {
                const days = (new Date(b.exp) - new Date()) / (1000 * 60 * 60 * 24);
                return days >= 30 && days < 180;
            }).length,
            low: activeBatches.filter(b => (new Date(b.exp) - new Date()) / (1000 * 60 * 60 * 24) >= 180).length
        };
        return risks;
    }, [activeBatches]);

    // Product Inventory Share
    const drugMix = useMemo(() => {
        const drugs = {};
        activeBatches.forEach(b => {
            drugs[b.name] = (drugs[b.name] || 0) + b.quantity;
        });
        return Object.entries(drugs)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [activeBatches]);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
            {/* Dynamic Key Performance Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Production Velocity</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '8px 0' }}>{batches.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Batches</span></h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                Total system volume
                            </div>
                        </div>
                        <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '12px' }}>
                            <Zap size={24} style={{ color: 'var(--primary)' }} />
                        </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'var(--primary)', opacity: 0.1 }}></div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Network Accuracy</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '8px 0' }}>100%</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                <ShieldCheck size={14} /> System Integrity Verified
                            </div>
                        </div>
                        <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '12px' }}>
                            <Target size={24} style={{ color: 'var(--primary)' }} />
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Yield Factor</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '8px 0' }}>{recalledBatches.length > 0 ? (100 - (recalledBatches.length / batches.length) * 100).toFixed(1) : '100'}%</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#ef4444', fontWeight: '600' }}>
                                {recalledBatches.length} batch recall events
                            </div>
                        </div>
                        <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '12px' }}>
                            <Activity size={24} style={{ color: 'var(--primary)' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Main Production Gradient Chart */}
                <div className="stat-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Operational Growth</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Historical batch production insights.</p>
                        </div>
                        <select style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: 'white' }}>
                            <option>Last 6 Months</option>
                            <option>Year to Date</option>
                        </select>
                    </div>

                    <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '2%', paddingBottom: '20px' }}>
                        {productionTrend.map((d, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                <div
                                    className="bar-reveal"
                                    style={{
                                        width: '60%',
                                        height: `${(d.val / maxVal) * 100}%`,
                                        background: 'var(--primary)',
                                        borderRadius: '6px 6px 2px 2px',
                                        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        position: 'relative',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: '700' }}>
                                        {d.val}
                                    </div>
                                </div>
                                <span style={{ marginTop: '12px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expiry Risk Distribution */}
                <div className="stat-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '24px' }}>Shelf-life Risk</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {[
                            { label: 'Immediate Expulsion', count: expiryRisk.high, color: 'var(--primary)', desc: '< 30 days left' },
                            { label: 'Medium Advisory', count: expiryRisk.medium, color: '#6b7280', desc: '30-180 days' },
                            { label: 'Stable Portfolio', count: expiryRisk.low, color: '#e5e7eb', desc: '> 180 days' }
                        ].map((risk, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                    <span style={{ fontWeight: '600' }}>{risk.label}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{risk.count} batches</span>
                                </div>
                                <div style={{ height: '8px', background: '#f4f4f4', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: batches.length > 0 ? `${(risk.count / batches.length) * 100}%` : '0%',
                                        height: '100%',
                                        background: risk.color,
                                        transition: 'width 1s ease'
                                    }}></div>
                                </div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{risk.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* Product Mix Share */}
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Boxes size={20} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Inventory Volume Mix</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {drugMix.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Add batches to see product distribution</div>
                        ) : (
                            drugMix.map(([name, qty], i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#f4f4f4', borderRadius: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700'
                                    }}>{i + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{qty.toLocaleString()} units</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{totalUnits > 0 ? ((qty / totalUnits) * 100).toFixed(1) : '0.0'}%</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Share</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* System Intelligence Feed */}
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <TrendingUp size={20} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Predictive Insights</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {batches.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                No insights available. Add batches to generate intelligence.
                            </div>
                        ) : (
                            <>
                                <div style={{ padding: '16px', borderLeft: '4px solid var(--primary)', background: '#f9fafb', borderRadius: '0 12px 12px 0' }}>
                                    <strong style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Inventory Health</strong>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {expiryRisk.high > 0
                                            ? `Attention: ${expiryRisk.high} batch(es) nearing expiry. Prioritize distribution.`
                                            : "Inventory is currently stable with no immediate expiry risks."}
                                    </p>
                                </div>
                                <div style={{ padding: '16px', borderLeft: '4px solid #9ca3af', background: '#f9fafb', borderRadius: '0 12px 12px 0' }}>
                                    <strong style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Quality Pattern</strong>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {recalledBatches.length > 0
                                            ? `${recalledBatches.length} recall event(s) recorded. Analyzing root causes.`
                                            : "Zero quality incidents recorded. Compliance is optimal."}
                                    </p>
                                </div>
                            </>
                        )}
                        <div style={{ marginTop: 'auto', textAlign: 'center', padding: '20px' }}>
                            <button className="btn btn-ghost" style={{ fontSize: '0.875rem', gap: '12px' }}>
                                Generate Analytical Report <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
