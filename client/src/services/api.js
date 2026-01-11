const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
    // Fetch all batches
    getBatches: async () => {
        const response = await fetch(`${API_BASE_URL}/batches`);
        if (!response.ok) throw new Error('Failed to fetch batches');
        return await response.json();
    },

    // Add a new batch
    addBatch: async (batchData) => {
        const response = await fetch(`${API_BASE_URL}/batches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batchData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to add batch');
        return data;
    },

    // Dispatch a batch
    dispatchBatch: async (id) => {
        const response = await fetch(`${API_BASE_URL}/batches/${id}/dispatch`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to dispatch batch');
        return await response.json();
    },

    // Recall batches by drug name
    processRecall: async (drugName) => {
        const response = await fetch(`${API_BASE_URL}/recall`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drugName })
        });
        if (!response.ok) throw new Error('Failed to process recall');
        return await response.json();
    },

    // Validate system
    validateSystem: async () => {
        const response = await fetch(`${API_BASE_URL}/validate`);
        if (!response.ok) throw new Error('Failed to validate system');
        return await response.json();
    }
};
