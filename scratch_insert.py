import re
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")
print(f"URL: {url}")
supabase: Client = create_client(url, key)

gabarito = {
    1:'B', 2:'D', 3:'B', 4:'C', 5:'E', 6:'D', 7:'C', 8:'D', 9:'A', 10:'A',
    11:'D', 12:'A', 13:'C', 14:'A', 15:'C', 16:'B', 17:'E', 18:'E', 19:'D', 20:'C',
    21:'A', 22:'C', 23:'E', 24:'B', 25:'C', 26:'D', 27:'D', 28:'E', 29:'A', 30:'A',
    31:'C', 32:'B', 33:'C', 34:'B', 35:'E', 36:'D', 37:'E', 38:'C', 39:'A', 40:'E',
    41:'C', 42:'C', 43:'C', 44:'D', 45:'C', 46:'A', 47:'D', 48:'D', 49:'B', 50:'C',
    51:'C', 52:'A', 53:'E', 54:'B', 55:'C', 56:'D', 57:'B', 58:'E', 59:'C', 60:'D'
}
map_letras = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}

with open('banco/2_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Normalize text
text = re.sub(r'\n+', '\n', text)
start_idx = text.find('\n1\nO trecho')
if start_idx != -1:
    text = text[start_idx:]

# Try a robust regex
pattern = re.compile(
    r'\n(\d{1,2})\n(.*?)\n\(A\)\s(.*?)\n\(B\)\s(.*?)\n\(C\)\s(.*?)\n\(D\)\s(.*?)\n\(E\)\s(.*?)(?=\n\d{1,2}\n|\Z)',
    re.DOTALL
)

matches = pattern.findall(text)

questoes_extraidas = []
for m in matches:
    num = int(m[0])
    enunciado = m[1].strip()
    altA = m[2].strip()
    altB = m[3].strip()
    altC = m[4].strip()
    altD = m[5].strip()
    altE = m[6].strip()
    
    # Identify subject
    disciplina = "Conhecimentos Específicos"
    if 1 <= num <= 10:
        disciplina = "Língua Portuguesa"
    elif 11 <= num <= 20:
        disciplina = "Matemática"
        
    correta_letra = gabarito.get(num, 'A')
    correta_idx = map_letras[correta_letra]
    
    q = {
        "disciplina": disciplina,
        "texto": enunciado,
        "alternativas": [altA, altB, altC, altD, altE],
        "correta": correta_idx,
        "banca": "Cesgranrio",
        "ano": 2018,
        "orgao": "Transpetro",
        "cargo": "Técnico de Administração e Controle Júnior"
    }
    questoes_extraidas.append((num, q))

# Sort by number to ensure we have them all unique
questoes_extraidas = sorted(questoes_extraidas, key=lambda x: x[0])
# Deduplicate
seen = set()
final_qs = []
for n, q in questoes_extraidas:
    if n not in seen:
        seen.add(n)
        final_qs.append(q)

print(f"Encontrou {len(final_qs)} questões únicas.")

# Insert into supabase
if len(final_qs) > 0:
    res = supabase.table("questoes").insert(final_qs).execute()
    print("Inseridas com sucesso!")
else:
    print("Nenhuma questão inserida. Regex falhou.")
