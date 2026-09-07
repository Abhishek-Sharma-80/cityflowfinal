import pandas as pd
from typing import Tuple, List

class DataCleaner:
    """
    Cleans raw imported data: parses timestamps, sorts chronologically, removes duplicates, drops corrupt records.
    """
    def __init__(self):
        pass

    def clean(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int, int]:
        initial_count = len(df)
        if initial_count == 0:
            return df, 0, 0

        # Drop exact duplicate rows
        df_clean = df.drop_duplicates().copy()

        # Parse timestamp
        if "timestamp" in df_clean.columns:
            df_clean["timestamp"] = pd.to_datetime(df_clean["timestamp"], errors="coerce")
            df_clean = df_clean.dropna(subset=["timestamp"])
            # Chronological sort
            df_clean = df_clean.sort_values(by=["timestamp", "road_segment_id"] if "road_segment_id" in df_clean.columns else ["timestamp"])

        # Numerical cleaning
        for num_col in ["current_speed_kmh", "volume_vph", "free_flow_speed_kmh", "congestion_level"]:
            if num_col in df_clean.columns:
                df_clean[num_col] = pd.to_numeric(df_clean[num_col], errors="coerce")

        # Drop records missing critical target/speed/road
        critical_cols = [c for c in ["road_segment_id", "current_speed_kmh", "volume_vph"] if c in df_clean.columns]
        if critical_cols:
            df_clean = df_clean.dropna(subset=critical_cols)

        # Reset index
        df_clean = df_clean.reset_index(drop=True)
        final_count = len(df_clean)
        dropped_count = initial_count - final_count

        return df_clean, final_count, dropped_count
