import pandas as pd
from typing import Dict, List, Any, Tuple, Optional

REQUIRED_TRAFFIC_COLUMNS = ["timestamp", "road_segment_id", "volume_vph", "current_speed_kmh"]
OPTIONAL_TRAFFIC_COLUMNS = [
    "road_name", "free_flow_speed_kmh", "congestion_level", "traffic_density",
    "occupancy_pct", "incident_active", "incident_severity", "temperature_c",
    "rainfall_mm", "visibility_km", "logistics_volume_norm", "parking_pressure"
]

class SchemaValidator:
    """
    Validates uploaded and ingested dataset schemas against standard specifications.
    """
    def __init__(self, required_columns: Optional[List[str]] = None):
        self.required_columns = required_columns or REQUIRED_TRAFFIC_COLUMNS

    def validate(self, df: pd.DataFrame) -> Tuple[bool, List[str], Dict[str, Any]]:
        errors: List[str] = []
        schema_info: Dict[str, Any] = {
            "total_columns": len(df.columns),
            "columns": list(df.columns),
            "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "matched_required": [],
            "missing_required": [],
            "optional_found": []
        }

        # Check required columns
        for col in self.required_columns:
            if col in df.columns:
                schema_info["matched_required"].append(col)
            else:
                schema_info["missing_required"].append(col)
                errors.append(f"Missing required column: '{col}'")

        # Check optional columns
        for col in OPTIONAL_TRAFFIC_COLUMNS:
            if col in df.columns:
                schema_info["optional_found"].append(col)

        is_valid = len(errors) == 0
        return is_valid, errors, schema_info
