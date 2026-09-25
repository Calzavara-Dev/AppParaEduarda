import React, { useState } from 'react';
import { Target } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import QuestionCard from '../components/QuestionCard';

const HomeView = ({ questoes, loading, stats, onAnswer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    banca: '',
    ano: '',
    cargo: '',
    orgao: ''
  });

  const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;
  // Extrai as disciplinas unicas do banco, garantindo que 'Todas' seja a primeira
  const disciplinasUnicas = Array.from(
    new Set(questoes.filter(q => q.disciplina).map(q => q.disciplina))
  );
  const categorias = ['Todas', ...disciplinasUnicas];

  const getUniqueValues = (key) => {
    return Array.from(new Set(questoes.filter(q => q[key]).map(q => q[key]))).sort();
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ banca: '', ano: '', cargo: '', orgao: '' });
  };

  return (
    <main className="view-content">
      
      {/* Horizontal Scrollable Categories */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
        {categorias.map((cat, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              background: selectedCategory === cat ? 'var(--primary-gradient)' : 'var(--surface-color)',
              color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              boxShadow: selectedCategory === cat ? 'var(--shadow-colored)' : 'var(--shadow-soft)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Large Stat Card */}
      <div className="surface gradient-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%' }}>
            <Target size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{accuracy}% Acertos</h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Em Geral (Resolução Livre)</p>
          </div>
        </div>
        <div style={{ background: 'white', color: 'var(--primary)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {stats.answered} Resoluções
        </div>
      </div>

      {/* Search & Filters */}
      <FilterBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onFilterClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="surface animate-fade-in" style={{ marginTop: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>Filtros Avançados</span>
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' }}>Limpar Filtros</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select className="filter-select" value={filters.ano} onChange={(e) => updateFilter('ano', e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--bg-color)', outline: 'none' }}>
              <option value="">Todos os Anos</option>
              {getUniqueValues('ano').map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="filter-select" value={filters.banca} onChange={(e) => updateFilter('banca', e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--bg-color)', outline: 'none' }}>
              <option value="">Todas as Bancas</option>
              {getUniqueValues('banca').map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="filter-select" value={filters.orgao} onChange={(e) => updateFilter('orgao', e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--bg-color)', outline: 'none', gridColumn: '1 / span 2' }}>
              <option value="">Todos os Órgãos</option>
              {getUniqueValues('orgao').map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="filter-select" value={filters.cargo} onChange={(e) => updateFilter('cargo', e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--bg-color)', outline: 'none', gridColumn: '1 / span 2' }}>
              <option value="">Todos os Cargos</option>
              {getUniqueValues('cargo').map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Questions Section Title */}
      <h3 style={{ marginTop: '10px', color: 'var(--text-dark)', fontSize: '1.2rem' }}>Questões Recentes</h3>

      {/* Question Cards */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Carregando questões...</p>
      ) : questoes.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma questão encontrada.</p>
      ) : (
        (() => {
          const filteredQuestoes = questoes.filter(q => {
            const textMatch = !searchQuery || 
              (q.texto && q.texto.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (q.disciplina && q.disciplina.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const catMatch = selectedCategory === 'Todas' || 
              (q.cargo && q.cargo.includes(selectedCategory)) || 
              (q.disciplina && q.disciplina.includes(selectedCategory)) ||
              (q.orgao && q.orgao.includes(selectedCategory));

            const advancedMatch = 
              (!filters.ano || String(q.ano) === String(filters.ano)) &&
              (!filters.banca || q.banca === filters.banca) &&
              (!filters.orgao || q.orgao === filters.orgao) &&
              (!filters.cargo || q.cargo === filters.cargo);
              
            return textMatch && catMatch && advancedMatch;
          });

          if (filteredQuestoes.length === 0) {
            return <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma questão encontrada com esses filtros.</p>;
          }

          return filteredQuestoes.map(q => (
            <QuestionCard 
              key={q.id}
              banca={q.banca}
              ano={q.ano}
              orgao={q.orgao}
              disciplina={q.disciplina}
              texto={q.texto}
              alternativas={q.alternativas}
              correta={q.correta}
              explicacao={q.explicacao}
              onAnswer={onAnswer}
            />
          ));
        })()
      )}

    </main>
  );
};

export default HomeView;
