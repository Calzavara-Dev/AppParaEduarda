import React, { useState } from 'react';
import { CheckCircle2, XCircle, MessageCircle } from 'lucide-react';

const QuestionCard = ({ banca, ano, orgao, disciplina, texto, alternativas, correta, explicacao, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  let parsedAlternativas = alternativas || [];
  if (typeof parsedAlternativas === 'string') {
    try {
      parsedAlternativas = JSON.parse(parsedAlternativas);
    } catch (e) {
      console.error("Failed to parse alternativas:", e);
      parsedAlternativas = [];
    }
  }
  if (!Array.isArray(parsedAlternativas)) parsedAlternativas = [];

  const handleSelect = (index) => {
    if (selected === null) {
      setSelected(index);
      if (onAnswer) {
        onAnswer(index === correta);
      }
    }
  };

  const cleanText = (str) => {
    if (!str) return '';
    return str
      .replace(/-\n/g, '') // Junta palavras separadas por hífen no final da linha
      .replace(/\n/g, ' ') // Troca quebra de linha por espaço
      .replace(/\s+/g, ' ') // Remove espaços duplicados
      .trim();
  };

  return (
    <div className="surface animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header Info */}
      <div className="flex-between">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', background: 'rgba(29, 161, 242, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
            {banca}
          </span>
          <span className="text-caption">{ano} • {orgao}</span>
        </div>
        <span className="text-caption" style={{ fontWeight: '500' }}>{disciplina}</span>
      </div>

      {/* Question Text */}
      <div style={{ color: 'var(--text-dark)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '400', whiteSpace: 'pre-wrap', marginBottom: '8px' }}>
        {cleanText(texto)}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {parsedAlternativas.map((alt, index) => {
          const isSelected = selected === index;
          const isCorrect = selected !== null && index === correta;
          const isWrong = isSelected && index !== correta;

          let bg = 'var(--bg-color)';
          let border = '1px solid transparent';
          let icon = null;

          if (isCorrect) {
            bg = 'rgba(29, 161, 242, 0.1)';
            border = '1px solid var(--primary)';
            icon = <CheckCircle2 size={18} color="var(--primary)" />;
          } else if (isWrong) {
            bg = 'rgba(239, 68, 68, 0.1)';
            border = '1px solid #EF4444';
            icon = <XCircle size={18} color="#EF4444" />;
          } else if (isSelected) {
             // Shouldn't happen unless not validated yet
          }

          return (
            <button 
              key={index}
              onClick={() => handleSelect(index)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                background: bg,
                border: border,
                textAlign: 'left',
                cursor: selected === null ? 'pointer' : 'default',
                transition: 'all 0.2s',
                color: 'var(--text-dark)',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                border: '1px solid var(--text-light)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                {String.fromCharCode(65 + index)}
              </div>
              <span style={{ flex: 1, lineHeight: '1.4' }}>{cleanText(alt)}</span>
              {icon && <div style={{ flexShrink: 0 }}>{icon}</div>}
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--bg-color)' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
          <MessageCircle size={16} />
          Comentários (12)
        </button>
        {selected !== null && explicacao && (
          <button 
            onClick={() => setShowExplanation(!showExplanation)}
            style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: '500', cursor: 'pointer' }}
          >
            {showExplanation ? 'Ocultar Explicação' : 'Ver Explicação'}
          </button>
        )}
      </div>

      {/* Explanation Box */}
      {showExplanation && (
        <div style={{ 
          marginTop: '10px', 
          padding: '16px', 
          background: 'rgba(29, 161, 242, 0.05)', 
          borderLeft: '4px solid var(--primary)', 
          borderRadius: '0 8px 8px 0',
          color: 'var(--text-dark)',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}>
          <strong>Explicação:</strong><br />
          {explicacao}
        </div>
      )}

    </div>
  );
};

export default QuestionCard;
