import requests
import io
from pypdf import PdfReader

def extract_text_from_pdf_url(url: str) -> str:
    """
    Downloads a PDF from a URL and extracts its text content.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Read content into memory
        pdf_file = io.BytesIO(response.content)
        reader = PdfReader(pdf_file)
        
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        raise e
