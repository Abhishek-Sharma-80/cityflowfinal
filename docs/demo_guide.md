# CityFlow AI - Hackathon Demo & Walkthrough Guide

## 1. Fast Demonstration Flow for SIH 2026 Jury

### Step 1: Open the Command Center
- Open `http://localhost:5173` in your browser.
- Point out the **Live City Digital-Twin GIS Map**, the **City Pressure Index (68.4/100)**, and the **AI Prediction Feed**.

### Step 2: One-Click Demo Mode ("Evening Peak Logistics Surge")
- Click the top right **"1-Click Demo"** button.
- Click **"Run 1-Click Demo"**.
- Watch the 5-step animation execute:
  1. Ingests 500 active vehicles & +25% e-commerce demand surge.
  2. Runs RandomForest ML forecasting for 15m/30m/60m.
  3. Reallocates 43 freight delivery slots away from peak dock hours.
  4. Computes Pareto bypass corridors avoiding blocked road R-06.
  5. Shows dynamic simulated results:
     - **Travel Time: -18.1%**
     - **Congestion Index: -24.1%**
     - **Fuel Burn: -12.0%**
     - **CO2 Emissions: -15.0%**
     - **Delivery Delay: -31.1%**

### Step 3: Explore Key Modules
1. **Route Optimization (`/routes`)**: Select Origin `Z-04` and Destination `Z-01`. Compare **FASTEST** vs **GREENEST** vs **BALANCED** and read the natural language AI tradeoff reasoning.
2. **Delivery Slots (`/slots`)**: Inspect the bar chart showing how peak hours are smoothed out and dock dwell is cut by 18.4 mins.
3. **Smart Loading Zones (`/loading-zones`)**: Use the walking distance calculator to show conflict-free dock booking and walking radius to store.
4. **What-If Simulator (`/simulator`)**: Toggle road closures and festival surges, slide the logistics demand slider to +50%, and run the shockwave simulation.
5. **Emergency Mode (`/emergency`)**: Click **"Lock Emergency Corridor"** and view the green wave preemption path and the 14 diverted freight trucks.
