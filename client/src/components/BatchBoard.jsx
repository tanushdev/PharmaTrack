import React from 'react';
import { MoreVertical, Calendar, MapPin, Package, ArrowRight } from 'lucide-react';

const KanbanCard = ({ batch, onRecall, highlighted = false }) => {
    const isExpiringSoon = batch.status === 'ACTIVE' &&
        new Date(batch.exp) < new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    return (
        <div
            className={`kanban-card ${highlighted ? 'highlighted' : ''}`}
            style={isExpiringSoon ? { borderLeft: '3px solid var(--primary)' } : {}}
        >
            <div className="card-header">
                <h4 className="card-title">{batch.name}</h4>
                <MoreVertical size={16} className="card-menu" />
            </div>

            <p className="card-description">
                Batch #{batch.id} • {batch.quantity?.toLocaleString() || 0} units
            </p>

            <div className="card-meta">
                <span className="meta-item">
                    <Calendar size={12} />
                    {batch.exp}
                </span>
                <span className="meta-item">
                    <MapPin size={12} />
                    {batch.location || ' Unknown'}
                </span>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    background: '#f4f4f4',
                    color: 'var(--text-dark)'
                }}>
                    {batch.status}
                </span>

                {batch.status === 'ACTIVE' && (
                    <button
                        onClick={() => onRecall(batch.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        Recall <ArrowRight size={12} />
                    </button>
                )}
            </div>
        </div>
    );
};

const KanbanColumn = ({ title, count, batches, onRecall }) => {
    return (
        <div className="kanban-column">
            <div className="column-header">
                <h3 className="column-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--primary)'
                    }} />
                    {title}
                </h3>
                <span className="column-count">
                    {count}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </span>
            </div>
            <div className="kanban-cards">
                {batches.length === 0 ? (
                    <div style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: 'var(--text-light)',
                        fontSize: '0.875rem',
                        background: 'var(--bg-main)',
                        borderRadius: '8px',
                        border: '2px dashed var(--border)'
                    }}>
                        No batches
                    </div>
                ) : (
                    batches.map((batch, index) => (
                        <KanbanCard
                            key={batch.id}
                            batch={batch}
                            onRecall={onRecall}
                            highlighted={index === 0 && title === 'In Review'}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const BatchBoard = ({ batches, onRecall }) => {
    // Group batches by status for Kanban view
    const today = new Date();
    const oneYearFromNow = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);

    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    const recalledBatches = batches.filter(b => b.status === 'RECALLED');
    const dispatchedBatches = batches.filter(b => b.status === 'DISPATCHED');
    const expiredBatches = batches.filter(b => b.status === 'EXPIRED');

    const columns = [
        { title: 'Active', batches: activeBatches },
        { title: 'Recalled', batches: recalledBatches },
        { title: 'Dispatched', batches: dispatchedBatches },
        { title: 'Archived', batches: expiredBatches },
    ];

    return (
        <div>
            {/* Summary Cards */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                overflowX: 'auto',
                paddingBottom: '8px'
            }}>
                {columns.map(col => (
                    <div
                        key={col.title}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--primary)'
                        }} />
                        <span style={{ fontWeight: '500' }}>{col.title}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{col.batches.length}</span>
                    </div>
                ))}
            </div>

            {/* Kanban Board */}
            <div className="kanban-board">
                {columns.map(col => (
                    <KanbanColumn
                        key={col.title}
                        title={col.title}
                        count={col.batches.length}
                        batches={col.batches}
                        onRecall={onRecall}
                    />
                ))}
            </div>
        </div>
    );
};

export default BatchBoard;
