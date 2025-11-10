import os
import tempfile
import pytesseract
from pdf2image import convert_from_path
from PIL import Image, UnidentifiedImageError
from img2table.document import Image as Img2TableImage
from img2table.ocr import TesseractOCR
import subprocess

# ----------------------------
# Helper: Check Poppler installed
# ----------------------------
def is_poppler_installed():
    try:
        subprocess.run(["pdftoppm", "-v"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except FileNotFoundError:
        return False


# ----------------------------
# Main OCR processing
# ----------------------------
def process_pdf_file(pdf_path):
    """
    Process a PDF or image file:
    - Convert to image (if PDF)
    - Extract text + tables using Tesseract + img2table
    """

    # 1. Check Poppler
    if pdf_path.lower().endswith(".pdf") and not is_poppler_installed():
        return {
            "error": (
                "❌ Poppler is not installed or not found in PATH.\n"
                "Please install it from https://github.com/oschwartz10612/poppler-windows/releases\n"
                "Then add the `Library/bin` folder to your PATH.\n"
                "Example: D:\\poppler-24.08.0\\Library\\bin"
            )
        }

    # 2. Convert PDF to images (or treat as image)
    images = []
    try:
        if pdf_path.lower().endswith(".pdf"):
            images = convert_from_path(pdf_path, dpi=300)
        else:
            images = [Image.open(pdf_path)]
    except Exception as e:
        return {"error": f"Failed to read file: {str(e)}"}

    extracted_text = ""
    extracted_tables = []
    ocr_engine = TesseractOCR(lang="eng")

    # 3. Process each page/image
    for idx, img in enumerate(images):
        temp_img_path = None
        try:
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_img:
                temp_img_path = temp_img.name
                img.save(temp_img_path, "PNG")

            # Make sure image is closed before reading again
            img.close()

            # --- Extract text ---
            with Image.open(temp_img_path) as im:
                text = pytesseract.image_to_string(im)
                extracted_text += f"\n\n--- Page {idx + 1} ---\n{text}"

            # --- Extract tables ---
            doc_image = Img2TableImage(temp_img_path)
            tables = doc_image.extract_tables(ocr=ocr_engine)
            extracted_tables.extend(tables)

        except UnidentifiedImageError:
            extracted_text += f"\n\n[Page {idx + 1}] ⚠️ Unable to process image."
        except Exception as e:
            extracted_text += f"\n\n[Page {idx + 1}] ⚠️ Error: {str(e)}"
        finally:
            # Safely delete temp image
            if temp_img_path and os.path.exists(temp_img_path):
                try:
                    os.remove(temp_img_path)
                except PermissionError:
                    pass  # Ignore if still locked

    return {
        "text": extracted_text.strip(),
        "tables": [t.json for t in extracted_tables] if extracted_tables else [],
    }


# ----------------------------
# Optional direct test
# ----------------------------
if __name__ == "__main__":
    test_file = "sample.pdf"  # or sample.png
    result = process_pdf_file(test_file)
    print(result)