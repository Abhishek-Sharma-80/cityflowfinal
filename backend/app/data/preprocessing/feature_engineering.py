import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Any, Optional

class FeatureEngineer:
    """
    Dynamic Feature Engineering Engine.
    Strict rule: ONLY incorporates features when authentic source data exists.
    Auto-detects active vs excluded features.
    """
    def __init__(self):
        self.active_features: List[str] = []
        self.feature_metadata: Dict[str, Any] = {}

    def extract_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str], Dict[str, Any]]:
        df_feat = df.copy()
        
        # Ensure timestamp datetime format
        if "timestamp" in df_feat.columns:
            if not pd.api.types.is_datetime64_any_dtype(df_feat["timestamp"]):
                df_feat["timestamp"] = pd.to_datetime(df_feat["timestamp"], errors="coerce")

        active_feats: List[str] = []
        meta: Dict[str, Any] = {}

        # 1. Temporal features (derived from real timestamp)
        if "timestamp" in df_feat.columns:
            df_feat["hour_of_day"] = df_feat["timestamp"].dt.hour + (df_feat["timestamp"].dt.minute / 60.0)
            df_feat["day_of_week"] = df_feat["timestamp"].dt.dayofweek
            df_feat["is_weekend"] = (df_feat["day_of_week"] >= 5).astype(float)
            # Cyclical encodings
            df_feat["sin_hour"] = np.sin(2 * np.pi * df_feat["hour_of_day"] / 24.0)
            df_feat["cos_hour"] = np.cos(2 * np.pi * df_feat["hour_of_day"] / 24.0)

            active_feats.extend(["hour_of_day", "day_of_week", "is_weekend", "sin_hour", "cos_hour"])
            meta["temporal_features"] = "ENABLED"
        else:
            meta["temporal_features"] = "EXCLUDED_NO_TIMESTAMP"

        # 2. Road speed & volume features
        if "current_speed_kmh" in df_feat.columns:
            active_feats.append("current_speed_kmh")
            meta["current_speed"] = "ENABLED"

        if "volume_vph" in df_feat.columns:
            active_feats.append("volume_vph")
            meta["volume_vph"] = "ENABLED"

        if "free_flow_speed_kmh" in df_feat.columns and "current_speed_kmh" in df_feat.columns:
            df_feat["speed_ratio"] = (df_feat["current_speed_kmh"] / df_feat["free_flow_speed_kmh"].clip(lower=1.0)).clip(0.0, 1.5)
            active_feats.append("speed_ratio")
            meta["speed_ratio"] = "ENABLED"

        if "congestion_level" in df_feat.columns:
            active_feats.append("congestion_level")
            meta["congestion_level"] = "ENABLED"

        if "traffic_density" in df_feat.columns:
            active_feats.append("traffic_density")
            meta["traffic_density"] = "ENABLED"

        if "occupancy_pct" in df_feat.columns:
            active_feats.append("occupancy_pct")
            meta["occupancy_pct"] = "ENABLED"

        # 3. Weather features (conditional on presence)
        for w_col in ["temperature_c", "rainfall_mm", "visibility_km"]:
            if w_col in df_feat.columns and df_feat[w_col].notna().sum() > 0:
                active_feats.append(w_col)
                meta[w_col] = "ENABLED"
            else:
                meta[w_col] = "EXCLUDED_NO_SOURCE_DATA"

        # 4. Incident features (conditional on presence)
        for inc_col in ["incident_active", "incident_severity"]:
            if inc_col in df_feat.columns and df_feat[inc_col].notna().sum() > 0:
                active_feats.append(inc_col)
                meta[inc_col] = "ENABLED"
            else:
                meta[inc_col] = "EXCLUDED_NO_SOURCE_DATA"

        # 5. Logistics demand & parking pressure (conditional)
        for log_col in ["logistics_volume_norm", "parking_pressure"]:
            if log_col in df_feat.columns and df_feat[log_col].notna().sum() > 0:
                active_feats.append(log_col)
                meta[log_col] = "ENABLED"
            else:
                meta[log_col] = "EXCLUDED_NO_SOURCE_DATA"

        # 6. Lag features if road_segment_id and timestamp exist
        if "road_segment_id" in df_feat.columns and "timestamp" in df_feat.columns and "current_speed_kmh" in df_feat.columns:
            df_feat = df_feat.sort_values(by=["road_segment_id", "timestamp"])
            df_feat["lag_1_speed"] = df_feat.groupby("road_segment_id")["current_speed_kmh"].shift(1)
            df_feat["lag_1_volume"] = df_feat.groupby("road_segment_id")["volume_vph"].shift(1) if "volume_vph" in df_feat.columns else 0.0
            
            # Fill first step lag with current
            df_feat["lag_1_speed"] = df_feat["lag_1_speed"].fillna(df_feat["current_speed_kmh"])
            if "volume_vph" in df_feat.columns:
                df_feat["lag_1_volume"] = df_feat["lag_1_volume"].fillna(df_feat["volume_vph"])
                active_feats.append("lag_1_volume")
            active_feats.append("lag_1_speed")
            meta["lag_features"] = "ENABLED"

        self.active_features = list(dict.fromkeys(active_feats)) # preserve order & unique
        self.feature_metadata = meta

        return df_feat, self.active_features, meta
