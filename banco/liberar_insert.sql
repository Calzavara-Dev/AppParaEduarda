-- Rode esse comando no SQL Editor do Supabase para autorizar o script Python a fazer envios para o banco
CREATE POLICY "Permitir inserts publicos temporariamente"
ON questoes FOR INSERT
WITH CHECK (true);
