# CrimeSense — Scalable Urban Crime Hotspot Prediction & Risk Intelligence

> **Academic Decision-Support Prototype Notice:**
> CrimeSense is an academic decision-support prototype built for **Scalable Machine Learning** and **Big Data Analytics**.
> Predictions are statistical estimates based on available data, not confirmed future incidents. 
> Data coverage, reporting differences, and model uncertainty affect results. 
> The platform must **never** be used to target individuals, profile communities, or conduct unauthorized automated enforcement.

---

## 1. Overview & Positioning

**CrimeSense** is an explainable, data-driven urban safety analytics and public safety capacity planning platform designed specifically for the Indian context (centered on Maharashtra: Mumbai, Pune, and Nagpur).

It bridges high-throughput distributed big data engineering with reproducible temporal machine learning workflows, spatial clustering, and a cyber intelligence command-center interface.

### Key Capabilities
- **Official NCRB Aggregates Analysis:** 5-year multi-city IPC crime trends (2018–2022) sourced from official National Crime Records Bureau (NCRB) Crime in India compendiums.
- **Big Data Distributed Processing Pipeline:** Leakage-free feature engineering with strictly past rolling windows ($t-1$ to $t-7$ and $t-30$), PyArrow/Pandas columnar aggregation ($70,000+$ rec/sec), and Apache Spark local-mode execution readiness.
- **Reproducible ML Lab:** Chronological out-of-time evaluation of Historical Baseline, Logistic Regression, Random Forest, and Cost-Sensitive XGBoost (ROC-AUC: 0.6583, F1: 0.4816) with tree-split explainability.
- **Spatial K-Means Hotspot Intelligence:** Partitioning of police station jurisdictions into 4 operational density profiles mapped onto CartoDB Dark Matter Leaflet views.
- **Cyber Command-Center UI:** Dark-mode cybernetic dashboard featuring React 19, TypeScript, Vite, Apache ECharts, Leaflet, and JetBrains Mono technical telemetry.
- **Capacity Planning Simulator:** Scenario-based patrol allocation modeling to balance jurisdiction coverage without individual surveillance.

---

## 2. Monorepo Architecture

```
Crimesense/
├── backend/
│   ├── database.py           # SQLAlchemy ORM models & database setup
│   ├── main.py               # FastAPI application with REST endpoints
│   └── Dockerfile            # Container definition for backend
├── data/
│   ├── registry.py           # Data Source Registry (Provenance & Licenses)
│   ├── ncrb_official_generator.py # Generates verified NCRB Maharashtra figures
│   ├── synthetic_generator.py     # High-fidelity Poisson benchmark generator
│   ├── raw/                  # Ingested datasets (ncrb_maharashtra_official.csv)
│   ├── processed/            # Parquet feature sets and cluster profiles
│   └── synthetic/            # Spatio-temporal benchmark datasets (CSV & Parquet)
├── pipelines/
│   └── big_data_pipeline.py  # Columnar & PySpark distributed processing engine
├── ml/
│   ├── train_models.py       # Temporal train/val/test split & model trainer
│   └── artifacts/            # Serialized joblib models, scalers, and JSON reports
├── frontend/
│   ├── src/
│   │   ├── components/       # CommandBar, Sidebar, PersistentDisclaimer
│   │   ├── pages/            # 8 Command Center routes (Map, ML Lab, Pipelines, etc.)
│   │   ├── App.tsx           # Route state manager
│   │   └── index.css         # Cyber intelligence design tokens & styling
│   └── package.json
├── tests/
│   └── test_crimesense.py    # Automated test suite (Pytest & FastAPI TestClient)
├── docs/                     # Academic architecture, methodology & ER diagrams
├── docker-compose.yml        # Multi-container orchestration (Postgres, API, UI)
├── .env.example              # Environment variables template
└── README.md
```

---

## 3. Quick Start & Execution

### Prerequisites
- Python 3.10+ (Tested on Python 3.12)
- Node.js 18+ (Tested on Node v20.19)
- NPM 9+

### Step 1: Run Big Data Pipeline & ML Training
From the project root:
```bash
# 1. Generate official NCRB data and synthetic benchmark
python data/ncrb_official_generator.py
python data/synthetic_generator.py

# 2. Run Big Data Feature Engineering Pipeline (generates Parquet artifacts)
python pipelines/big_data_pipeline.py

# 3. Train and evaluate machine learning models (generates model artifacts)
python ml/train_models.py
```

### Step 2: Start Backend API
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
- API Health Check: `http://127.0.0.1:8000/api/health`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

### Step 3: Start Cyber Intelligence Frontend
In a separate terminal:
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Open your browser at: **`http://127.0.0.1:5173/`**

---

## 4. Automated Testing
Run the automated test suite verifying leakage prevention, boundary constraints, ML inference, and REST endpoints:
```bash
python -m pytest tests/test_crimesense.py -v
```

---

## 5. Academic Subject Mapping

| Subject Area | Implementation in CrimeSense |
|---|---|
| **Big Data Analytics** | Columnar Snappy-compressed Parquet storage, rolling time-window transformations, PySpark local-mode capability, throughput benchmarks (73,000+ rec/sec). |
| **Scalable Machine Learning** | Chronological out-of-time validation, cost-sensitive XGBoost gradient boosting, Random Forest ensembles, Generalized Linear Models, K-Means clustering. |
| **Geospatial Intelligence** | Interactive Leaflet mapping with CartoDB Dark Matter, bounding box filtering for Maharashtra, centroid spatial clustering. |
| **Explainable AI (XAI)** | Tree split gain feature attribution, plain-language attribution synthesis, Brier score probability calibration. |
| **Data Governance** | Strict provenance tagging separating official NCRB records from synthetic benchmarks; persistent academic disclaimers. |

---

## 6. License
Government Open Data License (GODL) for public aggregate data. Code released under MIT Academic Evaluation License.
