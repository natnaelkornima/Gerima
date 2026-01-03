import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

def generate_study_materials(text: str):
    """
    Sends the extracted text to Gemini and asks for Summary, Quiz, and Flashcards.
    """
    
    # Simple strategy: Ask for a JSON response
    # Note: Gemini Pro is good, but for strict JSON, prompts need to be clear.
    
    prompt = f"""
    You are an expert AI tutor.
    I will provide you with a text from a study material.
    Your goal is to extract the key information and generate study aids.
    
    Please output a VALID JSON object with the following structure (do not use markdown backticks in output, just raw JSON):
    {{
        "summary": "A concise summary of the text (max 300 words).",
        "key_points": ["Point 1", "Point 2", "Point 3"],
        "quiz": [
            {{
                "question": "Question text?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": "Option A"
            }},
            ... (generate 3 questions)
        ],
        "flashcards": [
            {{ "front": "Term", "back": "Definition" }},
            ... (generate 5 flashcards)
        ]
    }}
    
    TEXT TO ANALYZE:
    {text[:20000]} 
    
    (Note: Text truncated to first 20k chars for safety if too long)
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean up potential markdown code blocks
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        
        # Returning raw text for now, can separate parsing logic later
        return raw_text 
    except Exception as e:
        print(f"Gemini Error: {e}")
        raise e
