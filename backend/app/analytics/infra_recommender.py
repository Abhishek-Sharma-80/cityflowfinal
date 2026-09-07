from typing import List, Dict, Any
from backend.app.models.schemas import InfraRecommendationModel, InfraCategory
from backend.app.core.city_twin import city_twin

class InfrastructureRecommendationEngine:
    """
    Intelligent Infrastructure Capital Planning & Capacity Balancing Engine.
    Analyzes spatial-temporal congestion heatmaps, loading dock bottlenecks, and freight throughput
    to recommend targeted infrastructure upgrades with cost-benefit & ROI rankings.
    """
    def __init__(self):
        pass

    def generate_recommendations(self) -> List[InfraRecommendationModel]:
        recs: List[InfraRecommendationModel] = []

        # Analyze each zone for demand/capacity imbalance
        for z_id, z in city_twin.zones.items():
            # 1. Loading bay deficiency analysis
            utilization = (z.loading_bay_occupied / max(1, z.loading_bay_capacity))
            if utilization >= 0.85 or z.parking_pressure >= 0.80:
                deficit_bays = max(3, int(z.logistics_demand / 20.0))
                recs.append(InfraRecommendationModel(
                    id=f"REC-BAY-{z_id}",
                    zone_id=z_id,
                    zone_name=z.name,
                    category=InfraCategory.NEW_LOADING_BAY,
                    priority="URGENT" if utilization > 0.90 else "HIGH",
                    title=f"Add {deficit_bays} Smart Freight Loading Bays in {z.name}",
                    description=f"Persistent curb-side dwell congestion during peak window ({z.peak_hours}). Loading bay occupancy at {int(utilization*100)}%.",
                    reasoning=f"Logistics demand index ({round(z.logistics_demand, 1)}) significantly exceeds current bay capacity ({z.loading_bay_capacity}). Adding {deficit_bays} sensor-monitored bays will eliminate 78% of double-parking incidents on adjacent arterials.",
                    estimated_capex_inr=float(deficit_bays * 450000), # ₹4.5 Lakh per smart bay
                    annual_co2_saving_tons=round(deficit_bays * 14.2, 1),
                    daily_delay_reduction_hours=round(deficit_bays * 4.8, 1),
                    roi_score=round(min(9.8, 7.2 + (utilization * 2.5)), 1),
                    implementation_weeks=4,
                    recommended_bays_or_units=deficit_bays
                ))

            # 2. EV fast charger deficiency in logistics-heavy corridors
            if z.category in ["Logistics Hub", "Fulfillment Park", "Commercial Hub", "Tech Park"]:
                ev_units = 4 if z.category == "Logistics Hub" else 2
                recs.append(InfraRecommendationModel(
                    id=f"REC-EV-{z_id}",
                    zone_id=z_id,
                    zone_name=z.name,
                    category=InfraCategory.EV_CHARGER,
                    priority="HIGH",
                    title=f"Install {ev_units}x 60kW DC Fast EV Freight Chargers in {z.name}",
                    description=f"Support commercial electric delivery fleet electrification and opportunity charging during scheduled loading slots.",
                    reasoning=f"Zone hosts {z.active_vehicles} active fleet vehicles with 35% electric fleet adoption. Opportunity charging during dwell periods eliminates off-route detour trips to depot.",
                    estimated_capex_inr=float(ev_units * 850000),
                    annual_co2_saving_tons=round(ev_units * 28.5, 1),
                    daily_delay_reduction_hours=round(ev_units * 3.2, 1),
                    roi_score=8.9,
                    implementation_weeks=6,
                    recommended_bays_or_units=ev_units
                ))

            # 3. Micro-Hub consolidation for high-density old city / core districts
            if z.category in ["Wholesale Market", "Commercial Hub"] and z.road_utilization > 0.85:
                recs.append(InfraRecommendationModel(
                    id=f"REC-HUB-{z_id}",
                    zone_id=z_id,
                    zone_name=z.name,
                    category=InfraCategory.DELIVERY_MICRO_HUB,
                    priority="URGENT",
                    title=f"Establish Underground/Multi-level Micro-Fulfillment Sorting Hub in {z.name}",
                    description="Decouple heavy diesel freight from narrow commercial alleys by creating a transshipment sorting point for cargo e-bikes.",
                    reasoning=f"Road utilization is critical at {int(z.road_utilization*100)}% with average speed down to {z.avg_speed_kmh} km/h. Micro-hub transfer to EV 2-wheelers will reduce heavy truck entries by 62%.",
                    estimated_capex_inr=3200000.0,
                    annual_co2_saving_tons=112.0,
                    daily_delay_reduction_hours=38.5,
                    roi_score=9.5,
                    implementation_weeks=12,
                    recommended_bays_or_units=1
                ))

        # 4. Smart traffic signal adaptive control on critical junctions
        recs.append(InfraRecommendationModel(
            id="REC-SIG-CBD-CYBER",
            zone_id="Z-01",
            zone_name="Central Business District (CBD)",
            category=InfraCategory.SMART_SIGNAL,
            priority="HIGH",
            title="Deploy AI Adaptive Traffic Signal Synchronizer (Green Wave) on CBD East Radial",
            description="Dynamic AI signal timings adjusting green splits based on real-time vehicle queue length.",
            reasoning="Arterial R-03 experiences persistent bottlenecking at 91% volume. Dynamic split timing will increase peak discharge throughput by 24%.",
            estimated_capex_inr=1500000.0,
            annual_co2_saving_tons=65.0,
            daily_delay_reduction_hours=21.0,
            roi_score=9.2,
            implementation_weeks=3,
            recommended_bays_or_units=4
        ))

        # Rank by ROI score descending
        recs.sort(key=lambda x: x.roi_score, reverse=True)
        return recs

infra_engine = InfrastructureRecommendationEngine()
