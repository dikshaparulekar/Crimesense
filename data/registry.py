"""
CrimeSense Data Source Registry
Official NCRB and verified public crime data sources + synthetic benchmark generators.
"""

from datetime import datetime
from typing import Dict, Any, List

DATASET_REGISTRY: List[Dict[str, Any]] = [
    {
        "id": "ncrb_maharashtra_annual",
        "name": "NCRB Crime in India - Maharashtra & City Aggregates",
        "publisher": "National Crime Records Bureau (NCRB), Ministry of Home Affairs, Govt. of India",
        "source_url": "https://www.ncrb.mha.gov.in/crime-in-india.html",
        "geographic_coverage": "Maharashtra (State level, Mumbai, Pune, Nagpur metropolitan aggregates)",
        "time_period": "2018 - 2022 (Annual)",
        "granularity": "Annual city / state summary by IPC & SLL crime classifications",
        "available_fields": [
            "state_ut", "city_district", "year", "crime_head", "cases_reported", 
            "cases_chargesheeted", "cases_convicted", "rate_per_lakh_population", "crime_severity_weight"
        ],
        "license": "Government Open Data License - India (GODL)",
        "import_date": "2026-10-27",
        "quality_status": "VERIFIED_OFFICIAL",
        "is_synthetic": False,
        "citation": "NCRB (2022). Crime in India 2022 Compendium, National Crime Records Bureau, New Delhi.",
        "limitations": "Aggregated annually. Does not provide precise latitude/longitude, police station coordinates, or sub-daily timestamps."
    },
    {
        "id": "maharashtra_urban_synthetic_benchmark",
        "name": "Maharashtra Urban Simulated Police Station Benchmark",
        "publisher": "CrimeSense Big Data & ML Research Benchmark Generator",
        "source_url": "Synthetic Local Generation",
        "geographic_coverage": "Mumbai Metropolitan Region (MMR), Pune City, Nagpur Urban",
        "time_period": "2021-01-01 to 2024-12-31 (Multi-year, Daily/Hourly granular)",
        "granularity": "Incident-level and daily station-level spatio-temporal logs",
        "available_fields": [
            "incident_id", "timestamp", "city", "district", "police_station", "latitude", "longitude",
            "crime_category", "severity_weight", "day_of_week", "hour_of_day", "lighting_condition",
            "commercial_density", "transit_proximity_km", "historical_7d_count", "historical_30d_count", "is_synthetic"
        ],
        "license": "Open Academic Evaluation License (Simulated Data Only)",
        "import_date": "2026-10-27",
        "quality_status": "SYNTHETIC_DEMO_DATA",
        "is_synthetic": True,
        "citation": "Simulated spatial Poisson process calibrated with NCRB marginal rates for Mumbai, Pune, Nagpur.",
        "limitations": "SYNTHETIC DEMO DATA. Strictly for scalable ML pipeline demonstration, spatial clustering, and temporal forecasting testing."
    }
]

DATA_DISCLAIMER: str = (
    "CrimeSense is an academic decision-support prototype. Predictions are estimates based "
    "on available data, not confirmed future incidents. Data coverage, reporting differences "
    "and model uncertainty affect results. The platform must not be used to target individuals or communities."
)
