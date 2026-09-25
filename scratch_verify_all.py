import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

res = supabase.table("questoes").select("ano, cargo, banca, correta, alternativas, texto").execute()

from collections import Counter
counts = Counter()
samples = {}

for q in res.data:
    key = f"{q['ano']} - {q['cargo']}"
    counts[key] += 1
    if key not in samples:
        samples[key] = q

print("Total questions in DB:")
for k, v in counts.items():
    print(f"{k}: {v}")

print("\n--- AMOSTRAS ---")
for k, q in samples.items():
    print(f"\n[{k}]")
    print(q['texto'][:100])
    correta_idx = q['correta']
    letra = ['A', 'B', 'C', 'D', 'E'][correta_idx] if correta_idx is not None else 'N/A'
    print(f"CORRETA: Letra {letra}")
    if q['alternativas']:
        print(f"Alternativa Correta Texto: {q['alternativas'][correta_idx][:50] if correta_idx < len(q['alternativas']) else 'N/A'}")
