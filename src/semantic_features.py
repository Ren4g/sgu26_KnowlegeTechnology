"""
Semantic Features Extraction Module
Trích xuất các đặc trưng ngữ nghĩa từ văn bản sử dụng WordNet và DBpedia
"""
import requests
import nltk
from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
from functools import lru_cache
import time

# Tải gói dữ liệu NLTK
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
    nltk.download('omw-1.4', quiet=True)


@lru_cache(maxsize=50000)
def enrich_with_wordnet(text):
    """
    Làm giàu văn bản với WordNet (từ đồng nghĩa và từ bao nghĩa)
    
    Args:
        text (str): Văn bản đầu vào
    
    Returns:
        str: Chuỗi các từ đã được làm giàu
    """
    enriched_words = []
    words = word_tokenize(str(text))
    
    for word in words:
        synsets = wordnet.synsets(word)
        if synsets:
            primary_synset = synsets[0]
            # Lấy 1 từ đồng nghĩa
            for lemma in primary_synset.lemmas()[:1]: 
                enriched_words.append(lemma.name().replace('_', ' '))
            # Lấy 1 từ bao nghĩa (khái niệm rộng hơn)
            for hypernym in primary_synset.hypernyms()[:1]: 
                enriched_words.append(hypernym.lemmas()[0].name().replace('_', ' '))
                
    return ' '.join(set(enriched_words))


@lru_cache(maxsize=50000)
def link_to_dbpedia(text):
    """
    Liên kết văn bản với DBpedia entities
    
    Args:
        text (str): Văn bản đầu vào
    
    Returns:
        str: Chuỗi các DBpedia URIs
    """
    url = "https://api.dbpedia-spotlight.org/en/annotate"
    params = {"text": str(text), "confidence": 0.5}
    headers = {"Accept": "application/json"}
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            uris = []
            if 'Resources' in data:
                for resource in data['Resources']:
                    uri_tail = resource['@URI'].split('/')[-1]
                    uris.append(uri_tail)
            time.sleep(0.05)  # Delay nhỏ để tránh rate limit
            return ' '.join(uris)
    except Exception:
        pass
    
    time.sleep(0.05)
    return ""


def enrich_with_semantic_features(text):
    """
    Hàm chính để làm giàu văn bản với cả WordNet và DBpedia
    
    Args:
        text (str): Văn bản đầu vào
    
    Returns:
        dict: Dictionary chứa wordnet_features và dbpedia_features
    """
    return {
        'wordnet_features': enrich_with_wordnet(text),
        'dbpedia_features': link_to_dbpedia(text)
    }


def enrich_batch(texts, use_dbpedia=True):
    """
    Làm giàu một batch các văn bản
    
    Args:
        texts (list): List các văn bản
        use_dbpedia (bool): Có sử dụng DBpedia không (mất thời gian)
    
    Returns:
        list: List các dictionary chứa features
    """
    results = []
    for text in texts:
        wordnet_feat = enrich_with_wordnet(text)
        dbpedia_feat = link_to_dbpedia(text) if use_dbpedia else ""
        
        results.append({
            'wordnet_features': wordnet_feat,
            'dbpedia_features': dbpedia_feat
        })
    
    return results
