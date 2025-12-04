# predict_liver.py (CLEAN & FIXED)
import joblib
import sys
import json
import os
import pandas as pd
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

# Locate model relative to this script
script_dir = os.path.dirname(os.path.realpath(__file__))
model_path = os.path.join(script_dir, "liver_model.joblib")

# Load model
try:
    model = joblib.load(model_path)
except Exception as e:
    print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
    sys.exit(1)

# Read JSON input from Node
try:
    data = json.loads(sys.stdin.read())
except Exception:
    print(json.dumps({"error": "Invalid JSON input received"}))
    sys.exit(1)

# Build input dictionary EXACTLY matching training column names
sample_dict = {
    "Age": data.get("age", 0),
    "Gender": 1 if str(data.get("gender", "")).lower() == "male" else 0,
    "Total_Bilirubin": data.get("total_bilirubin", 0),
    "Direct_Bilirubin": data.get("direct_bilirubin", 0),
    "Alkphos": data.get("alkphos", 0),
    "Sgpt": data.get("sgpt", 0),
    "Sgot": data.get("sgot", 0),
    
    # NOTE: Your dataset uses misspelled 'Total_Protiens'. Must match exactly.
    "Total_Protiens": data.get("total_proteins", 0),
    
    "ALB": data.get("albumin", 0),
    "A_G_Ratio": data.get("ag_ratio", 0),
}

# Convert to DataFrame with exact column order
try:
    df = pd.DataFrame([sample_dict], columns=sample_dict.keys())
except Exception as e:
    print(json.dumps({"error": f"Failed to prepare DataFrame: {str(e)}"}))
    sys.exit(1)

# Predict
try:
    pred = model.predict(df)[0]
    result = "Abnormal" if pred == 1 else "Normal"
except Exception as e:
    print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
    sys.exit(1)

# Output JSON
print(json.dumps({"result": result}))
