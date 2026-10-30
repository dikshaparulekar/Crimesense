"""
CrimeSense High-Fidelity Synthetic Benchmark Generator for Maharashtra Urban Centers.
Generates realistic multi-year incident-level records (2021-2024) across verified police station jurisdictions
in Mumbai, Pune, and Nagpur to support Scalable PySpark pipeline processing, Hotspot clustering (K-Means/DBSCAN),
and Machine Learning Risk Forecasting (Random Forest & XGBoost).

EVERY RECORD IS EXPLICITLY TAGGED WITH is_synthetic=True and label 'SYNTHETIC DEMO DATA'.
"""

import os
import math
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Realistic Police Station Geographies (Centers for spatial clusters)
POLICE_STATIONS = [
    # Mumbai Metropolitan
    {"city": "Mumbai", "district": "Mumbai City", "station": "Colaba Police Station", "lat": 18.9154, "lon": 72.8258, "base_rate": 1.2, "commercial_density": 0.85},
    {"city": "Mumbai", "district": "Mumbai City", "station": "Marine Drive Police Station", "lat": 18.9438, "lon": 72.8232, "base_rate": 0.9, "commercial_density": 0.70},
    {"city": "Mumbai", "district": "Mumbai Suburban", "station": "Bandra Police Station", "lat": 19.0596, "lon": 72.8295, "base_rate": 1.8, "commercial_density": 0.92},
    {"city": "Mumbai", "district": "Mumbai Suburban", "station": "Andheri Police Station", "lat": 19.1197, "lon": 72.8464, "base_rate": 2.1, "commercial_density": 0.95},
    {"city": "Mumbai", "district": "Mumbai Suburban", "station": "Kurla Police Station", "lat": 19.0726, "lon": 72.8845, "base_rate": 2.4, "commercial_density": 0.88},
    {"city": "Mumbai", "district": "Mumbai Suburban", "station": "Borivali Police Station", "lat": 19.2288, "lon": 72.8541, "base_rate": 1.5, "commercial_density": 0.80},
    {"city": "Mumbai", "district": "Mumbai Suburban", "station": "Dadar Police Station", "lat": 19.0178, "lon": 72.8478, "base_rate": 1.7, "commercial_density": 0.90},
    {"city": "Mumbai", "district": "Mumbai Suburban", "station": "Ghatkopar Police Station", "lat": 19.0860, "lon": 72.9090, "base_rate": 1.6, "commercial_density": 0.82},

    # Pune
    {"city": "Pune", "district": "Pune Urban", "station": "Shivajinagar Police Station", "lat": 18.5314, "lon": 73.8446, "base_rate": 1.4, "commercial_density": 0.85},
    {"city": "Pune", "district": "Pune Urban", "station": "Kothrud Police Station", "lat": 18.5074, "lon": 73.8077, "base_rate": 1.1, "commercial_density": 0.75},
    {"city": "Pune", "district": "Pune Urban", "station": "Hinjewadi Police Station", "lat": 18.5913, "lon": 73.7389, "base_rate": 1.5, "commercial_density": 0.90},
    {"city": "Pune", "district": "Pune Urban", "station": "Hadapsar Police Station", "lat": 18.5089, "lon": 73.9260, "base_rate": 1.6, "commercial_density": 0.80},
    {"city": "Pune", "district": "Pune Urban", "station": "Viman Nagar Police Station", "lat": 18.5679, "lon": 73.9143, "base_rate": 1.3, "commercial_density": 0.88},
    {"city": "Pune", "district": "Pune Urban", "station": "Swargate Police Station", "lat": 18.5018, "lon": 73.8586, "base_rate": 1.9, "commercial_density": 0.89},

    # Nagpur
    {"city": "Nagpur", "district": "Nagpur Urban", "station": "Sitabuldi Police Station", "lat": 21.1458, "lon": 79.0882, "base_rate": 1.6, "commercial_density": 0.90},
    {"city": "Nagpur", "district": "Nagpur Urban", "station": "Sadar Police Station", "lat": 21.1610, "lon": 79.0820, "base_rate": 1.3, "commercial_density": 0.82},
    {"city": "Nagpur", "district": "Nagpur Urban", "station": "Dharampeth Police Station", "lat": 21.1402, "lon": 79.0620, "base_rate": 1.1, "commercial_density": 0.78},
    {"city": "Nagpur", "district": "Nagpur Urban", "station": "Dhantoli Police Station", "lat": 21.1310, "lon": 79.0815, "base_rate": 1.2, "commercial_density": 0.81},
    {"city": "Nagpur", "district": "Nagpur Urban", "station": "Pardi Police Station", "lat": 21.1495, "lon": 79.1432, "base_rate": 1.4, "commercial_density": 0.70}
]

CRIME_CATEGORIES = [
    {"category": "Property Theft & Burglary", "prob": 0.45, "severity": 2, "time_bias": "night"},
    {"category": "Violent Crimes", "prob": 0.20, "severity": 5, "time_bias": "late_evening"},
    {"category": "Crimes Against Women", "prob": 0.18, "severity": 4, "time_bias": "evening"},
    {"category": "Cyber Crimes", "prob": 0.10, "severity": 3, "time_bias": "day"},
    {"category": "Economic Offences", "prob": 0.07, "severity": 3, "time_bias": "day"}
]

def generate_synthetic_incidents(
    n_samples: int = 15000, 
    start_date: str = "2021-01-01", 
    end_date: str = "2024-12-31",
    output_path: str = "data/synthetic/maharashtra_urban_synthetic.csv",
    seed: int = 42
):
    np.random.seed(seed)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d")
    date_delta_days = (end_dt - start_dt).days

    cat_names = [c["category"] for c in CRIME_CATEGORIES]
    cat_probs = [c["prob"] for c in CRIME_CATEGORIES]

    records = []
    
    for i in range(n_samples):
        # Pick police station with weight proportional to base_rate
        station_weights = np.array([ps["base_rate"] for ps in POLICE_STATIONS])
        station_weights = station_weights / station_weights.sum()
        ps_idx = np.random.choice(len(POLICE_STATIONS), p=station_weights)
        ps = POLICE_STATIONS[ps_idx]

        # Crime Category
        cat_idx = np.random.choice(len(CRIME_CATEGORIES), p=cat_probs)
        crime = CRIME_CATEGORIES[cat_idx]

        # Timestamp simulation
        day_offset = np.random.randint(0, date_delta_days)
        # Hour distribution conditioned on crime time_bias
        bias = crime["time_bias"]
        if bias == "night":
            hour = int(np.random.choice([20, 21, 22, 23, 0, 1, 2, 3, 4]))
        elif bias == "late_evening":
            hour = int(np.clip(np.random.normal(21, 2.5), 18, 23))
        elif bias == "evening":
            hour = int(np.clip(np.random.normal(19, 3.0), 16, 23))
        else: # day
            hour = int(np.clip(np.random.normal(14, 3.5), 9, 19))
            
        minute = np.random.randint(0, 60)
        incident_time = start_dt + timedelta(days=day_offset, hours=hour, minutes=minute)
        
        # Spatial jitter within police station jurisdiction (~ 1.5km gaussian std dev: 0.012 deg)
        lat_jitter = np.random.normal(0, 0.010)
        lon_jitter = np.random.normal(0, 0.010)
        lat = round(ps["lat"] + lat_jitter, 6)
        lon = round(ps["lon"] + lon_jitter, 6)

        # Environmental & Feature Engineering values
        dow = incident_time.weekday() # 0 = Monday, 6 = Sunday
        is_weekend = int(dow >= 5)
        month = incident_time.month
        # Monsoon factor in Maharashtra: Jun to Sep
        is_monsoon = int(month in [6, 7, 8, 9])
        transit_proximity = round(float(np.clip(np.random.exponential(0.8), 0.05, 5.0)), 2)
        lighting_cond = "Adequate Street Lighting" if (hour >= 6 and hour <= 18) or np.random.rand() > 0.45 else "Poor / Dark Corridor"
        
        records.append({
            "incident_id": f"SYNTH-MH-{i+1:06d}",
            "timestamp": incident_time.strftime("%Y-%m-%d %H:%M:%S"),
            "date": incident_time.strftime("%Y-%m-%d"),
            "year": incident_time.year,
            "month": month,
            "day": incident_time.day,
            "hour": hour,
            "day_of_week": dow,
            "is_weekend": is_weekend,
            "is_monsoon": is_monsoon,
            "city": ps["city"],
            "district": ps["district"],
            "police_station": ps["station"],
            "latitude": lat,
            "longitude": lon,
            "crime_category": crime["category"],
            "severity_weight": crime["severity"],
            "commercial_density": ps["commercial_density"],
            "transit_proximity_km": transit_proximity,
            "lighting_condition": lighting_cond,
            "is_synthetic": True,
            "data_label": "SYNTHETIC DEMO DATA"
        })

    df = pd.DataFrame(records)
    # Sort chronologically
    df.sort_values(by="timestamp", inplace=True)
    df.reset_index(drop=True, inplace=True)
    
    # Save CSV
    df.to_csv(output_path, index=False)
    
    # Save Parquet for big data processing
    parquet_path = output_path.replace(".csv", ".parquet")
    df.to_parquet(parquet_path, index=False)
    
    print(f"Generated {len(df)} synthetic records:")
    print(f" -> CSV: {output_path}")
    print(f" -> Parquet: {parquet_path}")
    return df

if __name__ == "__main__":
    generate_synthetic_incidents(n_samples=15000)
