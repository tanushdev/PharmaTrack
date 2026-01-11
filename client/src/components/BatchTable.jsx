import React from 'react';
import { ShieldCheck, TriangleAlert, CircleX, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const BatchTable = ({ batches, onRecall }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'ACTIVE':
                return {
                    className: 'badge-success',
                    icon: ShieldCheck,
                    glow: 'glow-success'
                };
            case 'RECALLED':
                return {
                    className: 'badge-warning',
                    icon: TriangleAlert,
                    glow: 'glow-warning'
                };
            default:
                return {
                    className: 'badge-danger',
                    icon: CircleX,
                    glow: 'glow-danger'
                };
        }
    };

    return (
        <div className="glass overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-800/50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold heading-font text-white flex items-center gap-3">
                            Active Drug Batches
                            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-400 rounded-full">
                                {batches.length} Total
                            </span>
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Real-time pharmaceutical inventory tracking</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative group">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search batches..."
                                className="input-modern pl-11 pr-4 py-3 w-64"
                            />
                        </div>

                        {/* Filter Button */}
                        <button className="flex items-center gap-2 px-4 py-3 glass-subtle hover:bg-slate-800/70 transition-all rounded-xl text-sm font-medium text-slate-400 hover:text-white">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>
                                <div className="flex items-center gap-2">
                                    Batch ID
                                    <ArrowUpDown className="w-3 h-3 text-slate-600" />
                                </div>
                            </th>
                            <th>Drug Name</th>
                            <th>Manufacturing</th>
                            <th>Expiry</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batches.map((batch, index) => {
                            const statusConfig = getStatusConfig(batch.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <tr
                                    key={batch.id}
                                    className="group animate-fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <td>
                                        <span className="font-mono text-sm font-semibold text-indigo-400">
                                            #{batch.id}
                                        </span>
                                    </td>
                                    <td>
                                        <div>
                                            <span className="font-semibold text-white">{batch.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-sm text-slate-400">{batch.mfg}</span>
                                    </td>
                                    <td>
                                        <span className="text-sm text-slate-400">{batch.exp}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${statusConfig.className}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {batch.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => onRecall(batch.id)}
                                            disabled={batch.status !== 'ACTIVE'}
                                            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${batch.status === 'ACTIVE'
                                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 opacity-0 group-hover:opacity-100'
                                                    : 'opacity-30 cursor-not-allowed text-slate-600'
                                                }`}
                                        >
                                            INITIATE RECALL
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/50 flex items-center justify-between text-sm">
                <span className="text-slate-500">Showing {batches.length} entries</span>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
                        Previous
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 font-semibold">
                        1
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatchTable;
