from abc import ABC, abstractmethod
import pandas as pd
from typing import Dict, Any, Optional

class BaseConnector(ABC):
    def __init__(self, source_name: str, config: Optional[Dict[str, Any]] = None):
        self.source_name = source_name
        self.config = config or {}

    @abstractmethod
    def fetch(self, **kwargs) -> pd.DataFrame:
        pass
