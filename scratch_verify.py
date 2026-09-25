import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

print("Verificando algumas questões inseridas da prova 20 (ano: 2011):")
res = supabase.table("questoes").select("*").eq("ano", 2011).limit(3).execute()

for q in res.data:
    print(f"\n--- Questão ---")
    print(q['texto'][:100] + "...")
    print(f"A: {q['alternativas'][0][:50]}")
    print(f"B: {q['alternativas'][1][:50]}")
    print(f"C: {q['alternativas'][2][:50]}")
    print(f"D: {q['alternativas'][3][:50]}")
    print(f"E: {q['alternativas'][4][:50]}")
    
    correta_idx = q['correta']
    letra = ['A', 'B', 'C', 'D', 'E'][correta_idx]
    print(f"=> CORRETA no Banco: Índice {correta_idx} (Letra {letra})")

print("\n\nVerificando algumas questões inseridas da prova 2 (ano: 2018):")
res = supabase.table("questoes").select("*").eq("ano", 2018).limit(3).execute()

for q in res.data:
    print(f"\n--- Questão ---")
    print(q['texto'][:100] + "...")
    print(f"A: {q['alternativas'][0][:50]}")
    print(f"B: {q['alternativas'][1][:50]}")
    print(f"C: {q['alternativas'][2][:50]}")
    print(f"D: {q['alternativas'][3][:50]}")
    print(f"E: {q['alternativas'][4][:50]}")
    
    correta_idx = q['correta']
    letra = ['A', 'B', 'C', 'D', 'E'][correta_idx]
    print(f"=> CORRETA no Banco: Índice {correta_idx} (Letra {letra})")
