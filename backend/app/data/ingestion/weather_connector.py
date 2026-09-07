import os
import pandas as pd
import httpx
from typing import Optional, Dict, Any

class WeatherConnector:
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.source_name = "Weather_API_Connector"
        self.api_key = os.getenv("WEATHER_API_KEY", "")

    def fetch(self, lat: float = 12.9716, lng: float = 77.5946, **kwargs) -> pd.DataFrame:
        if self.api_key:
            try:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={self.api_key}&units=metric"
                with httpx.Client(timeout=10.0) as client:
                    resp = client.get(url)
                    if resp.status_code == 200:
                        d = resp.json()
                        return pd.DataFrame([{
                            "timestamp": pd.Timestamp.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                            "temperature_c": d.get("main", {}).get("temp", 25.0),
                            "rainfall_mm": d.get("rain", {}).get("1h", 0.0),
                            "visibility_km": d.get("visibility", 10000) / 1000.0,
                            "humidity_pct": d.get("main", {}).get("humidity", 50.0)
                        }])
            except Exception:
                pass
        return pd.DataFrame(columns=["timestamp", "temperature_c", "rainfall_mm", "visibility_km", "humidity_pct"])
