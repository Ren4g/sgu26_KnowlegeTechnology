<pre>
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
├── 📁 src/                          ← Source Python pipeline
│   ├── data_preprocessing.py        ← Làm sạch, chuẩn hóa văn bản
│   ├── semantic_features.py         ← Enrichment: WordNet synonyms, DBpedia entities
│   └── train_model.py               ← Huấn luyện model, lưu .pkl vào models/
│
├── requirements.txt                 ← Dependencies Python (pip install -r requirements.txt)
└── README.md
</pre>
