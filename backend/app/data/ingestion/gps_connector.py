import pandas as pd
from typing import List, Dict, Any, Optional
from backend.app.data.ingestion.base_connector import BaseConnector

class GPSConnector(BaseConnector):
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__(source_name="GPS_Telematics_Connector", config=config)

    def fetch(self, pings: Optional[List[Dict[str, Any]]] = None, **kwargs) -> pd.DataFrame:
        if not pings:
            return pd.DataFrame(columns=["vehicle_id", "timestamp", "lat", "lng", "speed_kmh", "heading", "battery_or_fuel_pct"])
        return pd.DataFrame(pings)
