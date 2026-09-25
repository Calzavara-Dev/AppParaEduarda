import os
import json
import time
from google import genai
from supabase import create_client, Client
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv(dotenv_path="../.env.local")

# Configurações API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    GEMINI_API_KEY = os.getenv("GROQ_API_KEY")

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

if not GEMINI_API_KEY:
    print("ERRO: GEMINI_API_KEY não encontrada no .env.local")
    exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Mapeamento de Prova -> Gabarito
PARES_ARQUIVOS = [
    {"prova": "../banco/3.pdf", "gabarito": "../banco/gabarito3.pdf", "ano": 2024, "orgao": "Petrobras", "cargo": "Engenharia", "banca": "Cesgranrio"},
    {"prova": "../banco/administracao.pdf", "gabarito": "../banco/gabaritoadm.pdf", "ano": 2024, "orgao": "Petrobras", "cargo": "Administração", "banca": "Cesgranrio"},
    {"prova": "../banco/prova_17_tecnico_a_de_administracao_e_controle_jnior.pdf", "gabarito": "../banco/gabaritos17.pdf", "ano": 2023, "orgao": "Transpetro", "cargo": "Técnico Administração", "banca": "Cesgranrio"},
    {"prova": "../banco/prova_20_tecnico_a_de_administracao_e_controle_junior.pdf", "gabarito": "../banco/gabaritos20.pdf", "ano": 2023, "orgao": "Petrobras", "cargo": "Técnico Administração", "banca": "Cesgranrio"},
    {"prova": "../banco/2.pdf", "gabarito": "../banco/gabarito2.pdf", "ano": 2024, "orgao": "Petrobras", "cargo": "Técnico", "banca": "Cesgranrio"}
]

PROMPT = """
Você é um assistente especialista em extração de dados de concursos públicos.
Vou te fornecer o arquivo PDF de uma PROVA da banca Cesgranrio e o arquivo PDF do seu GABARITO.

Sua tarefa é extrair TODAS as questões da prova.

Para cada questão, identifique a resposta correta cruzando o número da questão com o Gabarito fornecido.
O índice da alternativa correta deve ser numérico (A=0, B=1, C=2, D=3, E=4).

Se houver Textos de Apoio (ex: "Leia o texto I para responder às questões 1 a 3"), inclua esse texto de apoio NO INÍCIO do campo 'texto' de cada questão que depende dele.

Retorne APENAS um JSON válido contendo um array de objetos com a seguinte estrutura exata:
[
  {
    "disciplina": "Nome da Disciplina (ex: Língua Portuguesa, Conhecimentos Específicos)",
    "texto": "O enunciado completo da questão, incluindo o texto de apoio se houver.",
    "alternativas": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D", "Alternativa E"],
    "correta": 1,
    "explicacao": "Breve explicação da resposta correta baseada no conteúdo da questão (opcional)"
  }
]
"""

def extrair_e_salvar(par):
    print(f"\nProcessando Prova: {par['prova']}")
    try:
        # Upload para o Gemini usando a biblioteca nova (google-genai)
        print("Fazendo upload da prova e gabarito para a API do Gemini...")
        prova_file = client.files.upload(file=par['prova'])
        gabarito_file = client.files.upload(file=par['gabarito'])
        
        # Chama a API com Retry simples
        print("Analisando PDFs com IA (isso pode demorar até 2 minutos)...")
        max_retries = 5
        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model='gemini-3.8-flash',
                    contents=[PROMPT, prova_file, gabarito_file],
                    config={"response_mime_type": "application/json"}
                )
                break # Sai do loop se der sucesso
            except Exception as e:
                if "503" in str(e) and attempt < max_retries - 1:
                    print(f"Servidor sobrecarregado (503). Tentando novamente em 15 segundos... (Tentativa {attempt+1}/{max_retries})")
                    time.sleep(15)
                else:
                    raise e
        
        # Parseia a resposta
        questoes_extraidas = json.loads(response.text)
        print(f"{len(questoes_extraidas)} questoes extraidas com sucesso!")
        
        # Formata para o Supabase
        dados_inserir = []
        for q in questoes_extraidas:
            dados_inserir.append({
                "banca": par["banca"],
                "ano": par["ano"],
                "orgao": par["orgao"],
                "cargo": par["cargo"],
                "disciplina": q.get("disciplina", "Geral"),
                "texto": q["texto"],
                "alternativas": json.dumps(q["alternativas"], ensure_ascii=False),
                "correta": q["correta"],
                "explicacao": q.get("explicacao", "")
            })
            
        # Insere no Supabase
        print("Salvando no Supabase...")
        res = supabase.table('questoes').insert(dados_inserir).execute()
        print("Salvo com sucesso no banco de dados!")
        
        # Deleta os arquivos da API do Gemini para liberar cota
        try:
            client.files.delete(name=prova_file.name)
            client.files.delete(name=gabarito_file.name)
        except Exception as file_err:
            print(f"Aviso ao deletar arquivo: {file_err}")

    except Exception as e:
        print(f"Erro ao processar {par['prova']}: {str(e)}")

def main():
    print("Iniciando Extrator de PDFs para o Supabase (Gemini SDK v1+)")
    # Processando os demais pares
    for par in PARES_ARQUIVOS[3:]:
        extrair_e_salvar(par)

if __name__ == "__main__":
    main()
