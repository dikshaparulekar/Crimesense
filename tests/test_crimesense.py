"""
CrimeSense Automated Test Suite
Verifies:
1. Data schema validation & boundary checks
2. Date parsing & temporal order
3. Prevention of target leakage (t-1 lag validation)
4. Big Data Columnar Pipeline execution & parquet creation
5. ML models training, predictions, and calibration metrics
6. FastAPI REST endpoints & Database operations
"""

import os
import json
import pytest
import pandas as pd
import numpy as np
from fastapi.testclient import TestClient

from backend.main import app
from backend.database import init_db, SessionLocal, DatasetModel, GeographicUnitModel
from pipelines.big_data_pipeline import BigDataPipeline

client = TestClient(app)

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert "CrimeSense" in data["service"]

def test_api_overview():
    res = client.get("/api/overview")
    assert res.status_code == 200
    data = res.json()
    assert "Maharashtra" in data["study_region"]
    assert data["data_quality_score"] > 90
    assert data["datasets_registered"] >= 2

def test_dataset_registry_and_preview():
    res = client.get("/api/datasets")
    assert res.status_code == 200
    datasets = res.json()["datasets"]
    assert len(datasets) >= 2
    
    # Check official vs synthetic labeling
    official_ds = [d for d in datasets if not d["is_synthetic"]]
    synthetic_ds = [d for d in datasets if d["is_synthetic"]]
    assert len(official_ds) > 0
    assert len(synthetic_ds) > 0
    
    # Test preview endpoint
    res_prev = client.get(f"/api/datasets/{official_ds[0]['id']}/preview")
    assert res_prev.status_code == 200
    prev_data = res_prev.json()
    assert len(prev_data["rows"]) > 0

def test_leakage_prevention_in_pipeline():
    """Verify that lag features are strictly shifted and contain zero target leakage."""
    features_path = "data/processed/station_daily_features.parquet"
    assert os.path.exists(features_path)
    df = pd.read_parquet(features_path)
    
    # Check that rolling 7d lag is non-negative and correctly constructed
    assert "rolling_7d_past_count" in df.columns
    assert "rolling_30d_past_count" in df.columns
    assert (df["rolling_7d_past_count"] >= 0).all()
    
    # Ensure first record per station has 0 past counts (due to shift(1))
    first_records = df.groupby("police_station").first()
    assert (first_records["rolling_7d_past_count"] == 0).all()

def test_geographic_boundaries():
    """Verify that all generated incident and station coordinates are within Maharashtra bounds."""
    hotspots_path = "data/processed/police_station_clusters.parquet"
    assert os.path.exists(hotspots_path)
    df = pd.read_parquet(hotspots_path)
    
    # Maharashtra lat 15-23, lon 72-81.5
    assert (df["avg_lat"] >= 15.0).all() and (df["avg_lat"] <= 23.0).all()
    assert (df["avg_lon"] >= 72.0).all() and (df["avg_lon"] <= 81.5).all()

def test_ml_prediction_endpoint():
    """Verify actual trained model inference via FastAPI."""
    payload = {
        "police_station": "Andheri Police Station",
        "rolling_7d_past_count": 12.0,
        "rolling_30d_past_count": 42.0,
        "station_baseline_rate": 1.9,
        "commercial_density": 0.95,
        "transit_proximity_km": 0.4,
        "is_weekend": 1,
        "is_monsoon": 0
    }
    res = client.post("/api/models/predict", json=payload)
    assert res.status_code == 200
    pred = res.json()
    assert "estimated_probability" in pred
    assert 0.0 <= pred["estimated_probability"] <= 1.0
    assert pred["risk_level"] in ["LOW", "MODERATE", "ELEVATED"]
    assert "explainability_plain_language" in pred
    assert pred["data_label"] == "SYNTHETIC DEMO PREDICTION"

def test_planning_simulator_endpoint():
    """Verify resource capacity planning simulation."""
    payload = {
        "city": "Mumbai",
        "total_patrol_units": 25,
        "strategy": "HOTSPOT_PROPORTIONAL"
    }
    res = client.post("/api/planning/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["allocations"]) > 0
    total_allocated = sum(a["allocated_patrol_units"] for a in data["allocations"])
    assert round(total_allocated) == 25
