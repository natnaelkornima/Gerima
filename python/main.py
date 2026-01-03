from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils.text_extractor import extract_text_from_pdf_url
from utils.ai_engine import generate_study_materials
import uvicorn
import json

app = FastAPI()

class ProcessRequest(BaseModel):
    file_url: str
    file_type: str

@app.get("/")
def health_check():
    return {"status": "ok", "service": "A+ Gerima AI Engine (Gemini)"}

@app.post("/process")
def process_file(request: ProcessRequest):
    """
    Receives a file URL, downloads it, extracts text, and generates study materials via Gemini.
    """
    print(f"Processing file: {request.file_url} ({request.file_type})")
    
    try:
        content = ""
        if request.file_type == "PDF":
            content = extract_text_from_pdf_url(request.file_url)
        elif request.file_type == "Ref_TEXT" or request.file_type == "Ref_URL":
            # For now, handle raw text if possible, or assume PDF logic
             return {"message": "Only PDF supported currently"}
        else:
             return {"message": "File type not supported for text extraction yet."}

        if not content:
             return {"error": "No text extracted from file"}

        print(f"Extracted {len(content)} characters. Sending to Gemini...")
        
        # Call AI Engine
        ai_response_json_str = generate_study_materials(content)
        print(f"DEBUG: AI Response: {ai_response_json_str[:500]}...")
        
        # Parse JSON
        try:
            ai_data = json.loads(ai_response_json_str)
        except json.JSONDecodeError:
            print("Failed to parse JSON from AI. Wrapping raw response.")
            ai_data = {
                "summary": ai_response_json_str[:500],
                "quiz": [],
                "flashcards": []
            }

        return {
            "status": "success",
            "extracted_length": len(content),
            "ai_data": ai_data
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
