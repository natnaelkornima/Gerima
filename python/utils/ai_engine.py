import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-flash-latest") # Using flash-latest to ensure match

def generate_study_materials(text: str, generate_type: str = "all"):
    """
    Sends the extracted text to Gemini and asks for Summary, Quiz, and/or Flashcards.
    """
    print(f"Generating {generate_type} for text (length: {len(text)})...")
    
    type_prompts = {
        "summary": "a concise summary of the text (max 300 words) and key_points.",
        "quiz": "a 5-question multiple choice quiz with options and correct answers.",
        "flashcards": "8-10 flashcards (front/back) covering key terms.",
        "all": "a summary, 5 quiz questions, and 8 flashcards."
    }

    schema_parts = []
    if generate_type in ["summary", "all"]:
        schema_parts.append('"summary": "A concise summary...", "key_points": ["Point 1", ...]')
    if generate_type in ["quiz", "all"]:
        schema_parts.append('"quiz": [{"question": "...", "options": ["A", "B", ...], "answer": "Option text"}]')
    if generate_type in ["flashcards", "all"]:
        schema_parts.append('"flashcards": [{"front": "...", "back": "..."}]')

    schema_str = ", ".join(schema_parts)
    
    prompt = f"""
    You are an expert AI tutor. 
    Analyze the text and provide {type_prompts.get(generate_type, type_prompts["all"])}
    
    Output ONLY a VALID JSON object with this structure:
    {{ {schema_str} }}
    
    IMPORTANT: Output raw JSON only. Do not use markdown backticks.
    
    TEXT:
    {text[:30000]}
    """
    
    try:
        print(f"Calling Gemini API for {generate_type}...")
        response = model.generate_content(prompt)
        print("Gemini response received.")
        
        # Clean up potential markdown code blocks
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        
        return raw_text 
    except Exception as e:
        print(f"Gemini API Error details: {e}")
        raise e
def generate_chat_response(document_text: str, user_message: str, history: list = []):
    """
    Answers a user message based on the document context and conversation history.
    """
    print(f"Generating chat response (History length: {len(history)})...")
    
    # System Instruction
    system_instruction = f"""
    You are 'Gerima AI', a friendly and highly knowledgeable AI Tutor.
    Your goal is to help students understand their study materials.
    
    GUIDELINES:
    1. Base your answers strictly on the PROVIDED TEXT if it contains the answer.
    2. If the text doesn't contain the answer, use your general knowledge but mention it's not in the doc.
    3. Keep responses helpful, educational, and concise.
    4. You can use markdown for formatting (bold, lists, etc).
    5. Be encouraging!
    
    DOCUMENT CONTEXT:
    {document_text[:50000]} # Gemini 1.5 Flash has a massive window, 50k is safe.
    """

    # We could use genai.ChatSession, but for one-off API calls with history, 
    # we can just construct a message list.
    
    messages = [
        {"role": "user", "parts": [system_instruction]},
        {"role": "model", "parts": ["Understood. I have read the document and am ready to help the student as Gerima AI!"]}
    ]
    
    # Add history
    for msg in history:
        messages.append({
            "role": "user" if msg["role"] == "user" else "model",
            "parts": [msg["content"]]
        })
        
    # Add new message
    messages.append({"role": "user", "parts": [user_message]})
    
    try:
        response = model.generate_content(messages)
        return response.text
    except Exception as e:
        print(f"Chat API Error: {e}")
        raise e
