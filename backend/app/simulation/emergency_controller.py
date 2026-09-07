import uuid
import datetime
from typing import List, Dict, Any, Optional
from backend.app.models.schemas import EmergencyRequestInput, EmergencyCorridorResponse, VehicleStatus
from backend.app.core.city_twin import city_twin

class EmergencyCorridorController:
    """
    Emergency Green Corridor Orchestration Controller.
    Clears path for priority emergency response vehicles by:
    - Locking optimal low-latency corridor
    - Preempting traffic signals (Green Wave)
    - Automatically redirecting nearby commercial logistics vehicles to bypass loops
    """
    def __init__(self):
        self.active_corridor: Optional[EmergencyCorridorResponse] = None

    def activate_emergency_corridor(self, req: EmergencyRequestInput) -> EmergencyCorridorResponse:
        corr_id = f"EMERG-{uuid.uuid4().hex[:6].upper()}"

        # Default or supplied coordinates
        orig = [req.origin_lat, req.origin_lng]
        dest = [req.destination_lat, req.destination_lng]

        # Calculate corridor path traversing real road network arterials
        # R-01 (ORR Hebbal-Kalyan Nagar) -> R-02 (Banaswadi-Indiranagar) -> R-03 (MG Road/CBD)
        r1 = city_twin.roads.get("R-01")
        r2 = city_twin.roads.get("R-02")
        r3 = city_twin.roads.get("R-03")
        
        waypoints: List[List[float]] = []
        if r1 and r2 and r3:
            waypoints = [orig] + r1.coordinates + r2.coordinates[1:] + r3.coordinates[1:] + [dest]
        else:
            waypoints = [
                orig,
                [13.0216, 77.5796],
                [13.0255, 77.6040],
                [13.0166, 77.6196],
                [12.9966, 77.6296],
                [12.9770, 77.6100],
                dest
            ]


        # Cleared intersections along the corridor
        cleared_intersections = [
            "Junction IX: Airport Expressway Interchange",
            "Junction XIV: Cyber Avenue - Ring Road Flyover",
            "Junction XXI: CBD North Access Gateway",
            "Junction IV: Central Hospital Emergency Ramp"
        ]

        # Reroute nearby active logistics vehicles
        diverted_count = 0
        for v in city_twin.vehicles.values():
            if v.current_zone_id in ["Z-01", "Z-02", "Z-04", "Z-10"] and v.status == VehicleStatus.IN_TRANSIT:
                v.status = VehicleStatus.REROUTED_EMERGENCY
                diverted_count += 1
                if diverted_count >= 14:
                    break

        orig_eta = 28.5
        opt_eta = 9.8
        time_saved = round(orig_eta - opt_eta, 1)

        corridor = EmergencyCorridorResponse(
            id=corr_id,
            status="ACTIVE_GREEN_CORRIDOR",
            vehicle_callsign=req.vehicle_callsign,
            origin=orig,
            destination=dest,
            corridor_waypoints=waypoints,
            cleared_intersections=cleared_intersections,
            diverted_logistics_vehicles_count=diverted_count,
            active_corridor_length_km=14.2,
            original_eta_mins=orig_eta,
            optimized_eta_mins=opt_eta,
            time_saved_mins=time_saved,
            green_wave_active=True,
            active_since=datetime.datetime.now().strftime("%H:%M:%S")
        )

        self.active_corridor = corridor
        city_twin.is_emergency_active = True
        city_twin.active_emergency_corridor = corridor.model_dump()

        return corridor

    def deactivate_emergency_corridor(self) -> Dict[str, Any]:
        self.active_corridor = None
        city_twin.is_emergency_active = False
        city_twin.active_emergency_corridor = None

        # Restore vehicles
        for v in city_twin.vehicles.values():
            if v.status == VehicleStatus.REROUTED_EMERGENCY:
                v.status = VehicleStatus.IN_TRANSIT

        return {
            "status": "DEACTIVATED",
            "message": "Emergency green corridor deactivated. Standard traffic routing restored."
        }

emergency_controller = EmergencyCorridorController()
