import math
import random
from typing import List, Dict, Any, Optional
from datetime import datetime
from backend.app.models.schemas import (
    ZoneModel, RoadSegmentModel, VehicleModel, DeliveryRequestModel,
    LoadingZoneModel, IncidentModel, PressureClass, VehicleType,
    VehicleStatus, PriorityLevel, DeliveryStatus, IncidentType
)

class CityDigitalTwin:
    """
    In-memory state and Graph engine representing the metropolitan digital-twin.
    Maintains real-time state of zones, roads, vehicles, deliveries, loading zones, and incidents.
    """
    def __init__(self):
        self.zones: Dict[str, ZoneModel] = {}
        self.roads: Dict[str, RoadSegmentModel] = {}
        self.vehicles: Dict[str, VehicleModel] = {}
        self.deliveries: Dict[str, DeliveryRequestModel] = {}
        self.loading_zones: Dict[str, LoadingZoneModel] = {}
        self.incidents: Dict[str, IncidentModel] = {}
        self.is_emergency_active: bool = False
        self.active_emergency_corridor: Optional[Dict[str, Any]] = None
        self.tick_count: int = 0
        self.last_tick_time: Optional[datetime] = None
        self._initialize_seed_data()

    def _initialize_seed_data(self):
        # Base coordinates for the smart city (e.g., modern tech metropolis centered around 12.9716, 77.5946)
        base_lat, base_lng = 12.9716, 77.5946

        # 10 Detailed Urban Sectors
        zones_raw = [
            {
                "id": "Z-01",
                "name": "Central Business District (CBD)",
                "category": "Commercial Hub",
                "center": [base_lat + 0.00, base_lng + 0.00],
                "polygon": [
                    [base_lat - 0.012, base_lng - 0.012],
                    [base_lat + 0.012, base_lng - 0.012],
                    [base_lat + 0.012, base_lng + 0.012],
                    [base_lat - 0.012, base_lng + 0.012],
                ],
                "road_util": 0.88,
                "density": 0.84,
                "demand": 94.0,
                "parking": 0.91,
                "speed": 14.5,
                "free_speed": 45.0,
                "env": 78.0,
                "loading_cap": 30,
                "loading_occ": 27,
                "deliveries": 142,
                "vehicles": 68
            },
            {
                "id": "Z-02",
                "name": "Metro Tech Park & Cyber Corridor",
                "category": "Tech Park",
                "center": [base_lat + 0.025, base_lng + 0.035],
                "polygon": [
                    [base_lat + 0.015, base_lng + 0.022],
                    [base_lat + 0.035, base_lng + 0.022],
                    [base_lat + 0.035, base_lng + 0.048],
                    [base_lat + 0.015, base_lng + 0.048],
                ],
                "road_util": 0.76,
                "density": 0.72,
                "demand": 82.0,
                "parking": 0.79,
                "speed": 22.0,
                "free_speed": 55.0,
                "env": 64.0,
                "loading_cap": 25,
                "loading_occ": 20,
                "deliveries": 118,
                "vehicles": 54
            },
            {
                "id": "Z-03",
                "name": "Old Heritage Market & Wholesale Belt",
                "category": "Wholesale Market",
                "center": [base_lat - 0.022, base_lng - 0.025],
                "polygon": [
                    [base_lat - 0.032, base_lng - 0.036],
                    [base_lat - 0.012, base_lng - 0.036],
                    [base_lat - 0.012, base_lng - 0.014],
                    [base_lat - 0.032, base_lng - 0.014],
                ],
                "road_util": 0.95,
                "density": 0.92,
                "demand": 98.0,
                "parking": 0.96,
                "speed": 9.2,
                "free_speed": 35.0,
                "env": 89.0,
                "loading_cap": 18,
                "loading_occ": 18,
                "deliveries": 160,
                "vehicles": 75
            },
            {
                "id": "Z-04",
                "name": "Aero Logistics & Cargo Terminal",
                "category": "Logistics Hub",
                "center": [base_lat + 0.050, base_lng - 0.015],
                "polygon": [
                    [base_lat + 0.038, base_lng - 0.030],
                    [base_lat + 0.062, base_lng - 0.030],
                    [base_lat + 0.062, base_lng + 0.000],
                    [base_lat + 0.038, base_lng + 0.000],
                ],
                "road_util": 0.62,
                "density": 0.58,
                "demand": 88.0,
                "parking": 0.52,
                "speed": 38.0,
                "free_speed": 60.0,
                "env": 45.0,
                "loading_cap": 50,
                "loading_occ": 31,
                "deliveries": 95,
                "vehicles": 82
            },
            {
                "id": "Z-05",
                "name": "South Industrial Logistics Complex",
                "category": "Industrial Park",
                "center": [base_lat - 0.045, base_lng + 0.020],
                "polygon": [
                    [base_lat - 0.058, base_lng + 0.005],
                    [base_lat - 0.032, base_lng + 0.005],
                    [base_lat - 0.032, base_lng + 0.035],
                    [base_lat - 0.058, base_lng + 0.035],
                ],
                "road_util": 0.70,
                "density": 0.65,
                "demand": 76.0,
                "parking": 0.64,
                "speed": 31.0,
                "free_speed": 55.0,
                "env": 58.0,
                "loading_cap": 40,
                "loading_occ": 26,
                "deliveries": 88,
                "vehicles": 60
            },
            {
                "id": "Z-06",
                "name": "North Intermodal Transit Hub",
                "category": "Transit Junction",
                "center": [base_lat + 0.035, base_lng - 0.040],
                "polygon": [
                    [base_lat + 0.022, base_lng - 0.052],
                    [base_lat + 0.048, base_lng - 0.052],
                    [base_lat + 0.048, base_lng - 0.028],
                    [base_lat + 0.022, base_lng - 0.028],
                ],
                "road_util": 0.81,
                "density": 0.78,
                "demand": 68.0,
                "parking": 0.85,
                "speed": 18.5,
                "free_speed": 45.0,
                "env": 71.0,
                "loading_cap": 22,
                "loading_occ": 19,
                "deliveries": 72,
                "vehicles": 41
            },
            {
                "id": "Z-07",
                "name": "East Riverfront Commercial Bay",
                "category": "Commercial Port",
                "center": [base_lat + 0.005, base_lng + 0.048],
                "polygon": [
                    [base_lat - 0.008, base_lng + 0.036],
                    [base_lat + 0.018, base_lng + 0.036],
                    [base_lat + 0.018, base_lng + 0.060],
                    [base_lat - 0.008, base_lng + 0.060],
                ],
                "road_util": 0.65,
                "density": 0.60,
                "demand": 60.0,
                "parking": 0.58,
                "speed": 28.0,
                "free_speed": 50.0,
                "env": 52.0,
                "loading_cap": 24,
                "loading_occ": 14,
                "deliveries": 54,
                "vehicles": 30
            },
            {
                "id": "Z-08",
                "name": "West University & Research Quarter",
                "category": "Institutional",
                "center": [base_lat - 0.008, base_lng - 0.045],
                "polygon": [
                    [base_lat - 0.020, base_lng - 0.058],
                    [base_lat + 0.004, base_lng - 0.058],
                    [base_lat + 0.004, base_lng - 0.032],
                    [base_lat - 0.020, base_lng - 0.032],
                ],
                "road_util": 0.48,
                "density": 0.44,
                "demand": 45.0,
                "parking": 0.42,
                "speed": 34.0,
                "free_speed": 45.0,
                "env": 35.0,
                "loading_cap": 16,
                "loading_occ": 6,
                "deliveries": 38,
                "vehicles": 22
            },
            {
                "id": "Z-09",
                "name": "Green Ridge Smart Residential Enclave",
                "category": "Residential",
                "center": [base_lat - 0.038, base_lng - 0.005],
                "polygon": [
                    [base_lat - 0.050, base_lng - 0.018],
                    [base_lat - 0.026, base_lng - 0.018],
                    [base_lat - 0.026, base_lng + 0.008],
                    [base_lat - 0.050, base_lng + 0.008],
                ],
                "road_util": 0.38,
                "density": 0.35,
                "demand": 52.0,
                "parking": 0.32,
                "speed": 36.0,
                "free_speed": 45.0,
                "env": 26.0,
                "loading_cap": 15,
                "loading_occ": 5,
                "deliveries": 65,
                "vehicles": 28
            },
            {
                "id": "Z-10",
                "name": "Northeast E-Commerce Fulfillment Belt",
                "category": "Fulfillment Park",
                "center": [base_lat + 0.045, base_lng + 0.025],
                "polygon": [
                    [base_lat + 0.034, base_lng + 0.012],
                    [base_lat + 0.056, base_lng + 0.012],
                    [base_lat + 0.056, base_lng + 0.038],
                    [base_lat + 0.034, base_lng + 0.038],
                ],
                "road_util": 0.74,
                "density": 0.70,
                "demand": 89.0,
                "parking": 0.73,
                "speed": 29.0,
                "free_speed": 55.0,
                "env": 62.0,
                "loading_cap": 35,
                "loading_occ": 28,
                "deliveries": 125,
                "vehicles": 70
            }
        ]

        for z in zones_raw:
            score = self.calculate_pressure_score(
                road_util=z["road_util"],
                traffic_density=z["density"],
                logistics_demand=z["demand"],
                parking_pressure=z["parking"],
                avg_speed=z["speed"],
                free_speed=z["free_speed"],
                incident_count=1 if z["id"] in ["Z-01", "Z-03"] else 0,
                env_index=z["env"]
            )
            p_class = self.classify_pressure(score)

            zone_obj = ZoneModel(
                id=z["id"],
                name=z["name"],
                category=z["category"],
                center=z["center"],
                polygon=z["polygon"],
                road_utilization=z["road_util"],
                traffic_density=z["density"],
                logistics_demand=z["demand"],
                parking_pressure=z["parking"],
                avg_speed_kmh=z["speed"],
                free_flow_speed_kmh=z["free_speed"],
                incident_count=1 if z["id"] in ["Z-01", "Z-03"] else 0,
                environmental_index=z["env"],
                pressure_score=score,
                pressure_class=p_class,
                active_deliveries=z["deliveries"],
                active_vehicles=z["vehicles"],
                loading_bay_capacity=z["loading_cap"],
                loading_bay_occupied=z["loading_occ"]
            )
            self.zones[z["id"]] = zone_obj

        # Interconnected Real Road Segments (High-precision street geometries along Bengaluru arterial corridors)
        roads_raw = [
            (
                "R-01", "Ring Expressway North (ORR Hebbal-Kalyan Nagar)", "Z-04", "Z-10", 4.8, 70, 52, 2800, 1800, 0.64, 4,
                [[13.0216, 77.5796], [13.0240, 77.5920], [13.0255, 77.6040], [13.0230, 77.6140], [13.0166, 77.6196]]
            ),
            (
                "R-02", "Cyber Avenue Arterial (Banaswadi - Indiranagar 100ft Rd)", "Z-10", "Z-02", 3.4, 60, 24, 2200, 1950, 0.88, 3,
                [[13.0166, 77.6196], [13.0080, 77.6220], [13.0010, 77.6250], [12.9966, 77.6296]]
            ),
            (
                "R-03", "CBD East Radial (MG Road - Old Airport Rd)", "Z-02", "Z-01", 3.9, 50, 18, 2400, 2180, 0.91, 3,
                [[12.9966, 77.6296], [12.9860, 77.6220], [12.9770, 77.6100], [12.9730, 77.6010], [12.9716, 77.5946]]
            ),
            (
                "R-04", "Riverfront Linkway (Indiranagar - HAL - Marathahalli)", "Z-02", "Z-07", 3.2, 50, 36, 1600, 950, 0.59, 2,
                [[12.9966, 77.6296], [12.9880, 77.6350], [12.9810, 77.6390], [12.9780, 77.6415], [12.9766, 77.6426]]
            ),
            (
                "R-05", "CBD South Connector (Richmond Rd - Lalbagh - Jayanagar)", "Z-01", "Z-09", 4.2, 50, 34, 1800, 1100, 0.61, 2,
                [[12.9716, 77.5946], [12.9640, 77.5960], [12.9550, 77.5930], [12.9440, 77.5910], [12.9336, 77.5896]]
            ),
            (
                "R-06", "Old City Heritage Pass (Hudson Circle - Town Hall - KR Market)", "Z-01", "Z-03", 2.8, 40, 11, 2000, 1920, 0.96, 2,
                [[12.9716, 77.5946], [12.9670, 77.5870], [12.9610, 77.5800], [12.9550, 77.5760], [12.9496, 77.5696]]
            ),
            (
                "R-07", "University West Bypass (KR Market - Majestic - Malleshwaram)", "Z-03", "Z-08", 3.6, 50, 38, 1600, 780, 0.49, 2,
                [[12.9496, 77.5696], [12.9620, 77.5670], [12.9720, 77.5600], [12.9680, 77.5540], [12.9636, 77.5496]]
            ),
            (
                "R-08", "North Transit Elevated Corridor (Dr. Rajkumar Rd - Yeshwanthpur)", "Z-08", "Z-06", 4.6, 60, 22, 2400, 2020, 0.84, 3,
                [[12.9636, 77.5496], [12.9780, 77.5510], [12.9920, 77.5530], [13.0066, 77.5546]]
            ),
            (
                "R-09", "Cargo Logistics Spine (Yeshwanthpur - BEL Rd - Hebbal)", "Z-06", "Z-04", 3.8, 65, 45, 2600, 1600, 0.62, 3,
                [[13.0066, 77.5546], [13.0130, 77.5620], [13.0180, 77.5710], [13.0216, 77.5796]]
            ),
            (
                "R-10", "South Freight Bypass (Jayanagar - BTM Layout - Silk Board)", "Z-09", "Z-05", 3.9, 60, 32, 2200, 1450, 0.66, 3,
                [[12.9336, 77.5896], [12.9300, 77.5980], [12.9275, 77.6080], [12.9266, 77.6146]]
            ),
            (
                "R-11", "Industrial Port Access Expressway (Silk Board - Bellandur ORR - Marathahalli)", "Z-05", "Z-07", 5.6, 65, 48, 2400, 1300, 0.54, 3,
                [[12.9266, 77.6146], [12.9360, 77.6250], [12.9520, 77.6350], [12.9650, 77.6395], [12.9766, 77.6426]]
            ),
            (
                "R-12", "Central Metro Spine (Yeshwanthpur - Palace Rd - Vidhana Soudha - CBD)", "Z-06", "Z-01", 4.9, 55, 16, 3000, 2850, 0.95, 4,
                [[13.0066, 77.5546], [12.9980, 77.5680], [12.9870, 77.5800], [12.9780, 77.5890], [12.9716, 77.5946]]
            ),
            (
                "R-13", "South-Central Connector (KR Market - Basavanagudi - Jayanagar)", "Z-03", "Z-09", 2.9, 45, 30, 1500, 900, 0.60, 2,
                [[12.9496, 77.5696], [12.9440, 77.5750], [12.9390, 77.5810], [12.9336, 77.5896]]
            ),
            (
                "R-14", "Grand Outer Orbital (Hebbal - KR Puram Bridge - Marathahalli ORR)", "Z-04", "Z-07", 7.2, 80, 62, 3200, 1900, 0.59, 4,
                [[13.0216, 77.5796], [13.0180, 77.6100], [13.0090, 77.6320], [12.9970, 77.6450], [12.9850, 77.6430], [12.9766, 77.6426]]
            ),
        ]

        for r_id, name, from_z, to_z, length, free_spd, cur_spd, cap, vol, cong, lanes, coords in roads_raw:
            road_obj = RoadSegmentModel(
                id=r_id,
                name=name,
                from_zone_id=from_z,
                to_zone_id=to_z,
                coordinates=coords,
                length_km=length,
                free_flow_speed_kmh=free_spd,
                current_speed_kmh=cur_spd,
                capacity_vph=cap,
                current_volume_vph=vol,
                congestion_level=cong,
                status="CONGESTED" if cong > 0.75 else "NORMAL",
                lane_count=lanes,
                emissions_factor=1.0 + (cong * 0.8)
            )
            self.roads[r_id] = road_obj

        # Smart Loading Zones (Placed strictly along access roads of each zone)
        loading_zones_raw = [
            ("LZ-01", "CBD Plaza Smart Freight Bay", "Z-01", [12.9730, 77.5980], 12, 11, 1, 0, 3, 20, True),
            ("LZ-02", "Financial District Dock Alpha", "Z-01", [12.9680, 77.5920], 18, 16, 2, 0, 4, 25, True),
            ("LZ-03", "Cyber Tech Bay North", "Z-02", [12.9980, 77.6280], 15, 12, 2, 1, 2, 18, True),
            ("LZ-04", "Innovation Hub Cargo Deck", "Z-02", [12.9920, 77.6320], 10, 8, 1, 1, 1, 20, True),
            ("LZ-05", "Wholesale Grain Market Bay", "Z-03", [12.9520, 77.5720], 10, 10, 0, 0, 6, 35, False),
            ("LZ-06", "Old City Spice Yard Logistics", "Z-03", [12.9480, 77.5680], 8, 8, 0, 0, 5, 30, False),
            ("LZ-07", "Air Cargo Consolidated Terminal", "Z-04", [13.0230, 77.5810], 30, 18, 4, 8, 0, 15, True),
            ("LZ-08", "Aero Express Freight Bay", "Z-04", [13.0200, 77.5780], 20, 13, 3, 4, 1, 20, True),
            ("LZ-09", "South Industrial Logistics Dock 1", "Z-05", [12.9280, 77.6160], 25, 16, 3, 6, 1, 22, True),
            ("LZ-10", "North Intermodal Transshipment Yard", "Z-06", [13.0080, 77.5560], 22, 19, 2, 1, 3, 25, True),
            ("LZ-11", "Riverfront Commercial Pier Hub", "Z-07", [12.9780, 77.6410], 24, 14, 3, 7, 0, 18, True),
            ("LZ-12", "Green Ridge Micro-Hub Drop", "Z-09", [12.9350, 77.5880], 15, 5, 2, 8, 0, 12, True),
            ("LZ-13", "Northeast E-Commerce Sort Hub", "Z-10", [13.0180, 77.6180], 35, 28, 4, 3, 2, 15, True),
        ]

        for lz_id, name, z_id, loc, tot, occ, res, avail, queue, dwell, ev in loading_zones_raw:
            self.loading_zones[lz_id] = LoadingZoneModel(
                id=lz_id,
                name=name,
                zone_id=z_id,
                zone_name=self.zones[z_id].name,
                location=loc,
                total_bays=tot,
                occupied_bays=occ,
                reserved_bays=res,
                available_bays=max(0, tot - occ - res),
                queue_count=queue,
                avg_dwell_time_mins=dwell,
                ev_charging_available=ev,
                current_utilization_pct=round(((occ + res) / tot) * 100, 1)
            )

        # Seed Incidents
        self.incidents["INC-101"] = IncidentModel(
            id="INC-101",
            type=IncidentType.ROAD_CLOSURE,
            title="Emergency Water Pipeline Repair",
            description="Major lane closure on Old City Heritage Pass (R-06). 2 of 2 lanes restricted.",
            location=[12.9610, 77.5800],
            affected_road_ids=["R-06"],
            affected_zone_ids=["Z-03", "Z-01"],
            severity="SEVERE",
            start_time="13:30",
            estimated_clearance_time="18:00",
            active=True
        )

        self.incidents["INC-102"] = IncidentModel(
            id="INC-102",
            type=IncidentType.FESTIVAL_EVENT,
            title="Central Cyber Expo & Cultural Festival",
            description="Massive footfall and shuttle surges surrounding Metro Tech Park & CBD East Radial.",
            location=[12.9860, 77.6220],
            affected_road_ids=["R-02", "R-03"],
            affected_zone_ids=["Z-02", "Z-01"],
            severity="MODERATE",
            start_time="14:00",
            estimated_clearance_time="21:30",
            active=True
        )

        # Seed Vehicles (Spawned strictly along actual road segments)
        vehicle_types = [
            (VehicleType.ELECTRIC_VAN, 950, 45.0),
            (VehicleType.CARGO_EV_2W, 120, 12.0),
            (VehicleType.DIESEL_LCV, 1800, 140.0),
            (VehicleType.CNG_TRUCK, 2500, 95.0),
            (VehicleType.HEAVY_FREIGHT, 8000, 260.0),
        ]
        drivers = [
            "Aarav Sharma", "Priya Nair", "Vikram Rathore", "Kavita Reddy",
            "Mohammed Zaid", "Rohit Verma", "Ananya Deshmukh", "Rajesh Gupta",
            "Deepak Shenoy", "Sunita Patil", "Kiran Joshi", "Suresh Kumar",
            "Manoj Pillai", "Harpreet Singh", "Neha Bansal"
        ]

        road_list = list(self.roads.values())
        for i in range(1, 41):
            v_id = f"VEH-{1000 + i}"
            v_type, max_p, co2_rate = random.choice(vehicle_types)
            assigned_road = road_list[i % len(road_list)]
            # Interpolate position on the road segment
            t = random.uniform(0.05, 0.95)
            coords = assigned_road.coordinates
            num_segs = len(coords) - 1
            seg_idx = min(int(t * num_segs), num_segs - 1)
            seg_t = (t * num_segs) - seg_idx
            p1 = coords[seg_idx]
            p2 = coords[seg_idx + 1]
            v_lat = round(p1[0] + (p2[0] - p1[0]) * seg_t, 6)
            v_lng = round(p1[1] + (p2[1] - p1[1]) * seg_t, 6)

            veh = VehicleModel(
                id=v_id,
                plate_number=f"KA-01-CF-{2000 + i}",
                vehicle_type=v_type,
                driver_name=drivers[i % len(drivers)],
                fuel_or_battery_pct=round(random.uniform(35.0, 98.0), 1),
                lat=v_lat,
                lng=v_lng,
                heading=round(random.uniform(0, 360), 1),
                current_speed_kmh=round(assigned_road.current_speed_kmh * random.uniform(0.85, 1.05), 1),
                status=random.choice([VehicleStatus.IN_TRANSIT, VehicleStatus.IN_TRANSIT, VehicleStatus.LOADING, VehicleStatus.IDLE]),
                current_zone_id=assigned_road.from_zone_id,
                destination_zone_id=assigned_road.to_zone_id,
                max_payload_kg=max_p,
                current_payload_kg=round(random.uniform(0.2 * max_p, 0.9 * max_p), 1),
                assigned_orders_count=random.randint(2, 6),
                co2_emission_rate_g_km=co2_rate
            )
            self.vehicles[v_id] = veh


        # Seed Deliveries
        customers = [
            "Amazon Fulfillment Hub", "Flipkart Quick Hub", "Reliance Retail Express",
            "Zepto Darkstore 04", "Blinkit Micro-Center", "Tata Digital Logistics",
            "Apollo Pharma Central", "Apollo Pharmacy Sector 4", "Schneider Logistics",
            "Siemens Smart Tech R&D", "Metro Mega Mart", "Decathlon City Center"
        ]
        time_windows = [
            ("09:00", "11:00"), ("11:00", "13:00"), ("13:00", "15:00"),
            ("15:00", "17:00"), ("17:00", "19:00"), ("19:00", "21:00")
        ]
        priorities = [PriorityLevel.LOW, PriorityLevel.MEDIUM, PriorityLevel.HIGH, PriorityLevel.CRITICAL_URGENT]

        for i in range(1, 61):
            d_id = f"DEL-{5000 + i}"
            orig = random.choice(["Z-04", "Z-10", "Z-05", "Z-07"])
            dest = random.choice(["Z-01", "Z-02", "Z-03", "Z-06", "Z-08", "Z-09"])
            dest_coords = [
                self.zones[dest].center[0] + random.uniform(-0.007, 0.007),
                self.zones[dest].center[1] + random.uniform(-0.007, 0.007)
            ]
            win_start, win_end = random.choice(time_windows)
            prio = random.choices(priorities, weights=[0.2, 0.45, 0.25, 0.1])[0]

            # Find nearby loading zone
            nearby_lz = self.find_nearest_loading_zone(dest_coords, dest)

            req = DeliveryRequestModel(
                id=d_id,
                tracking_code=f"CF-TRK-{80000 + i}",
                customer_name=customers[i % len(customers)],
                origin_zone_id=orig,
                destination_zone_id=dest,
                destination_coords=dest_coords,
                package_weight_kg=round(random.uniform(2.5, 45.0), 1),
                priority=prio,
                preferred_window_start=win_start,
                preferred_window_end=win_end,
                assigned_slot_start=win_start,
                assigned_slot_end=win_end,
                assigned_vehicle_id=f"VEH-{1000 + (i % 40) + 1}",
                assigned_loading_zone_id=nearby_lz.id if nearby_lz else None,
                status=random.choice([DeliveryStatus.PENDING, DeliveryStatus.SCHEDULED, DeliveryStatus.IN_DELIVERY]),
                travel_time_mins=round(random.uniform(18.0, 42.0), 1),
                estimated_co2_kg=round(random.uniform(0.8, 3.4), 2),
                delay_risk_score=round(random.uniform(0.1, 0.85), 2)
            )
            self.deliveries[d_id] = req

    def calculate_pressure_score(
        self,
        road_util: float,
        traffic_density: float,
        logistics_demand: float,
        parking_pressure: float,
        avg_speed: float,
        free_speed: float,
        incident_count: int,
        env_index: float
    ) -> float:
        """
        City Pressure Index Calculation (0-100)
        Weighted deterministic formula:
        - Road utilization: 25%
        - Traffic density: 20%
        - Logistics demand normalized (0-100 -> 0-1): 20%
        - Parking/loading pressure: 15%
        - Speed deficit (1 - avg/free): 10%
        - Incidents & environmental factor: 10%
        """
        speed_deficit = max(0.0, min(1.0, 1.0 - (avg_speed / max(free_speed, 1.0))))
        demand_norm = min(1.0, logistics_demand / 100.0)
        incident_impact = min(1.0, incident_count * 0.4)
        env_norm = min(1.0, env_index / 100.0)

        score = (
            (road_util * 25.0) +
            (traffic_density * 20.0) +
            (demand_norm * 20.0) +
            (parking_pressure * 15.0) +
            (speed_deficit * 10.0) +
            (((incident_impact * 0.6) + (env_norm * 0.4)) * 10.0)
        )
        return round(max(0.0, min(100.0, score)), 1)

    def classify_pressure(self, score: float) -> PressureClass:
        if score <= 30.0:
            return PressureClass.LOW
        elif score <= 60.0:
            return PressureClass.MODERATE
        elif score <= 80.0:
            return PressureClass.HIGH
        else:
            return PressureClass.CRITICAL

    def find_nearest_loading_zone(self, coords: List[float], zone_id: Optional[str] = None) -> Optional[LoadingZoneModel]:
        target_zones = [lz for lz in self.loading_zones.values() if (zone_id is None or lz.zone_id == zone_id)]
        if not target_zones:
            target_zones = list(self.loading_zones.values())

        if not target_zones:
            return None

        def dist(lz: LoadingZoneModel):
            lat_diff = lz.location[0] - coords[0]
            lng_diff = lz.location[1] - coords[1]
            return math.sqrt(lat_diff**2 + lng_diff**2)

        return min(target_zones, key=dist)

    def compute_walking_distance_meters(self, coord1: List[float], coord2: List[float]) -> int:
        # Haversine approximation in meters
        lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
        lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        r = 6371000 # Earth radius in meters
        return int(round(r * c))

    def update_road_congestion(self, road_id: str, new_congestion: float, status: str = "NORMAL"):
        if road_id in self.roads:
            r = self.roads[road_id]
            r.congestion_level = max(0.0, min(1.0, new_congestion))
            r.status = status
            r.current_speed_kmh = max(8.0, r.free_flow_speed_kmh * (1.0 - (0.8 * r.congestion_level)))
            r.emissions_factor = 1.0 + (r.congestion_level * 0.9)

            # Recompute connected zones
            for z_id in [r.from_zone_id, r.to_zone_id]:
                if z_id in self.zones:
                    z = self.zones[z_id]
                    z.road_utilization = max(0.1, min(0.99, z.road_utilization + (new_congestion - 0.5) * 0.2))
                    z.pressure_score = self.calculate_pressure_score(
                        z.road_utilization, z.traffic_density, z.logistics_demand,
                        z.parking_pressure, z.avg_speed_kmh, z.free_flow_speed_kmh,
                        z.incident_count, z.environmental_index
                    )
                    z.pressure_class = self.classify_pressure(z.pressure_score)

    def tick(self) -> None:
        """
        Advance city simulation by one time-step (~15 seconds).
        Perturbs zones and moves active vehicles strictly along real road network polylines.
        """
        self.tick_count += 1
        self.last_tick_time = datetime.now()

        # 1. Zone perturbations
        for z in self.zones.values():
            z.road_utilization = max(0.1, min(0.99, z.road_utilization + random.uniform(-0.02, 0.025)))
            z.traffic_density = max(0.05, min(0.99, z.traffic_density + random.uniform(-0.02, 0.025)))
            z.avg_speed_kmh = max(6.0, min(z.free_flow_speed_kmh, z.avg_speed_kmh + random.uniform(-1.0, 1.0)))
            z.pressure_score = self.calculate_pressure_score(
                road_util=z.road_utilization,
                traffic_density=z.traffic_density,
                logistics_demand=z.logistics_demand,
                parking_pressure=z.parking_pressure,
                avg_speed=z.avg_speed_kmh,
                free_speed=z.free_flow_speed_kmh,
                incident_count=z.incident_count,
                env_index=z.environmental_index
            )
            z.pressure_class = self.classify_pressure(z.pressure_score)
            z.active_vehicles = max(5, z.active_vehicles + random.randint(-1, 1))
            z.active_deliveries = max(5, z.active_deliveries + random.randint(-2, 2))

        # 2. Road congestion perturbations
        for r in self.roads.values():
            delta = random.uniform(-0.02, 0.02)
            r.congestion_level = max(0.05, min(0.99, r.congestion_level + delta))
            r.current_speed_kmh = max(6.0, r.free_flow_speed_kmh * (1.0 - 0.8 * r.congestion_level))
            r.emissions_factor = 1.0 + r.congestion_level * 0.9
            r.status = "CONGESTED" if r.congestion_level > 0.75 else "NORMAL"

        # 3. Vehicle movement strictly on road polylines
        if not hasattr(self, "_veh_tracking"):
            self._veh_tracking = {}

        road_keys = list(self.roads.keys())
        for v in self.vehicles.values():
            if v.status in (VehicleStatus.IDLE, VehicleStatus.LOADING, VehicleStatus.UNLOADING):
                continue

            # Initialize tracking if absent
            if v.id not in self._veh_tracking:
                self._veh_tracking[v.id] = {
                    "road_id": random.choice(road_keys),
                    "t": random.uniform(0.1, 0.9),
                    "direction": 1 if random.random() > 0.5 else -1
                }

            track = self._veh_tracking[v.id]
            road = self.roads.get(track["road_id"], self.roads[road_keys[0]])
            
            # Speed advancement along road
            speed_kmh = max(10.0, road.current_speed_kmh)
            v.current_speed_kmh = round(speed_kmh + random.uniform(-2.0, 2.0), 1)
            delta_t = (speed_kmh / 3600.0 * 15.0) / max(0.5, road.length_km)
            track["t"] += track["direction"] * delta_t

            # When reaching road end, transition or reverse along network
            if track["t"] >= 1.0:
                track["t"] = 1.0
                track["direction"] = -1
                # Find connected road
                connected = [r.id for r in self.roads.values() if r.from_zone_id == road.to_zone_id or r.to_zone_id == road.to_zone_id]
                if connected:
                    track["road_id"] = random.choice(connected)
                    track["t"] = 0.0
                    track["direction"] = 1
            elif track["t"] <= 0.0:
                track["t"] = 0.0
                track["direction"] = 1
                connected = [r.id for r in self.roads.values() if r.from_zone_id == road.from_zone_id or r.to_zone_id == road.from_zone_id]
                if connected:
                    track["road_id"] = random.choice(connected)
                    track["t"] = 0.0
                    track["direction"] = 1

            # Interpolate position on current road polyline
            coords = road.coordinates
            num_segs = len(coords) - 1
            cur_t = max(0.0, min(1.0, track["t"]))
            seg_idx = min(int(cur_t * num_segs), num_segs - 1)
            seg_t = (cur_t * num_segs) - seg_idx
            p1 = coords[seg_idx]
            p2 = coords[seg_idx + 1]

            v.lat = round(p1[0] + (p2[0] - p1[0]) * seg_t, 6)
            v.lng = round(p1[1] + (p2[1] - p1[1]) * seg_t, 6)
            
            # Compute heading angle along road segment
            dlat = p2[0] - p1[0]
            dlng = p2[1] - p1[1]
            angle = math.degrees(math.atan2(dlng, dlat))
            v.heading = round((angle if track["direction"] > 0 else (angle + 180)) % 360, 1)

# Singleton City Digital Twin
city_twin = CityDigitalTwin()



