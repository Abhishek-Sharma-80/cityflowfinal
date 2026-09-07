-- CityFlow AI Database Schema
-- Compatible with PostgreSQL 15+ and PostGIS

CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    polygon_geojson JSONB NOT NULL,
    road_utilization FLOAT NOT NULL DEFAULT 0.5,
    traffic_density FLOAT NOT NULL DEFAULT 0.5,
    logistics_demand FLOAT NOT NULL DEFAULT 50.0,
    parking_pressure FLOAT NOT NULL DEFAULT 0.5,
    avg_speed_kmh FLOAT NOT NULL DEFAULT 30.0,
    free_flow_speed_kmh FLOAT NOT NULL DEFAULT 50.0,
    incident_count INT NOT NULL DEFAULT 0,
    environmental_index FLOAT NOT NULL DEFAULT 50.0,
    pressure_score FLOAT NOT NULL DEFAULT 50.0,
    pressure_class VARCHAR(16) NOT NULL DEFAULT 'Moderate',
    loading_bay_capacity INT NOT NULL DEFAULT 20,
    loading_bay_occupied INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS road_segments (
    id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    from_zone_id VARCHAR(16) REFERENCES zones(id),
    to_zone_id VARCHAR(16) REFERENCES zones(id),
    coordinates_geojson JSONB NOT NULL,
    length_km FLOAT NOT NULL,
    free_flow_speed_kmh FLOAT NOT NULL,
    current_speed_kmh FLOAT NOT NULL,
    capacity_vph INT NOT NULL,
    current_volume_vph INT NOT NULL,
    congestion_level FLOAT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'NORMAL',
    lane_count INT NOT NULL DEFAULT 2,
    emissions_factor FLOAT NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(16) PRIMARY KEY,
    plate_number VARCHAR(32) UNIQUE NOT NULL,
    vehicle_type VARCHAR(32) NOT NULL,
    driver_name VARCHAR(128) NOT NULL,
    fuel_or_battery_pct FLOAT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    heading FLOAT DEFAULT 0.0,
    current_speed_kmh FLOAT NOT NULL,
    status VARCHAR(32) NOT NULL,
    current_zone_id VARCHAR(16) REFERENCES zones(id),
    destination_zone_id VARCHAR(16) REFERENCES zones(id),
    max_payload_kg FLOAT NOT NULL,
    current_payload_kg FLOAT NOT NULL,
    co2_emission_rate_g_km FLOAT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loading_zones (
    id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    zone_id VARCHAR(16) REFERENCES zones(id),
    location_lat DOUBLE PRECISION NOT NULL,
    location_lng DOUBLE PRECISION NOT NULL,
    total_bays INT NOT NULL,
    occupied_bays INT NOT NULL,
    reserved_bays INT NOT NULL,
    available_bays INT NOT NULL,
    queue_count INT NOT NULL DEFAULT 0,
    avg_dwell_time_mins INT NOT NULL DEFAULT 25,
    ev_charging_available BOOLEAN NOT NULL DEFAULT TRUE,
    max_vehicle_height_m FLOAT NOT NULL DEFAULT 3.8,
    walking_radius_m INT NOT NULL DEFAULT 350
);

CREATE TABLE IF NOT EXISTS delivery_requests (
    id VARCHAR(32) PRIMARY KEY,
    tracking_code VARCHAR(32) UNIQUE NOT NULL,
    customer_name VARCHAR(128) NOT NULL,
    origin_zone_id VARCHAR(16) REFERENCES zones(id),
    destination_zone_id VARCHAR(16) REFERENCES zones(id),
    dest_lat DOUBLE PRECISION NOT NULL,
    dest_lng DOUBLE PRECISION NOT NULL,
    package_weight_kg FLOAT NOT NULL,
    priority VARCHAR(32) NOT NULL,
    preferred_window_start VARCHAR(16) NOT NULL,
    preferred_window_end VARCHAR(16) NOT NULL,
    assigned_slot_start VARCHAR(16),
    assigned_slot_end VARCHAR(16),
    assigned_vehicle_id VARCHAR(16) REFERENCES vehicles(id),
    assigned_loading_zone_id VARCHAR(16) REFERENCES loading_zones(id),
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING'
);
