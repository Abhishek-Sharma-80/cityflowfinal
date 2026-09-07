import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from backend.app.models.schemas import PredictionContributingFactor

class XAIExplainer:
    """
    Explainable AI Engine for Traffic Predictions.
    Calculates feature importance, directional impact, and human-interpretable reasoning.
    """
    def __init__(self):
        pass

    def explain_prediction(
        self,
        model: Any,
        feature_names: List[str],
        sample_values: Dict[str, float],
        predicted_congestion: float
    ) -> List[PredictionContributingFactor]:
        factors: List[PredictionContributingFactor] = []

        # Extract tree feature importances if available
        importances = getattr(model, "feature_importances_", None)
        if importances is None or len(importances) != len(feature_names):
            importances = np.ones(len(feature_names)) / max(1, len(feature_names))

        total_imp = float(np.sum(importances))
        if total_imp > 0:
            norm_imp = importances / total_imp
        else:
            norm_imp = np.ones(len(feature_names)) / len(feature_names)

        # Sort features by importance descending
        sorted_indices = np.argsort(-norm_imp)[:5]

        for idx in sorted_indices:
            f_name = feature_names[idx]
            val = float(sample_values.get(f_name, 0.0))
            weight = float(norm_imp[idx])
            weight_pct = round(weight * 100.0, 1)

            # Directional impact logic based on feature semantics
            if f_name in ["current_speed_kmh", "speed_ratio", "visibility_km"]:
                # Lower speed or visibility increases congestion
                impact_dir = "INCREASING_CONGESTION" if val < 0.6 else "DECREASING_CONGESTION"
            elif f_name in ["volume_vph", "traffic_density", "congestion_level", "occupancy_pct", "incident_active", "incident_severity", "rainfall_mm"]:
                # Higher values increase congestion
                impact_dir = "INCREASING_CONGESTION" if val > 0.3 else "DECREASING_CONGESTION"
            else:
                impact_dir = "INCREASING_CONGESTION" if predicted_congestion > 0.5 else "DECREASING_CONGESTION"

            desc_map = {
                "current_speed_kmh": f"Observed speed ({val:.1f} km/h) relative to free-flow limits.",
                "speed_ratio": f"Velocity deficit ratio ({val:.2f}) indicates road impedance.",
                "volume_vph": f"Traffic volume ({val:.0f} vph) approaching capacity threshold.",
                "traffic_density": f"High vehicle concentration per lane kilometer.",
                "congestion_level": f"Current baseline congestion state ({val*100:.1f}%).",
                "incident_severity": f"Active road incident obstruction severity ({val:.2f}).",
                "rainfall_mm": f"Precipitation ({val:.1f} mm) reducing road traction and capacity.",
                "hour_of_day": f"Temporal diurnal peak distribution at hour {val:.1f}.",
                "day_of_week": f"Weekday commercial freight surge factor."
            }
            desc = desc_map.get(f_name, f"Feature '{f_name}' contributed {weight_pct}% to prediction.")

            factors.append(PredictionContributingFactor(
                factor=f_name,
                impact_pct=weight_pct,
                feature_name=f_name,
                weight_pct=weight_pct,
                impact_direction=impact_dir,
                description=desc
            ))

        return factors

xai_explainer = XAIExplainer()
