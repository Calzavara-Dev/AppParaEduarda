import React from 'react';
import { Search, Filter } from 'lucide-react';

const FilterBar = ({ searchQuery, setSearchQuery, onFilterClick }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <div className="surface" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px' }}>
        <Search size={18} color="var(--text-light)" />
        <input 
          type="text" 
          placeholder="Buscar questões, assuntos..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            border: 'none', 
            outline: 'none', 
            background: 'transparent', 
            width: '100%',
            color: 'var(--text-dark)',
            fontSize: '0.95rem'
          }} 
        />
      </div>
      <button 
        onClick={onFilterClick}
        className="surface flex-center" 
        style={{ width: '48px', padding: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', borderRadius: '12px' }}
      >
        <Filter size={20} color="var(--primary)" />
      </button>
    </div>
  );
};

export default FilterBar;
