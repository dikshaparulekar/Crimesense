"""
CrimeSense Database Layer
SQLAlchemy ORM models & database initialization.
Supports SQLite out of the box for lightweight zero-dependency local runs,
and PostgreSQL / PostGIS when configured via environment variable DATABASE_URL.
"""

import os
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crimesense.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DatasetModel(Base):
    __tablename__ = "datasets"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    publisher = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    geographic_coverage = Column(String, nullable=False)
    time_period = Column(String, nullable=False)
    granularity = Column(String, nullable=False)
    license = Column(String, nullable=False)
    quality_status = Column(String, nullable=False)
    is_synthetic = Column(Boolean, default=False)
    citation = Column(Text, nullable=True)
    limitations = Column(Text, nullable=True)
    total_records = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class PipelineExecutionModel(Base):
    __tablename__ = "pipeline_executions"
    
    run_id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    input_file = Column(String, nullable=False)
    validation_status = Column(String, nullable=False)
    data_quality_score = Column(Float, default=95.0)
    raw_records = Column(Integer, default=0)
    duration_seconds = Column(Float, default=0.0)
    features_json = Column(JSON, nullable=True)
    benchmark_json = Column(JSON, nullable=True)
    is_synthetic = Column(Boolean, default=True)

class GeographicUnitModel(Base):
    __tablename__ = "geographic_units"
    
    id = Column(String, primary_key=True, index=True)
    city = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False)
    name = Column(String, nullable=False)
    unit_type = Column(String, default="POLICE_STATION") # "STATE", "METRO_DISTRICT", "POLICE_STATION"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    commercial_density = Column(Float, default=0.5)
    cluster_id = Column(Integer, default=0)
    cluster_label = Column(String, nullable=True)
    total_incidents = Column(Integer, default=0)
    is_synthetic = Column(Boolean, default=True)

class PlanningScenarioModel(Base):
    __tablename__ = "planning_scenarios"
    
    scenario_id = Column(String, primary_key=True, index=True)
    scenario_name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    allocated_units = Column(Integer, default=20)
    strategy = Column(String, default="HOTSPOT_PROPORTIONAL") # "EQUAL_PATROL", "HOTSPOT_PROPORTIONAL", "NIGHT_SHIELD"
    simulated_coverage_pct = Column(Float, default=75.0)
    scenario_notes = Column(Text, nullable=True)
    parameters_json = Column(JSON, nullable=True)

def init_db():
    Base.metadata.create_all(bind=engine)
    print("[Database] Schema initialized successfully.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
