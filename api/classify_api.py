from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import math
import re
import requests
import os

app = FastAPI(title="Semantic Text Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

current_dir = os.path.dirname(os.path.abspath(__file__))
model_artifact = None
model_load_error = None
TOKEN_PATTERN = re.compile(r"(?u)\b\w\w+\b")
wordnet_mappings = None

# Load lightweight WordNet mappings for serverless compatibility
def load_wordnet_mappings():
    global wordnet_mappings
    if wordnet_mappings is not None:
        return
    try:
        mappings_path = os.path.join(current_dir, "wordnet_mappings.json")
        with open(mappings_path, "r", encoding="utf-8") as f:
            wordnet_mappings = json.load(f)
    except Exception:
        wordnet_mappings = {}

label_dict = {
    1: {"label": "World",    "emoji": "🌍", "color": "#06b6d4"},
    2: {"label": "Sports",   "emoji": "⚽", "color": "#8b5cf6"},
    3: {"label": "Business", "emoji": "💼", "color": "#6366f1"},
    4: {"label": "Sci/Tech", "emoji": "🚀", "color": "#22d3ee"},
}

def enrich_with_wordnet(text):
    load_wordnet_mappings()
    try:
        enriched_words = []
        words = re.findall(r'\b\w+\b', str(text).lower())
        for word in words:
            # Look up word in lightweight mappings
            if word in wordnet_mappings:
                enriched_words.append(wordnet_mappings[word])
        return ' '.join(enriched_words) if enriched_words else ""
    except Exception:
        return ""


def _models_dir_candidates():
    return [
        current_dir,
        os.path.join(current_dir, "..", "models"),
        os.path.join(current_dir, "models"),
    ]


def load_model_artifacts():
    global model_artifact, model_load_error
    if model_artifact is not None:
        return True

    last_error = None
    for models_dir in _models_dir_candidates():
        try:
            artifact_path = os.path.join(models_dir, "model_data.json")
            if not os.path.exists(artifact_path):
                continue

            with open(artifact_path, "r", encoding="utf-8") as handle:
                model_artifact = json.load(handle)
            model_load_error = None
            return True
        except Exception as exc:
            last_error = exc

    model_load_error = str(last_error) if last_error else "Model files not found"
    return False


def _tokenize(text):
    lowered = str(text).lower()
    return TOKEN_PATTERN.findall(lowered)


def _predict_category(combined_text):
    artifact = model_artifact
    vocabulary = artifact["vocabulary"]
    idf = artifact["idf"]
    coefficients = artifact["coef"]
    intercept = artifact["intercept"]
    classes = artifact["classes"]

    counts = {}
    for token in _tokenize(combined_text):
        index = vocabulary.get(token)
        if index is not None:
            counts[index] = counts.get(index, 0) + 1

    if not counts:
        scores = list(intercept)
        best_index = max(range(len(scores)), key=lambda idx: scores[idx])
        return classes[best_index], scores, None

    weighted_values = {}
    norm_sq = 0.0
    for index, count in counts.items():
        tfidf_value = float(count) * float(idf[index])
        weighted_values[index] = tfidf_value
        norm_sq += tfidf_value * tfidf_value

    norm = math.sqrt(norm_sq) if norm_sq > 0 else 1.0
    scores = []
    for class_index in range(len(classes)):
        score = float(intercept[class_index])
        for index, tfidf_value in weighted_values.items():
            score += (tfidf_value / norm) * float(coefficients[class_index][index])
        scores.append(score)

    best_index = max(range(len(scores)), key=lambda idx: scores[idx])
    return classes[best_index], scores, max(scores)

def link_to_dbpedia(text):
    url = "https://api.dbpedia-spotlight.org/en/annotate"
    params = {"text": str(text), "confidence": 0.5}
    headers = {"Accept": "application/json"}
    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            uris = [res['@URI'].split('/')[-1] for res in data.get('Resources', [])]
            return ' '.join(uris)
    except Exception:
        return ""
    return ""

class TextInput(BaseModel):
    text: str

@app.get("/health")
@app.get("/api/health")
async def health():
    loaded = load_model_artifacts()
    return {
        "status": "ok" if loaded else "degraded",
        "model_loaded": loaded,
        "model_error": None if loaded else model_load_error,
    }

@app.post("/classify")
@app.post("/api/classify")
async def classify_text(input: TextInput):
    if not load_model_artifacts():
        raise HTTPException(status_code=500, detail=f"Model initialization failed: {model_load_error}")

    wordnet_feats = enrich_with_wordnet(input.text)
    dbpedia_feats = link_to_dbpedia(input.text)
    combined_text = f"{input.text} {wordnet_feats} {dbpedia_feats}"

    prediction, scores, best_score = _predict_category(combined_text)

    confidence = None
    if best_score is not None:
        confidence = round(float(100.0 / (1.0 + math.exp(-best_score))), 2)

    result = label_dict.get(int(prediction), {"label": "Unknown", "emoji": "❓", "color": "#fff"})

    return {
        "category": result["label"],
        "emoji": result["emoji"],
        "color": result["color"],
        "confidence": confidence,
        "wordnet_features": wordnet_feats,
        "dbpedia_features": dbpedia_feats,
        "label_id": int(prediction),
    }
