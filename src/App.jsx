import React, { useState, useEffect } from 'react';
import { Home, BookOpen, User, Menu, RotateCcw, Info } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import HomeView from './views/HomeView';
import StudyView from './views/StudyView';
import ProfileView from './views/ProfileView';

const FRASES_MOTIVACIONAIS = [
  "Não desista dos seus objetivos!!",
  "A dor é temporária, a posse é para sempre.",
  "Estuda que a vida muda!",
  "Sua aprovação está um dia mais perto.",
  "A consistência supera o talento.",
  "Cada questão resolvida é um degrau para a posse.",
  "O suor do estudo será a sua alegria amanhã.",
  "Plante agora, colha a sua aprovação depois.",
  "O sacrifício é temporário, o cargo é efetivo.",
  "Não pare até se orgulhar de você mesmo.",
  "Um dia de cada vez, rumo à aprovação.",
  "O sucesso é a soma de pequenos esforços diários.",
  "Sua vaga já existe, você só precisa ir buscar."
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [questoes, setQuestoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fraseMotivacional, setFraseMotivacional] = useState(FRASES_MOTIVACIONAIS[0]);

  useEffect(() => {
    setFraseMotivacional(FRASES_MOTIVACIONAIS[Math.floor(Math.random() * FRASES_MOTIVACIONAIS.length)]);
  }, []);

  // Stats stored in localStorage
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('appconcursos_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { answered: 0, correct: 0 };
      }
    }
    return { answered: 0, correct: 0 };
  });

  useEffect(() => {
    localStorage.setItem('appconcursos_stats', JSON.stringify(stats));
  }, [stats]);

  const handleAnswer = (isCorrect) => {
    setStats(prev => ({
      answered: prev.answered + 1,
      correct: prev.correct + (isCorrect ? 1 : 0)
    }));
  };

  const handleResetStats = () => {
    if (window.confirm("Tem certeza que deseja zerar seu histórico de questões?")) {
      setStats({ answered: 0, correct: 0 });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    async function fetchQuestoes() {
      try {
        const { data, error } = await supabase
          .from('questoes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setQuestoes(data);
      } catch (error) {
        console.error("Erro ao buscar questões:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestoes();
  }, []);

  return (
    <div className="app-layout">
      {/* Sidebar for Desktop Web */}
      <nav className="side-nav">
        <div style={{ padding: '0 8px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary-gradient)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontFamily: "'Great Vibes', cursive", fontWeight: '400', paddingTop: '6px', paddingRight: '2px' }}>
            E
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-dark)', lineHeight: '0.8', fontFamily: "'Great Vibes', cursive", fontWeight: '400', marginBottom: '4px' }}>E Concursos</h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1', marginLeft: '2px' }}>Para web e mobile</span>
          </div>
        </div>
        <a className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={22} />
          <span>Home</span>
        </a>
        <a className={`nav-item ${activeTab === 'study' ? 'active' : ''}`} onClick={() => setActiveTab('study')}>
          <BookOpen size={22} />
          <span>Estudar</span>
        </a>
        <a className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User size={22} />
          <span>Perfil</span>
        </a>
      </nav>

      <div className="main-content">
        {/* Header */}
        <header className="app-header" style={{ position: 'relative' }}>
          <div>
            <p className="text-subtitle">Olá, Meu Amor! </p>
            <h1 className="text-title" style={{ marginTop: '4px' }}>{fraseMotivacional}</h1>
            <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--surface-color)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary-dark)', boxShadow: 'var(--shadow-soft)' }}>
              <BookOpen size={14} />
              {loading ? 'Carregando questões...' : `${questoes.length} questões disponíveis`}
            </div>
          </div>
          <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={20} />
          </button>

          {isMenuOpen && (
            <div className="animate-fade-in" style={{ position: 'absolute', top: '80px', right: '32px', background: 'var(--surface-color)', borderRadius: '12px', boxShadow: 'var(--shadow-colored)', width: '220px', zIndex: 100, border: '1px solid var(--bg-color)', overflow: 'hidden' }}>
              <button 
                onClick={handleResetStats} 
                style={{ width: '100%', padding: '16px', textAlign: 'left', border: 'none', background: 'transparent', borderBottom: '1px solid var(--bg-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontSize: '0.9rem', fontWeight: '500' }}
              >
                <RotateCcw size={18} /> Zerar Progresso
              </button>
              <button 
                onClick={() => { alert('EConcursos v1.0\nFoco na Cesgranrio!'); setIsMenuOpen(false); }} 
                style={{ width: '100%', padding: '16px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dark)', fontSize: '0.9rem', fontWeight: '500' }}
              >
                <Info size={18} /> Sobre o App
              </button>
            </div>
          )}
        </header>

        {/* Render Active View */}
        {activeTab === 'home' && <HomeView questoes={questoes} loading={loading} stats={stats} onAnswer={handleAnswer} />}
        {activeTab === 'study' && <StudyView questoes={questoes} loading={loading} onAnswer={handleAnswer} />}
        {activeTab === 'profile' && <ProfileView stats={stats} />}
      </div>

      {/* Glassmorphism Bottom Navigation for Mobile */}
      <nav className="bottom-nav">
        <a className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={20} />
          {activeTab === 'home' && <span>Home</span>}
        </a>
        <a className={`nav-item ${activeTab === 'study' ? 'active' : ''}`} onClick={() => setActiveTab('study')}>
          <BookOpen size={20} />
          {activeTab === 'study' && <span>Estudar</span>}
        </a>
        <a className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User size={20} />
          {activeTab === 'profile' && <span>Perfil</span>}
        </a>
      </nav>
    </div>
  );
}

export default App;
