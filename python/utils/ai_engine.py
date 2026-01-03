import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-flash-latest") # Using flash-latest to ensure match

def generate_study_materials(text: str):
    """
    Sends the extracted text to Gemini and asks for Summary, Quiz, and Flashcards.
    """
    print(f"Generating study materials for text (length: {len(text)})...")
    
    prompt = f"""
    You are an expert AI tutor.
    I will provide you with a text from a study material.
    Your goal is to extract the key information and generate study aids.
    
    Please output a VALID JSON object with the following structure:
    {{
        "summary": "A concise summary of the text (max 300 words).",
        "key_points": ["Point 1", "Point 2", "Point 3"],
        "quiz": [
            {{
                "question": "Question text?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": "Option A"
            }},
            ... (generate 3-5 questions)
        ],
        "flashcards": [
            {{ "front": "Term", "back": "Definition" }},
            ... (generate 5-8 flashcards)
        ]
    }}
    
    IMPORTANT: Output ONLY raw JSON. No markdown backticks.
    
    TEXT TO ANALYZE:
    {text[:30000]} 
    """
    
    try:
        print("Calling Gemini API...")
        response = model.generate_content(prompt)
        print("Gemini response received.")
        
        # Clean up potential markdown code blocks
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        
        return raw_text 
    except Exception as e:
        print(f"Gemini API Error details: {e}")
        raise e
