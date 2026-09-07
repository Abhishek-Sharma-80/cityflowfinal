import pandas as pd
import os
from typing import Optional, Dict, Any
from backend.app.data.ingestion.base_connector import BaseConnector

class CSVConnector(BaseConnector):
    def __init__(self, file_path: Optional[str] = None, config: Optional[Dict[str, Any]] = None):
        super().__init__(source_name="CSV_Connector", config=config)
        self.file_path = file_path

    def fetch(self, file_path: Optional[str] = None, **kwargs) -> pd.DataFrame:
        target_path = file_path or self.file_path
        if not target_path or not os.path.exists(target_path):
            raise FileNotFoundError(f"CSV source not found at: {target_path}")
        return pd.read_csv(target_path)
