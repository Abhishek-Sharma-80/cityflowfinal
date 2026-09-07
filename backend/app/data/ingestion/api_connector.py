import pandas as pd
import httpx
from typing import Optional, Dict, Any
from backend.app.data.ingestion.base_connector import BaseConnector

class APIConnector(BaseConnector):
    def __init__(self, base_url: str, headers: Optional[Dict[str, str]] = None, config: Optional[Dict[str, Any]] = None):
        super().__init__(source_name="REST_API_Connector", config=config)
        self.base_url = base_url
        self.headers = headers or {}

    def fetch(self, endpoint: str = "", params: Optional[Dict[str, Any]] = None, **kwargs) -> pd.DataFrame:
        url = f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        with httpx.Client(timeout=15.0) as client:
            resp = client.get(url, headers=self.headers, params=params)
            resp.raise_for_status()
            data = resp.json()
            if isinstance(data, list):
                return pd.DataFrame(data)
            elif isinstance(data, dict) and "data" in data:
                return pd.DataFrame(data["data"])
            return pd.DataFrame([data])
