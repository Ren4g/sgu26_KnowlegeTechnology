from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import requests
import nltk
from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
import os

# Download NLTK data if needed
for pkg in ['wordnet', 'punkt', 'omw-1.4', 'punkt_tab']:
    try:
        nltk.data.find(f'corpora/{pkg}' if pkg in ['wordnet','omw-1.4'] else f'tokenizers/{pkg}')
    except LookupError:
        nltk.download(pkg, quiet=True)

app = FastAPI(title="Semantic Text Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
current_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(current_dir, '..', 'models')

vectorizer = joblib.load(os.path.join(models_dir, "tfidf_vectorizer.pkl"))
model = joblib.load(os.path.join(models_dir, "best_classifier.pkl"))

label_dict = {
    1: {"label": "World",    "emoji": "🌍", "color": "#06b6d4"},
    2: {"label": "Sports",   "emoji": "⚽", "color": "#8b5cf6"},
    3: {"label": "Business", "emoji": "💼", "color": "#6366f1"},
    4: {"label": "Sci/Tech", "emoji": "🚀", "color": "#22d3ee"},
}

def enrich_with_wordnet(text):
    enriched_words = []
    words = word_tokenize(str(text))
    for word in words:
        synsets = wordnet.synsets(word)
        if synsets:
            primary_synset = synsets[0]
            for lemma in primary_synset.lemmas()[:1]:
                enriched_words.append(lemma.name().replace('_', ' '))
            for hypernym in primary_synset.hypernyms()[:1]:
                enriched_words.append(hypernym.lemmas()[0].name().replace('_', ' '))
    return ' '.join(set(enriched_words))

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
async def health():
    return {"status": "ok"}

@app.post("/classify")
async def classify_text(input: TextInput):
    wordnet_feats = enrich_with_wordnet(input.text)
    dbpedia_feats = link_to_dbpedia(input.text)
    combined_text = f"{input.text} {wordnet_feats} {dbpedia_feats}"

    input_vector = vectorizer.transform([combined_text])
    prediction = model.predict(input_vector)[0]

    confidence = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(input_vector)[0]
        confidence = round(float(max(proba)) * 100, 2)

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
