# CityFlow AI - System Architecture & Digital-Twin Specifications

## 1. System Overview
CityFlow AI is an intelligent urban digital-twin platform developed for Smart India Hackathon 2026 under the theme **Transportation & Logistics**. It addresses severe urban logistics congestion, carbon emissions, and loading zone sclerosis through predictive ML forecasting, multi-objective Pareto routing, dynamic slot allocation, and emergency green corridors.

```
+-----------------------------------------------------------------------------------+
|                           REACT + TYPESCRIPT COMMAND CENTER UI                   |
|  - Real-time GIS Digital Twin Map (Leaflet)     - 15/30/60m AI Forecast Curves     |
|  - Pareto Multi-Objective Route Comparer        - Dynamic Slot Allocation Visualizer|
|  - What-If Scenario Sandbox                     - Emergency Green Corridor HUD     |
|  - Infrastructure Recommendation Matrix         - 1-Click Interactive Demo Mode    |
+-----------------------------------------------------------------------------------+
                                         │  REST APIs / JSON Telemetry
                                         ▼
+-----------------------------------------------------------------------------------+
|                                FASTAPI BACKEND GATEWAY                             |
+-----------------------------------------------------------------------------------+
   │                        │                         │                        │
   ▼                        ▼                         ▼                        ▼
+--------------+   +-------------------+   +--------------------+   +-------------------+
|  ML ENGINE   |   |   OPTIMIZATION    |   | DIGITAL-TWIN GRAPH |   | INFRASTRUCTURE &  |
| - RandomForest|   | - Pareto Cost     |   | - 10 Urban Sectors |   |   EMERGENCY       |
|   15/30/60m  |   |   Graph Engine    |   | - 14 Arterial Rds  |   | - Capex/ROI Engine|
| - Explainable|   | - Dynamic Time    |   | - 13 Freight Bays  |   | - Green Wave Pre- |
|   Attribution|   |   Slot Allocator  |   | - 480 Fleet Nodes  |   |   emption Corridors|
+--------------+   +-------------------+   +--------------------+   +-------------------+
```

---

## 2. Core Mathematical & Algorithmic Formulations

### A. City Pressure Index Formulation ($CPI \in [0, 100]$)
For each urban sector $z$, the City Pressure Index is computed using a 7-factor weighted formula:

$$CPI(z) = w_1 \cdot U_{\text{road}} + w_2 \cdot D_{\text{traffic}} + w_3 \cdot \left(\frac{L_{\text{demand}}}{100}\right) + w_4 \cdot P_{\text{parking}} + w_5 \cdot \left(1 - \frac{v_{\text{avg}}}{v_{\text{free}}}\right) + w_6 \cdot I_{\text{incident}} + w_7 \cdot E_{\text{env}}$$

Where default weights are:
- $w_1 = 25.0$ (Road network utilization)
- $w_2 = 20.0$ (Spatial traffic density)
- $w_3 = 20.0$ (Normalized commercial freight demand)
- $w_4 = 15.0$ (Loading bay & curb saturation)
- $w_5 = 10.0$ (Travel speed deficit)
- $w_6 = 6.0$ (Active incident penalty)
- $w_7 = 4.0$ (Environmental pollution index)

**Classification Thresholds:**
- $0 \le CPI \le 30$: **Low** (Free flow)
- $31 \le CPI \le 60$: **Moderate** (Stable distribution)
- $61 \le CPI \le 80$: **High** (Staggering required)
- $81 \le CPI \le 100$: **Critical** (Emergency intervention & routing curfew)

---

### B. Multi-Objective Pareto Routing Cost Function
Unlike traditional navigation that minimizes only distance ($D$), CityFlow AI evaluates a multi-criteria cost function across edge $e$:

$$C_{\text{edge}}(e, \text{mode}) = \alpha_{\text{mode}} \cdot T(e) + \beta_{\text{mode}} \cdot D(e) + \gamma_{\text{mode}} \cdot \Omega(e) \cdot \kappa_{\text{fuel}} + \delta_{\text{mode}} \cdot \text{Toll}(e)$$

Where:
- $T(e) = \frac{\text{Length}(e)}{v_{\text{current}}(e)}$ is the dynamic transit duration.
- $\Omega(e) = 1.0 + (\text{Congestion}(e) \cdot 0.8)$ is the congestion stop-and-go penalty.
- $\kappa_{\text{fuel}}$ is the vehicle propulsion carbon intensity ($g\text{CO}_2/\text{km}$).

**Mode Weighting Profiles:**
1. **FASTEST**: Minimizes $T(e)$ prioritizing grade-separated expressways.
2. **GREENEST**: Minimizes stop-and-go idling emissions $\Omega(e)$ and carbon mass $E(e)$.
3. **CHEAPEST**: Minimizes fuel burn and avoids toll arterials.
4. **BALANCED**: Pareto-optimal compromise with minimal time penalty (+3.2 mins) and significant emission savings (-19% $\text{CO}_2$).
