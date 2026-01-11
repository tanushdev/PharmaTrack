import React from 'react';
import {
  LayoutDashboard, ClipboardList, Users, Settings,
  Zap, TrendingUp, Package, BarChart3, LogOut, Database
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, batchCount }) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'traceability', label: 'Batches', icon: ClipboardList, badge: batchCount },
    { id: 'recall', label: 'Recall Center', icon: Users },
  ];

  const departments = [
    { id: 'production', label: 'Production Line', icon: Zap },
    { id: 'quality', label: 'Quality Control', icon: TrendingUp },
    { id: 'distribution', label: 'Distribution', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">PharmaTrack</div>

      {/* Main Navigation */}
      <nav className="nav-section">
        {mainNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <item.icon className="icon" />
            <span>{item.label}</span>
            {item.badge !== undefined && <span className="badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Departments Section */}
      <div className="nav-section">
        <div className="section-title">Departments</div>
        {departments.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <item.icon className="icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom User */}
      <div className="member-item" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
        <div className="member-avatar" style={{ background: '#374151' }}>AD</div>
        <div className="member-info">
          <div className="member-name">Admin User</div>
          <div className="member-role">FDA Inspector</div>
        </div>
        <LogOut size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
      </div>
    </div>
  );
};

export default Sidebar;
