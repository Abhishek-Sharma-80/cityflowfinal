from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Enum as SQLEnum, JSON, Text
from datetime import datetime
import enum
from backend.app.core.database import Base

class PressureClassEnum(str, enum.Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    CRITICAL = "Critical"

class VehicleTypeEnum(str, enum.Enum):
    ELECTRIC_VAN = "ELECTRIC_VAN"
    DIESEL_LCV = "DIESEL_LCV"
    CNG_TRUCK = "CNG_TRUCK"
    CARGO_EV_2W = "CARGO_EV_2W"
    HEAVY_FREIGHT = "HEAVY_FREIGHT"

class VehicleStatusEnum(str, enum.Enum):
    IN_TRANSIT = "IN_TRANSIT"
    LOADING = "LOADING"
    UNLOADING = "UNLOADING"
    IDLE = "IDLE"
    REROUTED_EMERGENCY = "REROUTED_EMERGENCY"

class ModelStatusEnum(str, enum.Enum):
    TRAINING = "TRAINING"
    VALIDATED = "VALIDATED"
    ACTIVE = "ACTIVE"
    REJECTED = "REJECTED"
    ARCHIVED = "ARCHIVED"

class DataSourceEntity(Base):
    __tablename__ = "data_sources"
    id = Column(String(32), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    source_type = Column(String(64), nullable=False) # CSV, JSON, REST_API, GPS_FEED, SENSOR_FEED
    connection_config = Column(JSON, nullable=True)
    status = Column(String(32), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

class DatasetEntity(Base):
    __tablename__ = "datasets"
    id = Column(String(64), primary_key=True, index=True)
    source_id = Column(String(32), nullable=True)
    filename = Column(String(256), nullable=False)
    row_count = Column(Integer, nullable=False, default=0)
    valid_rows = Column(Integer, nullable=False, default=0)
    invalid_rows = Column(Integer, nullable=False, default=0)
    quality_score_pct = Column(Float, nullable=False, default=0.0)
    time_range_start = Column(DateTime, nullable=True)
    time_range_end = Column(DateTime, nullable=True)
    features = Column(JSON, nullable=True)
    schema_info = Column(JSON, nullable=True)
    status = Column(String(32), default="VALID") # VALID, DEGRADED, REJECTED
    storage_path = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TrafficObservationEntity(Base):
    __tablename__ = "traffic_observations"
    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(String(64), nullable=True, index=True)
    road_segment_id = Column(String(32), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    volume_vph = Column(Float, nullable=False)
    current_speed_kmh = Column(Float, nullable=False)
    free_flow_speed_kmh = Column(Float, nullable=True)
    congestion_level = Column(Float, nullable=False)
    occupancy_pct = Column(Float, nullable=True)
    incident_active = Column(Boolean, default=False)
    incident_severity = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class ModelRegistryEntity(Base):
    __tablename__ = "model_registry"
    id = Column(String(64), primary_key=True, index=True) # e.g. traffic_model_v001
    version = Column(String(32), nullable=False, unique=True)
    model_type = Column(String(64), nullable=False) # RandomForest, GradientBoosting, HistGradientBoosting
    dataset_id = Column(String(64), nullable=True)
    target_variable = Column(String(64), nullable=False, default="future_congestion")
    horizons_supported = Column(JSON, nullable=False) # ["15m", "30m", "60m"]
    features = Column(JSON, nullable=False)
    training_samples = Column(Integer, nullable=False)
    validation_samples = Column(Integer, nullable=False)
    test_samples = Column(Integer, nullable=False)
    test_mae = Column(Float, nullable=False)
    test_rmse = Column(Float, nullable=False)
    test_r2 = Column(Float, nullable=False)
    candidate_metrics = Column(JSON, nullable=True)
    artifact_path = Column(String(512), nullable=False)
    status = Column(SQLEnum(ModelStatusEnum), default=ModelStatusEnum.VALIDATED)
    prediction_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class PredictionRecordEntity(Base):
    __tablename__ = "prediction_records"
    id = Column(Integer, primary_key=True, autoincrement=True)
    model_version = Column(String(32), nullable=False, index=True)
    road_segment_id = Column(String(32), nullable=False, index=True)
    horizon_minutes = Column(Integer, nullable=False) # 15, 30, 60
    predicted_congestion = Column(Float, nullable=False)
    predicted_speed_kmh = Column(Float, nullable=True)
    observed_actual = Column(Float, nullable=True) # filled later during verification
    absolute_error = Column(Float, nullable=True)
    explanations = Column(JSON, nullable=True)
    data_type = Column(String(32), default="PREDICTED") # OBSERVED, PREDICTED, SIMULATED
    generated_at = Column(DateTime, default=datetime.utcnow, index=True)

class ZoneEntity(Base):
    __tablename__ = "zones"
    id = Column(String(32), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    category = Column(String(64), nullable=False)
    center = Column(JSON, nullable=False)  # [lat, lng]
    polygon = Column(JSON, nullable=False)  # GeoJSON coordinate rings
    road_utilization = Column(Float, nullable=False, default=0.0)
    traffic_density = Column(Float, nullable=False, default=0.0)
    logistics_demand = Column(Float, nullable=False, default=0.0)
    parking_pressure = Column(Float, nullable=False, default=0.0)
    avg_speed_kmh = Column(Float, nullable=False, default=30.0)
    free_flow_speed_kmh = Column(Float, nullable=False, default=50.0)
    incident_count = Column(Integer, nullable=False, default=0)
    environmental_index = Column(Float, nullable=False, default=70.0)
    pressure_score = Column(Float, nullable=False, default=50.0)
    pressure_class = Column(SQLEnum(PressureClassEnum), nullable=False, default=PressureClassEnum.MODERATE)
    active_deliveries = Column(Integer, nullable=False, default=0)
    active_vehicles = Column(Integer, nullable=False, default=0)
    loading_bay_capacity = Column(Integer, nullable=False, default=20)
    loading_bay_occupied = Column(Integer, nullable=False, default=0)
    peak_hours = Column(String(64), nullable=False, default="17:00 - 20:00")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RoadSegmentEntity(Base):
    __tablename__ = "road_segments"
    id = Column(String(32), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    from_zone_id = Column(String(32), nullable=False, index=True)
    to_zone_id = Column(String(32), nullable=False, index=True)
    coordinates = Column(JSON, nullable=False)  # [[lat, lng], ...]
    length_km = Column(Float, nullable=False)
    free_flow_speed_kmh = Column(Float, nullable=False)
    current_speed_kmh = Column(Float, nullable=False)
    capacity_vph = Column(Integer, nullable=False)
    current_volume_vph = Column(Integer, nullable=False)
    congestion_level = Column(Float, nullable=False, default=0.0)
    status = Column(String(32), nullable=False, default="NORMAL")
    lane_count = Column(Integer, nullable=False, default=2)
    emissions_factor = Column(Float, nullable=False, default=1.0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VehicleEntity(Base):
    __tablename__ = "vehicles"
    id = Column(String(32), primary_key=True, index=True)
    plate_number = Column(String(32), unique=True, nullable=False)
    vehicle_type = Column(SQLEnum(VehicleTypeEnum), nullable=False)
    status = Column(SQLEnum(VehicleStatusEnum), nullable=False, default=VehicleStatusEnum.IDLE)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    current_speed_kmh = Column(Float, nullable=False, default=0.0)
    fuel_or_battery_pct = Column(Float, nullable=False, default=100.0)
    assigned_orders_count = Column(Integer, nullable=False, default=0)
    current_zone_id = Column(String(32), nullable=False, index=True)
    destination_zone_id = Column(String(32), nullable=True)
    driver_name = Column(String(128), nullable=False)
    max_payload_kg = Column(Float, nullable=False)
    current_payload_kg = Column(Float, nullable=False, default=0.0)
    co2_emission_rate_g_km = Column(Float, nullable=False, default=0.0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LoadingZoneEntity(Base):
    __tablename__ = "loading_zones"
    id = Column(String(32), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    zone_id = Column(String(32), nullable=False, index=True)
    zone_name = Column(String(128), nullable=False)
    location = Column(JSON, nullable=False)  # [lat, lng]
    total_bays = Column(Integer, nullable=False)
    occupied_bays = Column(Integer, nullable=False, default=0)
    reserved_bays = Column(Integer, nullable=False, default=0)
    available_bays = Column(Integer, nullable=False)
    queue_count = Column(Integer, nullable=False, default=0)
    avg_dwell_time_mins = Column(Float, nullable=False, default=15.0)
    ev_charging_available = Column(Boolean, nullable=False, default=False)
    current_utilization_pct = Column(Float, nullable=False, default=0.0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class IncidentEntity(Base):
    __tablename__ = "incidents"
    id = Column(String(32), primary_key=True, index=True)
    type = Column(String(64), nullable=False)
    zone_id = Column(String(32), nullable=False, index=True)
    location = Column(JSON, nullable=False)  # [lat, lng]
    severity = Column(String(32), nullable=False)
    title = Column(String(256), nullable=False)
    description = Column(String(512), nullable=False)
    reported_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    estimated_clearance_time = Column(String(64), nullable=False)
    affected_road_ids = Column(JSON, nullable=False)
    active = Column(Boolean, nullable=False, default=True)
