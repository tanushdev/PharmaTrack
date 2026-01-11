import React from 'react';
import { TrendingUp, AlertCircle, Package, Activity, ArrowRight, Calendar, MapPin, Plus } from 'lucide-react';

const Dashboard = ({ batches, onNavigate, onAddBatch }) => {
    const today = new Date();

    // Calculate metrics
    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    const recalledBatches = batches.filter(b => b.status === 'RECALLED');
    const totalUnits = activeBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);
    const complianceRate = batches.length > 0
        ? Math.round((activeBatches.length / batches.length) * 100)
        : 0;

    // Get expiring batches (within 3 months)
    const threeMonthsFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    const expiringBatches = activeBatches.filter(b => {
        const expDate = new Date(b.exp);
        return expDate < threeMonthsFromNow && expDate > today;
    });

    // Recent activity (last 5 batches)
    const recentBatches = [...batches]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    // Low stock items (< 2000 units)
    const lowStock = activeBatches.filter(b => b.quantity < 2000);

    // Weekly data for bar chart (last 5 weekdays)
    const weeklyData = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    for (let i = 4; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const count = batches.filter(b => {
            const mfgDate = new Date(b.mfg);
            return mfgDate.toDateString() === date.toDateString();
        }).length;
        weeklyData.push({
            day: days[4 - i] || 'Day',
            count: count || 0
        });
    }

    const maxWeeklyCount = Math.max(...weeklyData.map(d => d.count), 1);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Top Stats Row - Horizontal Layout */}
            <div style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                display: 'grid',
                gridTemplateColumns: '300px 280px 200px 200px',
                gap: '48px',
                alignItems: 'center'
            }}>
                {/* Bar Chart - New Batches */}
                <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '16px' }}>
                        New batches
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '100px' }}>
                        {weeklyData.map((item, i) => (
                            <div key={i} style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: item.count > 0 ? `${(item.count / maxWeeklyCount) * 100}px` : '4px',
                                    background: item.count > 0 ? 'var(--primary)' : '#e5e7eb',
                                    borderRadius: '4px',
                                    minHeight: '4px',
                                    transition: 'height 0.3s ease'
                                }} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                    {item.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Circular Gauge - Compliance */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <svg width="160" height="160" viewBox="0 0 160 160">
                            {/* Background arc */}
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                fill="none"
                                stroke="#f3f4f6"
                                strokeWidth="8"
                            />
                            {/* Progress arc */}
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                fill="none"
                                stroke="var(--primary)"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 70}`}
                                strokeDashoffset={`${2 * Math.PI * 70 * (1 - complianceRate / 100)}`}
                                strokeLinecap="round"
                                transform="rotate(-90 80 80)"
                            />
                        </svg>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                                {complianceRate}%
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Active batches
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks in Progress */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: 'var(--text-dark)',
                        lineHeight: '1'
                    }}>
                        {activeBatches.length}
                    </div>
                    <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        Active batches
                        <ArrowRight size={16} style={{ cursor: 'pointer' }} onClick={() => onNavigate('traceability')} />
                    </div>
                </div>

                {/* Total Inventory Value */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: 'var(--text-dark)',
                        lineHeight: '1'
                    }}>
                        {totalUnits.toLocaleString()}
                    </div>
                    <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        Total units
                        <ArrowRight size={16} style={{ cursor: 'pointer' }} onClick={() => onNavigate('distribution')} />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
                {/* Recent Activity */}
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Recent Activity</h3>
                        <button
                            onClick={() => onNavigate('traceability')}
                            style={{ fontSize: '0.875rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            View all <ArrowRight size={14} />
                        </button>
                    </div>

                    {batches.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                            <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                            <div style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px' }}>No batches yet</div>
                            <div style={{ fontSize: '0.875rem', marginBottom: '16px' }}>Add your first batch to get started</div>
                            <button onClick={onAddBatch} className="btn btn-primary">
                                <Plus size={16} />
                                Add First Batch
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recentBatches.map((batch, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    background: 'var(--bg-main)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        flexShrink: 0
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                                            Batch #{batch.id} - {batch.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {batch.quantity?.toLocaleString()} units • {batch.location}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: '#f4f4f4',
                                        color: 'var(--text-dark)',
                                        fontWeight: '500'
                                    }}>
                                        {batch.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Alerts Panel */}
                <div className="stat-card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '20px' }}>Alerts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {expiringBatches.length > 0 && (
                            <div style={{ padding: '12px', background: '#f4f4f4', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <Calendar size={14} />
                                    <strong style={{ fontSize: '0.875rem' }}>Expiring Soon</strong>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {expiringBatches.length} batch(es) expiring within 90 days
                                </div>
                            </div>
                        )}

                        {lowStock.length > 0 && (
                            <div style={{ padding: '12px', background: '#f4f4f4', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <AlertCircle size={14} />
                                    <strong style={{ fontSize: '0.875rem' }}>Low Stock</strong>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {lowStock.length} batch(es) below 2,000 units
                                </div>
                            </div>
                        )}

                        {recalledBatches.length > 0 && (
                            <div style={{ padding: '12px', background: '#f4f4f4', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <MapPin size={14} />
                                    <strong style={{ fontSize: '0.875rem' }}>Recalled</strong>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {recalledBatches.length} batch(es) in quarantine
                                </div>
                            </div>
                        )}

                        {expiringBatches.length === 0 && lowStock.length === 0 && recalledBatches.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                <AlertCircle size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                                <div style={{ fontSize: '0.875rem' }}>No alerts at this time</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="stat-card" style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <button
                        onClick={onAddBatch}
                        className="btn btn-primary"
                        style={{ justifyContent: 'center' }}
                    >
                        <Plus size={16} />
                        Add New Batch
                    </button>
                    <button
                        onClick={() => onNavigate('quality')}
                        className="btn btn-ghost"
                        style={{ justifyContent: 'center' }}
                    >
                        Run Quality Check
                    </button>
                    <button
                        onClick={() => onNavigate('distribution')}
                        className="btn btn-ghost"
                        style={{ justifyContent: 'center' }}
                    >
                        View Inventory
                    </button>
                    <button
                        onClick={() => onNavigate('analytics')}
                        className="btn btn-ghost"
                        style={{ justifyContent: 'center' }}
                    >
                        View Analytics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
