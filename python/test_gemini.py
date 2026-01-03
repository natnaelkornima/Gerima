import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env")
    exit(1)

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-flash-latest")

try:
    print("Testing Gemini...")
    response = model.generate_content("Say 'Hello' if you can read this.")
    print(f"RESPONSE: {response.text}")
except Exception as e:
    print(f"GEMINI ERROR: {e}")
