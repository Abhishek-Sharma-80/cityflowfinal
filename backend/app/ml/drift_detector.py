import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional

class DataDriftDetector:
    """
    Monitors data distribution stability between training baseline and live inference data.
    """
    def __init__(self, drift_threshold: float = 0.25):
        self.drift_threshold = drift_threshold

    def calculate_drift(self, baseline_df: pd.DataFrame, current_df: pd.DataFrame, numeric_cols: Optional[List[str]] = None) -> Dict[str, Any]:
        if numeric_cols is None:
            numeric_cols = [c for c in ["current_speed_kmh", "volume_vph", "congestion_level"] if c in baseline_df.columns and c in current_df.columns]

        drift_results: Dict[str, Any] = {}
        drift_detected = False

        for col in numeric_cols:
            b_vals = pd.to_numeric(baseline_df[col], errors="coerce").dropna()
            c_vals = pd.to_numeric(current_df[col], errors="coerce").dropna()

            if len(b_vals) < 10 or len(c_vals) < 10:
                continue

            b_mean, b_std = float(b_vals.mean()), float(b_vals.std())
            c_mean, c_std = float(c_vals.mean()), float(c_vals.std())

            # Mean shift normalized by baseline std
            mean_shift = abs(c_mean - b_mean) / max(0.01, b_std)
            is_col_drift = mean_shift > self.drift_threshold

            if is_col_drift:
                drift_detected = True

            drift_results[col] = {
                "baseline_mean": round(b_mean, 2),
                "current_mean": round(c_mean, 2),
                "normalized_mean_shift": round(mean_shift, 3),
                "drift_detected": is_col_drift
            }

        return {
            "data_drift_detected": drift_detected,
            "monitored_features_count": len(drift_results),
            "feature_metrics": drift_results
        }
