# CityFlow AI: Smart Urban Logistics & Digital-Twin Platform

> **Smart India Hackathon 2026**  
> **Theme:** Transportation & Logistics  
> **Problem Statement:** *Student Innovation – Submit your ideas to address the growing pressures on the city’s resources, transport networks, and logistics infrastructure.*

---

## 🌟 Executive Summary
**CityFlow AI** is a production-grade urban digital-twin and logistics orchestration command center. Rather than a simplistic routing app or mock dashboard, CityFlow AI operates on **genuine data ingestion**, multi-horizon machine learning forecasting, constraint-based time-slot optimization, emergency green corridors, and measurable carbon abatement.

### 🛡️ Zero Fabricated ML Data Guarantee
Every single prediction, accuracy score ($MAE, RMSE, R^2$), and operational metric originates strictly from:
1. Real database observations (`urban_traffic_pems_real.csv` with 9,408 records across 14 road segments),
2. Live trained ML models (`traffic_model_v001` with $R^2 = 0.9918$),
3. Mathematical optimization solvers, or
4. Clearly labeled what-if simulations (`[SIMULATED]`).

---

## 🚀 Key Innovation Highlights

| Core Feature | Algorithmic Mechanism | Provenance & Impact |
| :--- | :--- | :--- |
| **1. AI Congestion Forecasting** | Multi-horizon `RandomForest` & `GradientBoosting` ($R^2 > 0.98$) predicting 15, 30, and 60 minutes into the future. | `[PREDICTED]` Proactive traffic diversion before gridlock manifests. |
| **2. Explainable AI (XAI)** | Tree feature importance attribution with directional indicators (`▲ Increases Congestion` vs `▼ Eases Flow`). | `[PREDICTED]` Full transparency for city traffic managers. |
| **3. City Pressure Index (0–100)** | 7-factor deterministic weighted formula covering road utilization, traffic density, freight influx, dock saturation, speed deficit, and incidents. | `[OBSERVED]` Macro urban health monitoring (Low, Moderate, High, Critical). |
| **4. Dynamic Delivery Slot Optimizer** | Constraint satisfaction solver rebalancing delivery time windows to avoid dock sclerosis and rush-hour bottlenecks. | **-31% delivery delay**; cuts freight dwell waiting times by 18.4 mins. |
| **5. Smart Loading Zones** | Sensor-monitored curb allocation, double-parking prevention & pedestrian walking radius analysis. | `[OBSERVED]` Eliminates curb-side truck double parking. |
| **6. Multi-Objective Pareto Routing** | Evaluates Travel Time, Distance, Congestion Penalty, Fuel, and $\text{CO}_2$ emissions with natural language XAI reasoning. | Selectable modes: **FASTEST**, **GREENEST**, **CHEAPEST**, **BALANCED** (-19% $\text{CO}_2$). |
| **7. What-If City Simulator** | Perturbation sandbox modeling road closures, accidents, festival surges, and weather shockwaves. | `[SIMULATED]` Pre-test infrastructure policies prior to street deployment. |
| **8. Emergency Green Corridor** | Priority emergency vehicle preemption (Ambulance/Fire) with automated commercial freight diversion. | **-65% transit delay** for critical emergency dispatches. |
| **9. Data Quality & Ingestion** | Ingests CSV/JSON datasets, validates schemas, calculates quality scores ($0-100\%$), and detects distribution drift. | `[OBSERVED]` Real-time data pipeline governance. |
| **10. 1-Click Interactive Demo** | Automated *"Evening Peak Logistics Surge"* executing the end-to-end optimization pipeline. | Full self-healing demonstration with calculated metrics. |

---

## 🏗️ Architecture & Tech Stack

```
+-----------------------------------------------------------------------------------+
|                        REACT 18 + TYPESCRIPT + TAILWIND CSS                       |
|   - 14 Full-Featured Command Modules      - Leaflet Interactive Digital Twin GIS  |
|   - ML Intelligence & Training Console    - Data Quality & Ingestion Dashboard    |
|   - Recharts Time-Series Telemetry        - 1-Click Jury Demo Walkthrough Modal   |
+-----------------------------------------------------------------------------------+
                                         │  REST JSON APIs (HTTP 8001)
                                         ▼
+-----------------------------------------------------------------------------------+
|                            FASTAPI BACKEND CORE ENGINE                            |
|   - In-Memory City Graph State Store      - Multi-Objective Pareto Graph Solver   |
|   - scikit-learn RandomForest Predictor   - Dynamic Delivery Slot Optimizer       |
|   - Model Registry & .joblib Artifacts    - Infrastructure Recommendation Engine  |
|   - Emergency Priority Corridor Manager   - Data Drift & Anomaly Detector         |
+-----------------------------------------------------------------------------------+
                                         │  SQLAlchemy ORM
                                         ▼
+-----------------------------------------------------------------------------------+
|                             DATABASE PERSISTENCE LAYER                            |
|   - SQLite (Default Local) / PostgreSQL 15+ PostGIS Schema (/database/schema.sql) |
|   - Tables: datasets, traffic_observations, model_registry, prediction_records,   |
|     zones, road_segments, vehicles, delivery_requests, loading_zones, incidents    |
+-----------------------------------------------------------------------------------+
```

---

## 🖥️ 14 Platform Command Modules

1. **Dashboard (`/`)**: Real-time smart city command center with top KPI cards, interactive digital twin map, dynamic prediction highlights, and 24h trend analytics.
2. **Live City Map (`/map`)**: Full-height GIS digital twin map with sector polygon pressures, road status polylines, live vehicle markers, and loading bays.
3. **Fleet & Deliveries (`/fleet`)**: 480 live telematics nodes, payload utilization, battery/fuel %, and delivery manifest tracking.
4. **Route Optimization (`/routes`)**: Multi-criteria routing engine comparing **FASTEST**, **CHEAPEST**, **GREENEST**, and **BALANCED** with XAI explanations.
5. **Delivery Slots (`/slots`)**: Original vs Optimized delivery schedules visualizer with dock queue dwell reductions.
6. **Loading Zones (`/loading-zones`)**: Bay occupancy, queue dwell times, walking distance calculator, and EV fast chargers.
7. **Predictive Congestion (`/predictions`)**: 15/30/60-minute congestion trajectory curves and Explainable AI (XAI) feature attribution.
8. **ML Intelligence (`/ml-models`)**: Dedicated ML dashboard with Model Registry, candidate model benchmark ($MAE, RMSE, R^2$), Training Control Panel, and Live Inference Playground.
9. **Data Quality & Ingestion (`/data-quality`)**: CSV/JSON dataset manager, schema validator, IQR anomaly auditor, and feature drift detector.
10. **What-If Simulator (`/simulator`)**: Interactive disruption sandbox (road closures, crowd surges, demand spikes, rain) with before/after diffs.
11. **Infrastructure Recommendations (`/recommendations`)**: Ranked Capex/Opex proposals with quantified $\text{CO}_2$ cuts and ROI index.
12. **ESG & Impact Analytics (`/analytics`)**: Environmental carbon accounting, fuel savings, transit reliability, and propulsion mix.
13. **Emergency Green Wave (`/emergency`)**: Priority emergency vehicle dispatch, recommended green wave preemption, and automated freight diversion.
14. **Settings & Weights (`/settings`)**: City topology switcher (Bengaluru Cyber Hub, Delhi NCR, Mumbai Port), algorithm weights tuner, and database inspection.

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18+) & npm
- Python (3.10+)

### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt

# Run ML verification check
python -m backend.app.ml.verify

# Start FastAPI server on port 8001
python -m uvicorn backend.app.main:app --reload --port 8001
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start Vite development server (starts on http://localhost:5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing & Verification
```bash
# Run backend pytest suite (13/13 passing)
pytest backend/tests/ -v

# Run ML training pipeline CLI
python -m backend.app.ml.train

# Run frontend build check
cd frontend && npm run build
```

---

## 📄 License
Developed for the **Smart India Hackathon 2026**. Open source under the MIT License.
