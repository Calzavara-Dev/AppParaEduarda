-- Script SQL para criar a tabela de questões no Supabase
-- Cole isso no SQL Editor do seu painel Supabase e clique em "Run"

CREATE TABLE IF NOT EXISTS questoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    banca TEXT NOT NULL,
    ano INTEGER NOT NULL,
    orgao TEXT NOT NULL,
    cargo TEXT,
    disciplina TEXT NOT NULL,
    texto TEXT NOT NULL,
    alternativas JSONB NOT NULL,
    correta INTEGER NOT NULL,
    explicacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security) para acesso anônimo de leitura
ALTER TABLE questoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questões são públicas para leitura"
ON questoes FOR SELECT
USING (true);
