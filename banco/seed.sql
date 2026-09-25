-- Script SQL para popular a tabela com algumas questões iniciais
-- Cole isso no SQL Editor do seu painel Supabase e clique em "Run"

INSERT INTO questoes (banca, ano, orgao, cargo, disciplina, texto, alternativas, correta, explicacao) VALUES
(
    'Cesgranrio', 2024, 'Caixa Econômica Federal', 'Técnico Bancário', 'Conhecimentos Bancários',
    'O Banco Central do Brasil (Bacen) é uma autarquia federal vinculada ao Ministério da Fazenda. Qual é uma das suas principais atribuições?',
    '["Emitir papel-moeda e moeda metálica.", "Conceder empréstimos para o público geral.", "Fiscalizar as contas públicas dos municípios.", "Garantir depósitos de contas correntes limitados a R$ 250.000,00."]',
    0,
    'O Banco Central tem a atribuição exclusiva de emitir papel-moeda e moeda metálica no Brasil, atuando como o banco dos bancos e executor da política monetária.'
),
(
    'Cesgranrio', 2024, 'Petrobras', 'Técnico de Administração', 'Língua Portuguesa',
    'Em relação ao uso da crase, assinale a alternativa em que o sinal indicativo de crase está empregado corretamente.',
    '["O gerente entregou o relatório à secretaria.", "Referiu-se à Vossa Excelência com respeito.", "Andamos à pé por toda a cidade.", "O pagamento foi feito à prazo."]',
    0,
    'A crase ocorre na fusão da preposição "a" (entregar a alguém) com o artigo feminino "a" (a secretaria). Nas demais alternativas não ocorre crase antes de pronomes de tratamento como Vossa Excelência, nem antes de palavras masculinas (pé, prazo).'
),
(
    'Cesgranrio', 2024, 'BNB', 'Analista', 'Matemática Financeira',
    'Um capital de R$ 10.000,00 foi aplicado a juros compostos a uma taxa de 2% ao mês. Qual será o montante aproximado gerado ao final de 3 meses?',
    '["R$ 10.600,00", "R$ 10.612,08", "R$ 10.200,00", "R$ 11.000,00"]',
    1,
    'M = C * (1 + i)^t -> M = 10000 * (1.02)^3 -> M = 10000 * 1.061208 = R$ 10.612,08.'
),
(
    'Cesgranrio', 2024, 'BNDES', 'Analista de Sistemas', 'Tecnologia da Informação',
    'No contexto de bancos de dados relacionais, o que caracteriza a propriedade ACID conhecida como Isolamento (Isolation)?',
    '["Garante que as transações ocorram de forma concorrente sem que uma interfira na outra.", "Garante que após a conclusão da transação, os dados sejam salvos permanentemente.", "Assegura que a transação seja tratada como uma unidade única e indivisível.", "Garante que o banco de dados mude de um estado válido para outro estado válido."]',
    0,
    'Isolamento (Isolation) garante que transações concorrentes não interfiram umas nas outras, como se estivessem sendo executadas de forma sequencial.'
);
