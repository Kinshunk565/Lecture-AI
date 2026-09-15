import requests
import os
import json
import sys
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import joblib

# Ensure jsons directory exists
os.makedirs("jsons", exist_ok=True)

def create_embedding(text_list):
    # https://github.com/ollama/ollama/blob/main/docs/api.md#generate-embeddings
    try:
        r = requests.post("http://localhost:11434/api/embed", json={
            "model": "bge-m3",
            "input": text_list
        }, timeout=60)
        r.raise_for_status()
        return r.json()["embeddings"]
    except requests.exceptions.RequestException as e:
        print(f"\nError connecting to Ollama service (http://localhost:11434): {e}")
        print("Please make sure Ollama is running locally and model 'bge-m3' is available ('ollama pull bge-m3').")
        sys.exit(1)

jsons = [f for f in os.listdir("jsons") if f.endswith(".json")]
if not jsons:
    print("No JSON transcription files found in 'jsons/' directory. Run mp3_to_json.py first.")
    sys.exit(1)

my_dicts = []
chunk_id = 0

for json_file in jsons:
    json_path = os.path.join("jsons", json_file)
    with open(json_path, "r", encoding="utf-8") as f:
        content = json.load(f)
    
    chunks = content.get("chunks", [])
    if not chunks:
        continue

    print(f"Creating Embeddings for {json_file} ({len(chunks)} chunks)...")
    embeddings = create_embedding([c['text'] for c in chunks])
       
    for i, chunk in enumerate(chunks):
        chunk['chunk_id'] = chunk_id
        chunk['embedding'] = embeddings[i]
        chunk_id += 1
        my_dicts.append(chunk) 

if my_dicts:
    df = pd.DataFrame.from_records(my_dicts)
    joblib.dump(df, 'embeddings.joblib')
    print(f"Successfully generated and saved embeddings to 'embeddings.joblib' ({len(df)} total chunks).")
else:
    print("No valid chunks found to create embeddings.")


