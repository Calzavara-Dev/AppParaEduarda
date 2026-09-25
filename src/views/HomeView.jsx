import React, { useState } from 'react';
import { Target } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import QuestionCard from '../components/QuestionCard';

const HomeView = ({ questoes, loading, stats, onAnswer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;
  // Extrai as disciplinas unicas do banco, garantindo que 'Todas' seja a primeira
  const disciplinasUnicas = Array.from(
    new Set(questoes.filter(q => q.disciplina).map(q => q.disciplina))
  );
  const categorias = ['Todas', ...disciplinasUnicas];

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
        onFilterClick={() => alert('Em breve: Filtros avanados por Banca, Ano, Cargo e rgao!')}
      />

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
              
            return textMatch && catMatch;
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
