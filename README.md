# Semantic Text Classification

## Cấu trúc dự án

```
semantic_text_classification/
│
├── 📁 api/                          ← Backend FastAPI server
│   ├── classify_api.py              ← Định nghĩa API endpoint /classify, load model, xử lý request
│   └── __init__.py
│
├── 📁 data/
│   ├── processed/                   ← Dữ liệu đã qua tiền xử lý
│   │   ├── df_clean.csv             ← Tập train đã làm sạch
│   │   ├── df_enriched.csv          ← Tập train đã enriched (WordNet + DBpedia)
│   │   └── test_clean.csv           ← Tập test đã làm sạch
│   └── raw/                         ← Dữ liệu gốc (AG News dataset)
│       ├── train.csv
│       └── test.csv
│
├── 📁 frontend/                     ← Giao diện React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           ← Thanh điều hướng cố định, responsive
│   │   │   ├── HeroSection.jsx      ← Trang chủ, giới thiệu hệ thống
│   │   │   ├── ClassifySection.jsx  ← Form nhập văn bản & hiển thị kết quả phân loại
│   │   │   ├── HowItWorksSection.jsx← 4 bước pipeline xử lý văn bản
│   │   │   ├── AboutSection.jsx     ← Thông tin developer
│   │   │   ├── Footer.jsx           ← Footer
│   │   │   └── ParticleBackground.jsx ← Hiệu ứng hạt nền động
│   │   ├── App.jsx                  ← Root component, ghép tất cả section
│   │   ├── index.css                ← Tailwind CSS + custom styles (glass, gradient...)
│   │   └── index.js                 ← Entry point React
│   ├── package.json                 ← Dependencies frontend (React, framer-motion...)
│   ├── tailwind.config.js           ← Cấu hình Tailwind CSS
│   └── postcss.config.js
│
├── 📁 models/                       ← Model đã được train sẵn (không commit lên Git nếu lớn)
│   ├── best_classifier.pkl          ← Mô hình phân loại tốt nhất (LogReg / XGBoost...)
│   └── tfidf_vectorizer.pkl         ← TF-IDF vectorizer đã fit trên tập train
│
├── 📁 notebooks/                    ← Jupyter Notebooks thực nghiệm
│   ├── 01_data_exploration.ipynb    ← Phân tích, thống kê dữ liệu
│   ├── 02_semantic_extraction.ipynb ← Trích xuất đặc trưng ngữ nghĩa
│   └── 03_model_experiment.ipynb    ← Huấn luyện & so sánh các mô hình
│
├── 📁 scripts/                      ← Công cụ tiện ích
│   └── check_similarity.py          ← Kiểm tra trùng lặp code với GitHub (xem bên dưới)
│
├── 📁 src/                          ← Source Python pipeline
│   ├── data_preprocessing.py        ← Làm sạch, chuẩn hóa văn bản
│   ├── semantic_features.py         ← Enrichment: WordNet synonyms, DBpedia entities
│   └── train_model.py               ← Huấn luyện model, lưu .pkl vào models/
│
├── requirements.txt                 ← Dependencies Python (pip install -r requirements.txt)
└── README.md
```

---

## Kiểm tra tính độc đáo của code (Originality Check)

Repo này tích hợp script và GitHub Actions workflow để **kiểm tra xem code có bị trùng lặp
với các repo khác trên GitHub hay không**.

### Cách hoạt động

1. Script quét tất cả file `.py` trong `api/` và `src/`.
2. Trích xuất signature của từng hàm/class (ví dụ `def enrich_with_wordnet`).
3. Tìm kiếm trên **GitHub Code Search API** theo từng signature.
4. Tính **tỉ lệ tương đồng** (0–100 %) giữa file local và file tìm được, dùng `difflib.SequenceMatcher`.
5. Báo cáo kết quả và cảnh báo nếu tỉ lệ ≥ ngưỡng (mặc định **60 %**).

### Chạy thủ công

```bash
# Cài dependency (chỉ cần requests)
pip install requests

# Chạy với GitHub Token để tránh rate-limit
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
python scripts/check_similarity.py --threshold 0.6 --verbose
```

### Kết quả mẫu

```
=================================================================
  CODE SIMILARITY CHECKER – sgu26_KnowlegeTechnology
=================================================================
Ngưỡng báo cáo: 60%
Token: có

📄 api/classify_api.py
  🔍 Tìm kiếm: 'def enrich_with_wordnet'
    ✅ some-user/some-repo    similarity=12%
  🔍 Tìm kiếm: 'def link_to_dbpedia'
    ✅ other-user/other-repo  similarity=8%

📄 src/semantic_features.py
  ...

=================================================================
TỔNG KẾT
=================================================================
✅ api/classify_api.py
✅ src/semantic_features.py

✅ Không phát hiện file nào có tỉ lệ tương đồng ≥ 60% với code trên GitHub.
```

### CI tự động

Workflow **`.github/workflows/plagiarism-check.yml`** tự chạy mỗi khi có push hoặc pull
request ảnh hưởng đến `api/` hoặc `src/`. Kết quả được lưu dưới dạng artifact
`similarity-report` trong tab **Actions** của GitHub.
