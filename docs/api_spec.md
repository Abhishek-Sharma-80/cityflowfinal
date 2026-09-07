# CityFlow AI - REST API Specifications

The backend provides high-performance REST endpoints documented via OpenAPI / Swagger at `http://localhost:8000/docs`.

## Key Endpoints

### 1. Dashboard & KPIs
- `GET /api/dashboard/kpis`
  - Returns real-time macro City Pressure Index, active vehicle count, congested zones, and today's CO2 savings.
- `GET /api/dashboard/trends`
  - Returns 24-hour time-series trends for traffic, logistics parcel orders, and CO2 abatement.

### 2. Digital Twin Spatial Network
- `GET /api/zones`
  - Returns the 10 urban sectors with boundaries, live pressure scores, and utilization.
- `GET /api/zones/roads`
  - Returns all interconnected road segments with real-time volume, speed, and congestion levels.
- `GET /api/zones/incidents`
  - Returns active incidents (closures, accidents, waterlogging, events).

### 3. Fleet & Deliveries
- `GET /api/fleet/vehicles`
  - Lists commercial fleet vehicles with driver names, battery/fuel %, coordinates, and status.
- `GET /api/fleet/deliveries`
  - Lists active parcel and freight requests with tracking codes and priority levels.

### 4. AI Congestion Predictions
- `GET /api/predictions/congestion`
  - Returns 15m, 30m, and 60m RandomForest predictions with confidence intervals and XAI feature attributions.

### 5. Multi-Objective Routing
- `GET /api/routes/optimize?origin={Z-04}&destination={Z-01}&vehicle_type={ELECTRIC_VAN}&cargo_weight_kg={350}`
  - Returns Pareto candidate paths for `FASTEST`, `GREENEST`, `CHEAPEST`, and `BALANCED` with explainability.

### 6. Dynamic Slot Allocation
- `GET /api/slots/optimize`
  - Runs constraint solver and returns Original vs Optimized schedule and dwell reduction metrics.

### 7. What-If City Simulator
- `POST /api/simulator/run`
  - Simulates road closures, demand surges (+25%), and festival crowd shockwaves with calculated percentage changes.

### 8. Emergency Green Corridor
- `POST /api/emergency/activate`
  - Locks emergency arterial corridor, activates green wave preemption, and diverts logistics fleet.
- `POST /api/emergency/deactivate`
  - Restores normal signal timings.

### 9. Infrastructure Recommendations
- `GET /api/recommendations`
  - Returns Capex/ROI-ranked infrastructure interventions (bays, EV chargers, micro-hubs).

### 10. One-Click Demo
- `POST /api/demo/run-surge`
  - Executes the complete automated "Evening Peak Logistics Surge" simulation pipeline.
