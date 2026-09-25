-- 1. Deleta as 48 questões de 2018 que foram inseridas primeiro com o gabarito deslocado.
-- (As 49 corretas, inseridas depois, serão mantidas).
DELETE FROM questoes 
WHERE ano = 2018 
  AND created_at < '2026-09-25 00:15:00+00';

-- 2. Deleta as questões duplicadas da prova de Administração 2024 
-- (O robô inseriu a mesma prova duas vezes antes de estourar a cota).
-- Isso vai manter apenas a primeira cópia de cada questão dessa prova.
DELETE FROM questoes T1
USING questoes T2
WHERE T1.ano = 2024 
  AND T1.cargo = 'Administração'
  AND T1.texto = T2.texto
  AND T1.id > T2.id;
