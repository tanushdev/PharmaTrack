import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddBatchModal = ({ onClose, onAdd, existingDrugs }) => {
    const [formData, setFormData] = useState({
        name: '',
        customName: '',
        mfg: '',
        exp: '',
        quantity: '',
        location: 'Warehouse A',
        line: 'Solid Dosage A'
    });
    const [errors, setErrors] = useState({});
    const [useCustomName, setUseCustomName] = useState(false);

    const locationOptions = [
        'Warehouse A',
        'Warehouse B',
        'Warehouse C',
        'Cold Storage',
        'Distribution Center'
    ];

    const validate = () => {
        const newErrors = {};
        const drugName = useCustomName ? formData.customName : formData.name;

        if (!drugName || drugName.trim() === '') newErrors.name = 'Drug name is required';
        if (!formData.mfg) newErrors.mfg = 'Manufacturing date is required';
        if (!formData.exp) newErrors.exp = 'Expiry date is required';
        if (!formData.quantity || parseInt(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';

        if (formData.mfg && formData.exp && new Date(formData.exp) <= new Date(formData.mfg)) {
            newErrors.exp = 'Expiry date must be after manufacturing date (PL/SQL Exception: invalid_batch_data)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onAdd({
                name: useCustomName ? formData.customName.trim() : formData.name,
                mfg: formData.mfg,
                exp: formData.exp,
                quantity: parseInt(formData.quantity),
                location: formData.location,
                line: formData.line
            });
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field] || errors.name) {
            setErrors(prev => ({ ...prev, [field]: null, name: null }));
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '480px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Add New Batch</h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Drug Name */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                Drug Name *
                            </label>
                            <button
                                type="button"
                                onClick={() => setUseCustomName(!useCustomName)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-dark)',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                {useCustomName ? 'Select from existing' : 'Add new drug'}
                            </button>
                        </div>

                        {useCustomName ? (
                            <input
                                type="text"
                                value={formData.customName}
                                onChange={(e) => handleChange('customName', e.target.value)}
                                placeholder="Enter new drug name (e.g., Metformin 500mg)"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: `1px solid ${errors.name ? 'var(--primary)' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    fontSize: '0.875rem'
                                }}
                            />
                        ) : (
                            <select
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: `1px solid ${errors.name ? 'var(--primary)' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    background: 'white'
                                }}
                            >
                                <option value="">Select a drug...</option>
                                {existingDrugs.map(drug => (
                                    <option key={drug} value={drug}>{drug}</option>
                                ))}
                            </select>
                        )}
                        {errors.name && <p style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.75rem', marginTop: '4px' }}>{errors.name}</p>}
                    </div>

                    {/* Dates Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                                Manufacturing Date *
                            </label>
                            <input
                                type="date"
                                value={formData.mfg}
                                onChange={(e) => handleChange('mfg', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: `1px solid ${errors.mfg ? 'var(--primary)' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    fontSize: '0.875rem'
                                }}
                            />
                            {errors.mfg && <p style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.75rem', marginTop: '4px' }}>{errors.mfg}</p>}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                                Expiry Date *
                            </label>
                            <input
                                type="date"
                                value={formData.exp}
                                onChange={(e) => handleChange('exp', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: `1px solid ${errors.exp ? 'var(--primary)' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    fontSize: '0.875rem'
                                }}
                            />
                            {errors.exp && <p style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.75rem', marginTop: '4px' }}>{errors.exp}</p>}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                            Quantity (units) *
                        </label>
                        <input
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => handleChange('quantity', e.target.value)}
                            placeholder="Enter quantity..."
                            min="1"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: `1px solid ${errors.quantity ? 'var(--primary)' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                fontSize: '0.875rem'
                            }}
                        />
                        {errors.quantity && <p style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.75rem', marginTop: '4px' }}>{errors.quantity}</p>}
                    </div>

                    {/* Production Line */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                            Production Line
                        </label>
                        <select
                            value={formData.line}
                            onChange={(e) => handleChange('line', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                background: 'white'
                            }}
                        >
                            <option value="Solid Dosage A">Solid Dosage A</option>
                            <option value="Injectables">Injectables</option>
                            <option value="Packaging">Packaging</option>
                            <option value="Sterile Solutions">Sterile Solutions</option>
                        </select>
                    </div>

                    {/* Location */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                            Storage Location
                        </label>
                        <select
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                background: 'white'
                            }}
                        >
                            {locationOptions.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Add Batch
                        </button>
                    </div>
                </form>

                {/* PL/SQL Note */}
                <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                }}>
                    💡 Simulates <code>DRUG_TRAK.add_batch</code> procedure with exception handling for invalid dates.
                </div>
            </div>
        </div>
    );
};

export default AddBatchModal;
