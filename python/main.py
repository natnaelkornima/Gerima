from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils.text_extractor import extract_text_from_pdf_url
from utils.ai_engine import generate_study_materials, generate_chat_response
import uvicorn
import json

app = FastAPI()

class ProcessRequest(BaseModel):
    file_url: str
    file_type: str
    generate_type: str = "all" # summary, quiz, flashcards, or all

class ChatRequest(BaseModel):
    file_url: str
    file_type: str
    message: str
    history: list = []

@app.get("/")
def health_check():
    return {"status": "ok", "service": "A+ Gerima AI Engine (Gemini)"}

@app.post("/process")
def process_file(request: ProcessRequest):
    """
    Receives a file URL, downloads it, extracts text, and generates requested study material.
    """
    print(f"Processing mission: {request.generate_type} for {request.file_url}")
    try:
        content = ""
        if request.file_type == "PDF":
            content = extract_text_from_pdf_url(request.file_url)
        else:
             return {"message": "File type not supported for text extraction yet."}

        if not content:
             return {"status": "error", "message": "No text extracted from file. The PDF might be scanned or empty."}

        # Call AI Engine
        try:
            ai_response_json_str = generate_study_materials(content, request.generate_type)
        except Exception as ai_e:
             return {"status": "error", "message": f"AI Engine failed: {str(ai_e)}"}

        # Parse JSON
        try:
            ai_data = json.loads(ai_response_json_str)
        except json.JSONDecodeError:
            ai_data = {"summary": ai_response_json_str, "error": "JSON_PARSE_ERROR"}

        return {
            "status": "success",
            "type": request.generate_type,
            "ai_data": ai_data
        }
    except Exception as e:
        print(f"Server Error: {e}")
        return {"status": "error", "message": str(e)}

@app.post("/chat")
def chat_with_doc(request: ChatRequest):
    """
    Handles conversational tutoring based on document content.
    """
    print(f"Chat request for: {request.file_url}")
    try:
        content = ""
        if request.file_type == "PDF":
            content = extract_text_from_pdf_url(request.file_url)
        else:
            return {"status": "error", "message": "File type not supported for chat yet."}
            
        if not content:
            return {"status": "error", "message": "Could not read document content."}

        response_text = generate_chat_response(content, request.message, request.history)
        
        return {
            "status": "success",
            "response": response_text
        }
    except Exception as e:
        print(f"Chat Server Error: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
