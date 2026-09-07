import copy
from typing import List, Dict, Any
from backend.app.models.schemas import (
    WhatIfScenarioInput, SimulationResultModel, SimulationMetricDiff,
    ZoneModel, RoadSegmentModel
)
from backend.app.core.city_twin import city_twin

class WhatIfSimulatorEngine:
    """
    City-Scale What-If Perturbation & Impact Simulation Engine.
    Simulates traffic shockwaves, demand surges, disruptions, and intervention policies.
    """
    def __init__(self):
        pass

    def run_scenario(self, scenario: WhatIfScenarioInput) -> SimulationResultModel:
        # Snapshot current baseline state
        before_pressure_map: Dict[str, float] = {z.id: z.pressure_score for z in city_twin.zones.values()}
        baseline_avg_speed = sum(z.avg_speed_kmh for z in city_twin.zones.values()) / max(1, len(city_twin.zones))
        baseline_avg_cong = sum(r.congestion_level for r in city_twin.roads.values()) / max(1, len(city_twin.roads))

        # Clone state for simulation run
        sim_zones = copy.deepcopy(city_twin.zones)
        sim_roads = copy.deepcopy(city_twin.roads)

        affected_zones: set = set()
        critical_bottlenecks: List[str] = []
        recommended_actions: List[str] = []

        # 1. Apply Road Closures
        for r_id in scenario.road_closures:
            if r_id in sim_roads:
                r = sim_roads[r_id]
                r.status = "BLOCKED"
                r.congestion_level = 1.0
                r.current_speed_kmh = 0.0
                affected_zones.add(r.from_zone_id)
                affected_zones.add(r.to_zone_id)
                critical_bottlenecks.append(f"{r.name} (Complete Blockage)")

        # 2. Apply Accidents
        for z_id in scenario.accident_zones:
            if z_id in sim_zones:
                z = sim_zones[z_id]
                z.incident_count += 1
                z.road_utilization = min(0.98, z.road_utilization + 0.22)
                z.traffic_density = min(0.99, z.traffic_density + 0.25)
                z.avg_speed_kmh = max(6.0, z.avg_speed_kmh * 0.55)
                affected_zones.add(z_id)
                critical_bottlenecks.append(f"{z.name} (Accident Congestion Spillover)")

        # 3. Apply Festival / Public Events
        for z_id in scenario.festival_zones:
            if z_id in sim_zones:
                z = sim_zones[z_id]
                z.traffic_density = min(0.98, z.traffic_density + 0.30)
                z.logistics_demand = min(100.0, z.logistics_demand + 35.0)
                z.parking_pressure = min(1.0, z.parking_pressure + 0.30)
                z.avg_speed_kmh = max(8.0, z.avg_speed_kmh * 0.65)
                affected_zones.add(z_id)

        # 4. Apply Demand & Traffic Multipliers
        demand_mult = scenario.demand_multiplier
        traffic_mult = scenario.traffic_multiplier

        for z in sim_zones.values():
            if demand_mult != 1.0:
                z.logistics_demand = min(100.0, z.logistics_demand * demand_mult)
                z.parking_pressure = min(0.99, z.parking_pressure * (1.0 + (demand_mult - 1.0) * 0.4))
            if traffic_mult != 1.0:
                z.traffic_density = min(0.99, z.traffic_density * traffic_mult)
                z.road_utilization = min(0.99, z.road_utilization * traffic_mult)
                z.avg_speed_kmh = max(5.0, z.avg_speed_kmh / traffic_mult)

        # 5. Apply New Loading Zones (Mitigation)
        for z_id in scenario.add_loading_zones:
            if z_id in sim_zones:
                z = sim_zones[z_id]
                z.parking_pressure = max(0.2, z.parking_pressure - 0.25)
                z.loading_bay_capacity += 10
                recommended_actions.append(f"Deploy 10 temporary modular freight bays in {z.name} to alleviate loading queue.")

        # Recompute simulated pressure scores
        after_pressure_map: Dict[str, float] = {}
        for z_id, z in sim_zones.items():
            new_score = city_twin.calculate_pressure_score(
                road_util=z.road_utilization,
                traffic_density=z.traffic_density,
                logistics_demand=z.logistics_demand,
                parking_pressure=z.parking_pressure,
                avg_speed=z.avg_speed_kmh,
                free_speed=z.free_flow_speed_kmh,
                incident_count=z.incident_count,
                env_index=z.environmental_index
            )
            after_pressure_map[z_id] = new_score
            if new_score > before_pressure_map[z_id] + 8.0:
                affected_zones.add(z_id)

        # Aggregate simulated metrics
        sim_avg_speed = sum(z.avg_speed_kmh for z in sim_zones.values()) / max(1, len(sim_zones))
        sim_avg_pressure = sum(after_pressure_map.values()) / max(1, len(after_pressure_map))
        before_avg_pressure = sum(before_pressure_map.values()) / max(1, len(before_pressure_map))

        # Calculate percentage shifts
        travel_time_pct = round(((baseline_avg_speed - sim_avg_speed) / max(1.0, sim_avg_speed)) * 100.0, 1)
        congestion_pct = round(((sim_avg_pressure - before_avg_pressure) / max(1.0, before_avg_pressure)) * 100.0, 1)
        co2_pct = round(congestion_pct * 0.72, 1)
        fuel_pct = round(congestion_pct * 0.68, 1)
        delay_pct = round(travel_time_pct * 1.35, 1)

        # Recommended AI Actions
        if scenario.road_closures:
            recommended_actions.append("Activate dynamic perimeter rerouting via Ring Expressway North (R-01) and Grand Outer Orbital (R-14).")
        if scenario.demand_multiplier > 1.15:
            recommended_actions.append(f"Stagger {int((scenario.demand_multiplier-1.0)*180)} freight arrival slots by +45 minutes to prevent dock gridlock.")
        if len(scenario.festival_zones) > 0:
            recommended_actions.append("Enforce temporary Heavy Commercial Vehicle (HCV) curfew within 1.5km of event perimeter during 16:00 - 21:00.")
        if not recommended_actions:
            recommended_actions.append("Network capacity is resilient; maintain dynamic green signal tuning.")

        metrics_diff = [
            SimulationMetricDiff(
                metric="City Pressure Index",
                before_value=round(before_avg_pressure, 1),
                after_value=round(sim_avg_pressure, 1),
                delta_pct=congestion_pct,
                unit="Score",
                favorable_direction="DECREASE"
            ),
            SimulationMetricDiff(
                metric="Average Travel Time",
                before_value=24.5,
                after_value=round(24.5 * (1.0 + travel_time_pct / 100.0), 1),
                delta_pct=travel_time_pct,
                unit="Mins",
                favorable_direction="DECREASE"
            ),
            SimulationMetricDiff(
                metric="Logistics Delivery Delay",
                before_value=12.0,
                after_value=round(12.0 * (1.0 + delay_pct / 100.0), 1),
                delta_pct=delay_pct,
                unit="Mins/Trip",
                favorable_direction="DECREASE"
            ),
            SimulationMetricDiff(
                metric="Fleet CO2 Emissions",
                before_value=1420.0,
                after_value=round(1420.0 * (1.0 + co2_pct / 100.0), 1),
                delta_pct=co2_pct,
                unit="kg CO2",
                favorable_direction="DECREASE"
            ),
            SimulationMetricDiff(
                metric="Fleet Fuel Burn",
                before_value=530.0,
                after_value=round(530.0 * (1.0 + fuel_pct / 100.0), 1),
                delta_pct=fuel_pct,
                unit="Liters",
                favorable_direction="DECREASE"
            ),
        ]

        return SimulationResultModel(
            scenario_name=scenario.name,
            timestamp="Live Simulation Run",
            travel_time_change_pct=travel_time_pct,
            congestion_change_pct=congestion_pct,
            logistics_delay_change_pct=delay_pct,
            co2_change_pct=co2_pct,
            fuel_change_pct=fuel_pct,
            metrics=metrics_diff,
            affected_zones=list(affected_zones) if affected_zones else ["Z-01", "Z-02"],
            critical_bottlenecks=critical_bottlenecks if critical_bottlenecks else ["CBD East Radial (R-03)"],
            recommended_actions=recommended_actions,
            before_pressure_map=before_pressure_map,
            after_pressure_map=after_pressure_map
        )

# Singleton Simulator
simulator_engine = WhatIfSimulatorEngine()
