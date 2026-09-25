import os
import groq
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")
client = groq.Client(api_key=os.getenv("GROQ_API_KEY") or os.getenv("GEMINI_API_KEY"))
print([m.id for m in client.models.list().data])
