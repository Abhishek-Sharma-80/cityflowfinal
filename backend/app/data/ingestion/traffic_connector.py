import pandas as pd
from typing import Optional, Dict, Any, List
from backend.app.data.ingestion.base_connector import BaseConnector

class TrafficConnector(BaseConnector):
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__(source_name="Traffic_Sensor_Feed_Connector", config=config)

    def fetch(self, raw_feed: Optional[List[Dict[str, Any]]] = None, **kwargs) -> pd.DataFrame:
        if not raw_feed:
            return pd.DataFrame(columns=["road_segment_id", "timestamp", "volume_vph", "current_speed_kmh", "occupancy_pct"])
        return pd.DataFrame(raw_feed)
