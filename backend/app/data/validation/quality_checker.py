import pandas as pd
import numpy as np
from typing import Dict, Any, List

class QualityChecker:
    """
    Analyzes dataset quality, completeness, duplicate records, timestamp consistency, and range metrics.
    """
    def __init__(self):
        pass

    def check(self, df: pd.DataFrame) -> Dict[str, Any]:
        total_rows = len(df)
        if total_rows == 0:
            return {
                "total_rows": 0,
                "valid_rows": 0,
                "invalid_rows": 0,
                "missing_values_by_column": {},
                "duplicate_count": 0,
                "unique_road_segments": 0,
                "road_segment_ids": [],
                "time_range": {"start": None, "end": None, "span_hours": 0},
                "quality_score_pct": 0.0,
                "status": "EMPTY"
            }

        # Duplicates
        duplicate_mask = df.duplicated()
        duplicate_count = int(duplicate_mask.sum())

        # Missingness
        missing_by_col = {col: int(df[col].isna().sum()) for col in df.columns}
        total_missing = sum(missing_by_col.values())

        # Timestamp validation & time range
        time_range = {"start": None, "end": None, "span_hours": 0.0}
        valid_timestamps = 0
        if "timestamp" in df.columns:
            try:
                parsed_ts = pd.to_datetime(df["timestamp"], errors="coerce")
                valid_timestamps = int(parsed_ts.notna().sum())
                if valid_timestamps > 0:
                    min_ts = parsed_ts.min()
                    max_ts = parsed_ts.max()
                    span_secs = (max_ts - min_ts).total_seconds()
                    time_range = {
                        "start": min_ts.strftime("%Y-%m-%d %H:%M:%S"),
                        "end": max_ts.strftime("%Y-%m-%d %H:%M:%S"),
                        "span_hours": round(span_secs / 3600.0, 2)
                    }
            except Exception:
                pass

        # Road segments
        unique_roads = 0
        road_ids: List[str] = []
        if "road_segment_id" in df.columns:
            unique_roads = int(df["road_segment_id"].nunique())
            road_ids = [str(x) for x in df["road_segment_id"].dropna().unique()[:20]]

        # Speed and volume sanity checks
        invalid_speed_count = 0
        if "current_speed_kmh" in df.columns:
            invalid_speed_count = int(((df["current_speed_kmh"] < 0) | (df["current_speed_kmh"] > 250)).sum())

        invalid_volume_count = 0
        if "volume_vph" in df.columns:
            invalid_volume_count = int(((df["volume_vph"] < 0) | (df["volume_vph"] > 15000)).sum())

        invalid_rows = int(duplicate_count + (total_rows - valid_timestamps if "timestamp" in df.columns else 0) + invalid_speed_count + invalid_volume_count)
        invalid_rows = min(total_rows, invalid_rows)
        valid_rows = max(0, total_rows - invalid_rows)

        # Overall quality score (0 to 100%)
        missing_penalty = min(30.0, (total_missing / (total_rows * max(1, len(df.columns)))) * 100.0)
        invalid_penalty = min(50.0, (invalid_rows / total_rows) * 100.0)
        quality_score = max(0.0, round(100.0 - missing_penalty - invalid_penalty, 2))

        return {
            "total_rows": total_rows,
            "valid_rows": valid_rows,
            "invalid_rows": invalid_rows,
            "missing_values_by_column": missing_by_col,
            "duplicate_count": duplicate_count,
            "unique_road_segments": unique_roads,
            "road_segment_ids": road_ids,
            "time_range": time_range,
            "quality_score_pct": quality_score,
            "status": "VALID" if quality_score >= 70.0 and total_rows >= 100 else "DEGRADED" if quality_score >= 40.0 else "REJECTED"
        }
