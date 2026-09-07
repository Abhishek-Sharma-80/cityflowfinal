import pandas as pd
import os
import json
from typing import Optional, Dict, Any, Union
from backend.app.data.ingestion.base_connector import BaseConnector

class JSONConnector(BaseConnector):
    def __init__(self, file_path: Optional[str] = None, config: Optional[Dict[str, Any]] = None):
        super().__init__(source_name="JSON_Connector", config=config)
        self.file_path = file_path

    def fetch(self, file_path: Optional[str] = None, raw_data: Optional[Union[dict, list]] = None, **kwargs) -> pd.DataFrame:
        if raw_data is not None:
            return pd.DataFrame(raw_data)
        target_path = file_path or self.file_path
        if not target_path or not os.path.exists(target_path):
            raise FileNotFoundError(f"JSON source not found at: {target_path}")
        with open(target_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return pd.DataFrame(data)
