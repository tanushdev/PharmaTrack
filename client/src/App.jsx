import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, SlidersHorizontal, User, Plus, Check } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BatchBoard from './components/BatchBoard';
import ProductionLine from './components/ProductionLine';
import QualityControl from './components/QualityControl';
import Distribution from './components/Distribution';
import Analytics from './components/Analytics';
import RecallCenter from './components/RecallCenter';
import AddBatchModal from './components/AddBatchModal';
import { api } from './services/api';

// Default batches
const DEFAULT_BATCHES = [];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);
  const [batches, setBatches] = useState(DEFAULT_BATCHES);

  // Load batches from Backend API instead of localstorage
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await api.getBatches();
        setBatches(data);
      } catch (error) {
        showNotification('Error loading data from server: ' + error.message, 'warning');
      }
    };
    fetchBatches();
  }, []);

  // Get unique drug names for the dropdown
  const existingDrugs = useMemo(() => {
    return [...new Set(batches.map(b => b.name))].sort();
  }, [batches]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle recall
  const handleRecall = async (idOrName) => {
    // If idOrName is a string, it's a drug name recall from RecallCenter
    const drugName = typeof idOrName === 'string' ? idOrName : batches.find(b => b.id === idOrName)?.name;

    if (!drugName) return;

    if (window.confirm(`⚠️ RECALL CONFIRMATION\n\nDrug: ${drugName}\n\nThis will trigger the server-side RECALL protocol to flag all active batches of this drug.\n\nProceed?`)) {
      try {
        await api.processRecall(drugName);
        const data = await api.getBatches();
        setBatches(data);
        showNotification(`Recall successful for ${drugName}`, 'warning');
      } catch (error) {
        showNotification(error.message, 'warning');
      }
    }
  };

  // Handle add batch
  const handleAddBatch = async (formData) => {
    try {
      await api.addBatch(formData);
      const data = await api.getBatches();
      setBatches(data);
      setShowAddModal(false);
      showNotification(`Batch added successfully - Persistent DB Commit!`);
    } catch (error) {
      showNotification(error.message, 'warning');
    }
  };

  // Handle dispatch
  const handleDispatch = async (id) => {
    const batch = batches.find(b => b.id === id);
    if (!batch) return;

    if (window.confirm(`📦 DISPATCH CONFIRMATION\n\nBatch: #${batch.id}\nDrug: ${batch.name}\n\nProceed with persistent dispatch?`)) {
      try {
        await api.dispatchBatch(id);
        const data = await api.getBatches();
        setBatches(data);
        showNotification(`Batch #${id} (${batch.name}) dispatched and logged!`);
      } catch (error) {
        showNotification(error.message, 'warning');
      }
    }
  };

  // Handle system validation
  const handleValidateSystem = async () => {
    try {
      const result = await api.validateSystem();
      showNotification(`SYSTEM VALIDATION: ${result.status} (Active Batches: ${result.active_batches})`, 'success');
    } catch (error) {
      showNotification('Validation Failed: ' + error.message, 'warning');
    }
  };

  // Filter batches (for Batches view)
  const filteredBatches = batches.filter(batch => {
    if (!batch) return false;
    const name = batch.name || '';
    const id = batch.id ? batch.id.toString() : '';
    const location = batch.location || '';

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.includes(searchQuery) ||
      location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Determine if we should show search bar
  const showSearchBar = activeTab === 'traceability';

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        batchCount={batches.length}
      />

      <main className="main-content">
        {/* Notification Toast */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 20px',
            background: notification.type === 'warning' ? '#fef3c7' : '#d1fae5',
            color: notification.type === 'warning' ? '#92400e' : '#065f46',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeIn 0.3s ease'
          }}>
            <Check size={18} />
            {notification.message}
            <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Top Bar - Only for Batches view */}
        {showSearchBar && (
          <div className="top-bar" style={{ marginBottom: '24px' }}>
            <div className="search-box">
              <Search size={18} style={{ color: 'var(--text-light)' }} />
              <input
                type="text"
                placeholder="Search by name, ID, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <X size={16} style={{ color: 'var(--text-light)' }} />
                </button>
              )}
            </div>

            <div className="top-actions">
              <div style={{ position: 'relative' }}>
                <button
                  className={`btn ${showFilters ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {filterStatus !== 'all' && (
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '8px',
                      height: '8px',
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }} />
                  )}
                </button>

                {showFilters && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    minWidth: '160px'
                  }}>
                    <div style={{ padding: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      FILTER BY STATUS
                    </div>
                    {['all', 'ACTIVE', 'RECALLED', 'EXPIRED'].map(status => (
                      <button
                        key={status}
                        onClick={() => { setFilterStatus(status); setShowFilters(false); }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 12px',
                          textAlign: 'left',
                          background: filterStatus === status ? 'var(--bg-main)' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: filterStatus === status ? 'var(--text-dark)' : 'var(--text-muted)'
                        }}
                      >
                        {status === 'all' ? 'All Batches' : status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="btn btn-ghost">
                <User size={16} />
                Me
              </button>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <Plus size={16} />
                Add batch
              </button>
            </div>
          </div>
        )}

        {/* Search Results Info */}
        {searchQuery && activeTab === 'traceability' && (
          <div style={{ marginBottom: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Found {filteredBatches.length} result(s) for "{searchQuery}"
            {filterStatus !== 'all' && ` in ${filterStatus} batches`}
          </div>
        )}

        {/* Route to Different Views */}
        {activeTab === 'dashboard' && (
          <Dashboard
            batches={batches}
            onNavigate={setActiveTab}
            onAddBatch={() => setShowAddModal(true)}
          />
        )}

        {activeTab === 'traceability' && (
          <BatchBoard batches={filteredBatches} onRecall={handleRecall} />
        )}

        {activeTab === 'production' && (
          <ProductionLine
            batches={batches}
            onAddBatch={() => setShowAddModal(true)}
          />
        )}

        {activeTab === 'quality' && (
          <QualityControl batches={batches} onValidate={handleValidateSystem} />
        )}

        {activeTab === 'distribution' && (
          <Distribution batches={batches} onDispatch={handleDispatch} />
        )}

        {activeTab === 'analytics' && (
          <Analytics batches={batches} />
        )}

        {activeTab === 'recall' && (
          <RecallCenter batches={batches} onRecall={handleRecall} />
        )}
      </main>

      {/* Add Batch Modal */}
      {showAddModal && (
        <AddBatchModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddBatch}
          existingDrugs={existingDrugs}
        />
      )}
    </div>
  );
};

export default App;
