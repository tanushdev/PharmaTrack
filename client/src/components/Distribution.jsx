import React, { useMemo, useState } from 'react';
import {
    Building2,
    Truck,
    MapPin,
    Package,
    ThermometerSnowflake,
    BarChart,
    Navigation,
    Globe,
    Archive,
    ArrowUpRight,
    X,
    Send,
    Search,
    CheckCircle2
} from 'lucide-react';

const Distribution = ({ batches, onDispatch }) => {
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [dispatchSearch, setDispatchSearch] = useState('');

    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    const totalQuantity = activeBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);

    const filteredDispatchBatches = useMemo(() => {
        return activeBatches.filter(b =>
            b.name.toLowerCase().includes(dispatchSearch.toLowerCase()) ||
            b.id.toString().includes(dispatchSearch)
        );
    }, [activeBatches, dispatchSearch]);

    const warehouseStats = useMemo(() => {
        const locations = [
            { name: 'Warehouse A', icon: Building2, temps: [2, 8], city: 'Mumbai' },
            { name: 'Warehouse B', icon: MapPin, temps: [15, 25], city: 'Austin' },
            { name: 'Warehouse C', icon: Archive, temps: [15, 25], city: 'London' },
            { name: 'Cold Storage', icon: ThermometerSnowflake, temps: [-20, -15], city: 'Berlin' },
            { name: 'Distribution Center', icon: Truck, temps: [2, 8], city: 'Delhi' }
        ];

        return warehouseStatsMemo(locations, activeBatches);
    }, [activeBatches]);

    function warehouseStatsMemo(locations, activeBatches) {
        return locations.map(loc => {
            const locBatches = activeBatches.filter(b => b.location === loc.name);
            const locQuantity = locBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);
            const capacity = loc.name === 'Cold Storage' ? 50000 : 100000;
            const load = Math.min((locQuantity / capacity) * 100, 100);

            return {
                ...loc,
                load: load.toFixed(1),
                units: locQuantity,
                batchCount: locBatches.length
            };
        });
    }

    return (
        <>
            {/* Modal shifted OUTSIDE the animate-fade-in div to ensure inset:0 covers the whole viewport */}
            {showDispatchModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999, // Super high z-index to cover sidebar
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '480px',
                        padding: '24px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        maxHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Dispatch Inventory</h2>
                            <button
                                onClick={() => setShowDispatchModal(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    placeholder="Search batch name or ID..."
                                    value={dispatchSearch}
                                    onChange={(e) => setDispatchSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px 10px 38px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>
                        </div>

                        {/* List View - Scrollable */}
                        <div style={{ overflowY: 'auto', marginBottom: '24px', flex: 1, paddingRight: '4px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {filteredDispatchBatches.length === 0 ? (
                                    <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        No active batches found
                                    </p>
                                ) : (
                                    filteredDispatchBatches.map(batch => (
                                        <div
                                            key={batch.id}
                                            style={{
                                                padding: '12px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{batch.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    #{batch.id} • {batch.quantity.toLocaleString()} Units
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    onDispatch(batch.id);
                                                    setShowDispatchModal(false);
                                                }}
                                                className="btn btn-primary"
                                                style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                                            >
                                                Dispatch
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowDispatchModal(false)}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                    {activeBatches.length} items available
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>Logistics & Distribution</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage global drug inventory movement and storage integrity.</p>
                    </div>
                    <div>
                        <button onClick={() => setShowDispatchModal(true)} className="btn btn-primary" style={{ padding: '0 24px', height: '48px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Truck size={20} /> Dispatch Batch
                        </button>
                    </div>
                </div>

                {/* Distribution KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                    {[
                        { label: 'Units in Stock', value: totalQuantity.toLocaleString(), icon: Package, trend: 'Total Inventory' },
                        { label: 'Avg Storage Load', value: `${(warehouseStats.reduce((sum, wh) => sum + parseFloat(wh.load), 0) / warehouseStats.length).toFixed(1)}%`, icon: Archive, trend: 'Optimization High' },
                        { label: 'Active Hubs', value: warehouseStats.filter(wh => wh.units > 0).length, icon: Building2, trend: `Deployment Across ${warehouseStats.length}` },
                        { label: 'Asset Security', value: '100%', icon: Navigation, trend: 'GPS Link Active' },
                    ].map((stat, i) => (
                        <div key={i} className="stat-card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '12px' }}>
                                    <stat.icon size={20} />
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: i === 3 ? '#10b981' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.trend}</span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.02em' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '600' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
                    {/* Storage Management */}
                    <div className="stat-card" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '32px', letterSpacing: '-0.02em' }}>Global Warehouse Clusters</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {warehouseStats.map((wh, i) => (
                                <div key={i} style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '20px', transition: 'box-shadow 0.3s ease', opacity: wh.units > 0 ? 1 : 0.6 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '1.125rem', fontWeight: '800' }}>{wh.name}</span>
                                                <span style={{ fontSize: '0.7rem', background: '#f4f4f4', padding: '3px 10px', borderRadius: '6px', fontWeight: '700', textTransform: 'uppercase' }}>{wh.city}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <ThermometerSnowflake size={14} /> {wh.temps[0]}°C to {wh.temps[1]}°C
                                                </div>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Package size={14} /> {wh.units.toLocaleString()} units
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.25rem', fontWeight: '900' }}>{wh.load}%</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>LOADED</div>
                                        </div>
                                    </div>
                                    <div style={{ height: '10px', background: '#f4f4f4', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ width: `${wh.load}%`, height: '100%', background: wh.units > 0 ? 'var(--primary)' : '#e5e7eb', transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inventory Breakdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div className="stat-card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <BarChart size={18} /> Logistics Ledger
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {activeBatches.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '48px 24px', border: '1px dashed var(--border)', borderRadius: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        No active logistical assignments
                                    </div>
                                ) : (
                                    activeBatches.slice(0, 6).map((batch, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '800' }}>{batch.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>ID: {batch.id} • {batch.quantity.toLocaleString()} U</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: '800' }}>{batch.location}</div>
                                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-light)', fontWeight: '600' }}>SECURE</div>
                                                </div>
                                                <button
                                                    onClick={() => onDispatch(batch.id)}
                                                    title="Quick Dispatch"
                                                    style={{ background: '#f4f4f4', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <Send size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div style={{ padding: '32px', background: 'var(--primary)', color: 'white', borderRadius: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <div style={{ padding: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
                                        <Navigation size={18} />
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>Network Intelligence</h4>
                                </div>
                                <p style={{ fontSize: '0.8125rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '24px' }}>
                                    Full cold-chain integrity verified. Real-time telemetry is broadcast via secure satellite link.
                                </p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: '700', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></div>
                                        RFID SYNC
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: '700', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></div>
                                        SECURE GPS
                                    </div>
                                </div>
                            </div>
                            <Globe size={180} style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.08 }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Distribution;
