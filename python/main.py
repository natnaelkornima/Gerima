from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils.text_extractor import extract_text_from_pdf_url
import uvicorn

app = FastAPI()

class ProcessRequest(BaseModel):
    file_url: str
    file_type: str

@app.get("/")
def health_check():
    return {"status": "ok", "service": "A+ Gerima AI Engine"}

@app.post("/process")
def process_file(request: ProcessRequest):
    """
    Receives a file URL, downloads it, extracts text, and (in future) generates study materials.
    """
    print(f"Processing file: {request.file_url} ({request.file_type})")
    
    try:
        content = ""
        if request.file_type == "PDF":
            content = extract_text_from_pdf_url(request.file_url)
        else:
            return {"message": "File type not supported for text extraction yet."}

        # TODO: Send 'content' to LLM for summarization/quiz generation.
        # For now, just return the extracted text stats.
        
        return {
            "status": "success",
            "extracted_length": len(content),
            "preview": content[:200] + "..." if content else ""
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
