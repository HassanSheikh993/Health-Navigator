from flask import Flask, request, jsonify
from ocr_utils import process_pdf_file
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Folder to temporarily store uploaded files
UPLOAD_FOLDER = r"D:\Haseeb Disk\Health-Navigator-main\server\shared_uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🧠 OCR Service is running!",
        "usage": "POST a file to /extract to extract text and tables from a medical report (PDF or image)."
    })

@app.route("/extract", methods=["POST"])
def extract_text():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
        print(f"📥 Received file: {file_path}")
        result = process_pdf_file(file_path)

        if "error" in result:
            print(f"⚠️ OCR Error: {result['error']}")
            return jsonify(result), 500

        print("✅ OCR success, returning extracted text.")
        return jsonify({
            "status": "success",
            "file": filename,
            "extracted_text": result["text"],
            "tables": result["tables"]
        })

    except Exception as e:
        import traceback
        print("❌ Unexpected error in /extract:", traceback.format_exc())
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)