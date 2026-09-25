import fitz
import re
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

gabarito = {
    1:'E', 2:'B', 3:'A', 4:'C', 5:'A', 6:'D', 7:'D', 8:'C', 9:'C', 10:'D',
    11:'D', 12:'A', 13:'A', 14:'B', 15:'E', 16:'D', 17:'C', 18:'C', 19:'B', 20:'D',
    21:'B', 22:'A', 23:'D', 24:'A', 25:'B', 26:'E', 27:'E', 28:'B', 29:'C', 30:'D',
    31:'C', 32:'B', 33:'C', 34:'B', 35:'C', 36:'D', 37:'E', 38:'D', 39:'E', 40:'D',
    41:'A', 42:'C', 43:'B', 44:'A', 45:'D', 46:'B', 47:'A', 48:'A', 49:'E', 50:'C',
    51:'B', 52:'E', 53:'D', 54:'B', 55:'E', 56:'B', 57:'C', 58:'E', 59:'D', 60:'C'
}
map_letras = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}

pdf_path = 'banco/prova_20_tecnico_a_de_administracao_e_controle_junior.pdf'
doc = fitz.open(pdf_path)
text = ""
for page in doc:
    text += page.get_text()

text = re.sub(r'\n+', '\n', text)

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
        "ano": 2011,
        "orgao": "Transpetro",
        "cargo": "Técnico de Administração e Controle Júnior"
    }
    questoes_extraidas.append((num, q))

questoes_extraidas = sorted(questoes_extraidas, key=lambda x: x[0])
seen = set()
final_qs = []
for n, q in questoes_extraidas:
    if n not in seen:
        seen.add(n)
        final_qs.append(q)

print(f"Encontrou {len(final_qs)} questões únicas na prova 20.")

if len(final_qs) > 0:
    res = supabase.table("questoes").insert(final_qs).execute()
    print("Inseridas com sucesso no banco!")
else:
    print("Nenhuma questão inserida.")
