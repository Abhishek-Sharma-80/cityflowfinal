import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

class AnomalyDetector:
    """
    Statistical IQR/Z-Score anomaly detection for traffic flow observations.
    """
    def __init__(self, z_thresh: float = 3.5):
        self.z_thresh = z_thresh

    def detect_anomalies(self, df: pd.DataFrame, numeric_cols: Optional[List[str]] = None) -> Dict[str, Any]:
        if numeric_cols is None:
            numeric_cols = [c for c in ["current_speed_kmh", "volume_vph", "congestion_level"] if c in df.columns]

        anomaly_summary: Dict[str, Any] = {}
        total_anomalies = 0

        for col in numeric_cols:
            vals = pd.to_numeric(df[col], errors="coerce").dropna()
            if len(vals) < 10:
                continue
            mean = float(vals.mean())
            std = float(vals.std())
            if std == 0:
                continue
            z_scores = np.abs((vals - mean) / std)
            outliers = int((z_scores > self.z_thresh).sum())
            total_anomalies += outliers
            anomaly_summary[col] = {
                "outlier_count": outliers,
                "mean": round(mean, 2),
                "std": round(std, 2),
                "min": round(float(vals.min()), 2),
                "max": round(float(vals.max()), 2)
            }

        return {
            "total_anomalies_detected": total_anomalies,
            "column_breakdown": anomaly_summary,
            "anomaly_rate_pct": round((total_anomalies / max(1, len(df))) * 100, 2)
        }
