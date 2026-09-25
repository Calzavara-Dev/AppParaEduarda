import React from 'react';
import { Target, TrendingUp, Award, User, Flame } from 'lucide-react';

const ProfileView = ({ stats }) => {
  const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;
  
  return (
    <main className="view-content">
      
      {/* Profile Header */}
      <div className="surface" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={40} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-dark)' }}>Candidato Dedicado</h2>
          <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', marginTop: '4px' }}>Assinatura Premium</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 'bold' }}>
            <Flame size={16} /> 12 dias de ofensiva
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '10px', color: 'var(--text-dark)', fontSize: '1.2rem' }}>Seu Desempenho</h3>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        
        <div className="surface" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(29, 161, 242, 0.1)', padding: '12px', borderRadius: '50%' }}>
            <Target size={24} color="var(--primary)" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-dark)' }}>{accuracy}%</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Taxa de Acertos</span>
        </div>

        <div className="surface" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%' }}>
            <TrendingUp size={24} color="#10B981" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-dark)' }}>{stats.answered}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Questões Feitas</span>
        </div>

        <div className="surface" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '50%' }}>
            <Award size={24} color="#f59e0b" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-dark)' }}>{stats.correct}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Questões Corretas</span>
        </div>

      </div>

    </main>
  );
};

export default ProfileView;
