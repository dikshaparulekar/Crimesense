# CrimeSense Technical Architecture & Methodology Specification

## 1. System Architecture

```
                                  +---------------------------------------+
                                  |     CrimeSense Cyber Intelligence     |
                                  |           React 19 / Vite UI          |
                                  |     (CartoDB Leaflet + ECharts)       |
                                  +-------------------+-------------------+
                                                      |
                                           REST API   |  HTTP / JSON
                                                      v
                                  +-------------------+-------------------+
                                  |       FastAPI Backend Gateway         |
                                  |  (Pydantic V2 / SQLAlchemy ORM / DB)  |
                                  +---------+-------------------+---------+
                                            |                   |
                     +----------------------+                   +---------------------+
                     |                                                                |
                     v                                                                v
+--------------------+---------------------+                  +-----------------------+---------------------+
|         Big Data Analytics Engine        |                  |         Machine Learning Laboratory         |
|  - Ingestion & Bounding Box Auditing     |                  |  - Out-of-Time Chronological Validation     |
|  - Strictly Past Lag ($t-1$ to $t-7/30$) |                  |  - Historical Heuristic Baseline            |
|  - PyArrow Columnar Aggregation          |                  |  - Balanced Logistic Regression             |
|  - Snappy Partitioned Parquet Storage    |                  |  - Cost-Sensitive XGBoost (Champion)        |
|  - PySpark 3.5 Local-Mode Compatibility  |                  |  - Spatial K-Means Hotspot Clusterer        |
+--------------------+---------------------+                  +-----------------------+---------------------+
                     |                                                                |
                     +----------------------+                   +---------------------+
                                            |                   |
                                            v                   v
                                  +---------+-------------------+---------+
                                  |          Data Storage Layer           |
                                  |  - NCRB Official (2018-2022)          |
                                  |  - Synthetic Spatio-Temporal Parquet  |
                                  |  - Serialized joblib Model Artifacts  |
                                  |  - SQLite / PostgreSQL Database       |
                                  +---------------------------------------+
```

## 2. Entity Relationship (ER) Data Model

```
+--------------------+          +-----------------------+
|      datasets      |          |  geographic_units     |
+--------------------+          +-----------------------+
| id (PK)            |          | id (PK)               |
| name               |          | city                  |
| publisher          |          | district              |
| quality_status     |          | name                  |
| is_synthetic       |          | latitude              |
| total_records      |          | longitude             |
+--------------------+          | commercial_density    |
                                | cluster_id            |
+--------------------+          | cluster_label         |
| pipeline_execution |          | total_incidents       |
+--------------------+          +-----------------------+
| run_id (PK)        |
| timestamp          |          +-----------------------+
| input_file         |          |  planning_scenarios   |
| data_quality_score |          +-----------------------+
| raw_records        |          | scenario_id (PK)      |
| duration_seconds   |          | scenario_name         |
| benchmark_json     |          | city                  |
+--------------------+          | allocated_units       |
                                | strategy              |
                                | simulated_coverage    |
                                +-----------------------+
```

## 3. Data Dictionary

| Field | Type | Description |
|---|---|---|
| `incident_id` | String | Unique tracking identifier (prefixed by provenance) |
| `timestamp` | Timestamp | ISO-8601 recording timestamp ($YYYY-MM-DD\ HH:MM:SS$) |
| `police_station` | String | Sub-district police station jurisdiction name |
| `city` | String | Primary urban agglomeration (Mumbai, Pune, Nagpur) |
| `latitude` / `longitude` | Float | Verified coordinates constrained to Maharashtra bounding box |
| `crime_category` | String | Standardized IPC/SLL classification |
| `rolling_7d_past_count` | Float | Strictly past 7-day incident count ($t-1$ to $t-7$) |
| `rolling_30d_past_count` | Float | Strictly past 30-day incident count ($t-1$ to $t-30$) |
| `station_baseline_rate` | Float | Expanding mean of daily incident volume prior to day $t$ |
| `commercial_density` | Float | Normalized index of market and transit footfall (0.0 – 1.0) |
| `transit_proximity_km` | Float | Radial distance to nearest commuter rail or metro station |
| `is_high_risk_day` | Integer | Binary classification target ($\ge 2$ daily incidents) |
| `is_synthetic` | Boolean | True for benchmark demonstration, False for official NCRB |
