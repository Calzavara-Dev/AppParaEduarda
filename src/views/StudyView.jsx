import React, { useState } from 'react';
import QuestionCard from '../components/QuestionCard';

const StudyView = ({ questoes, loading, onAnswer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return <main style={{ padding: '24px' }}><p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Carregando questões...</p></main>;
  }

  if (!questoes || questoes.length === 0) {
    return <main style={{ padding: '24px' }}><p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma questão disponível para estudar.</p></main>;
  }

  const handleNext = () => {
    if (currentIndex < questoes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentQuestion = questoes[currentIndex];

  return (
    <main className="view-content">
      
      {/* Progress Bar & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          style={{ padding: '8px 16px', borderRadius: '12px', border: 'none', background: 'var(--surface-color)', color: currentIndex === 0 ? 'var(--text-light)' : 'var(--text-dark)', cursor: currentIndex === 0 ? 'default' : 'pointer' }}
        >
          Anterior
        </button>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
          Questão {currentIndex + 1} de {questoes.length}
        </span>
        <button 
          onClick={handleNext} 
          disabled={currentIndex === questoes.length - 1}
          style={{ padding: '8px 16px', borderRadius: '12px', border: 'none', background: 'var(--surface-color)', color: currentIndex === questoes.length - 1 ? 'var(--text-light)' : 'var(--text-dark)', cursor: currentIndex === questoes.length - 1 ? 'default' : 'pointer' }}
        >
          Próxima
        </button>
      </div>

      <div style={{ height: '4px', background: 'var(--bg-color)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--primary)', width: `${((currentIndex + 1) / questoes.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      <QuestionCard 
        key={currentQuestion.id} // key ensures state resets on new question
        banca={currentQuestion.banca}
        ano={currentQuestion.ano}
        orgao={currentQuestion.orgao}
        disciplina={currentQuestion.disciplina}
        texto={currentQuestion.texto}
        alternativas={currentQuestion.alternativas}
        correta={currentQuestion.correta}
        explicacao={currentQuestion.explicacao}
        onAnswer={onAnswer}
      />
    </main>
  );
};

export default StudyView;
