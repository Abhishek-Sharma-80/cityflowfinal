import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Any, Optional
from datetime import timedelta
from backend.app.data.preprocessing.cleaner import DataCleaner
from backend.app.data.preprocessing.feature_engineering import FeatureEngineer

class MLDataPipeline:
    """
    Constructs genuine training matrices from chronological traffic observations.
    - Zero random data generation.
    - Auto-generates future ground-truth targets strictly when real future observations exist.
    - Strict chronological splitting (Train -> Val -> Test) to eliminate data leakage.
    """
    def __init__(self, min_samples_required: int = 150):
        self.min_samples_required = min_samples_required
        self.cleaner = DataCleaner()
        self.feature_engineer = FeatureEngineer()

    def prepare_training_dataset(
        self,
        df: pd.DataFrame,
        horizons: List[str] = ["15m", "30m", "60m"]
    ) -> Tuple[Dict[str, Tuple[pd.DataFrame, pd.Series, pd.DataFrame, pd.Series, pd.DataFrame, pd.Series]], List[str], Dict[str, Any]]:
        """
        Processes raw DataFrame and returns chronological train/val/test splits for each requested horizon.
        """
        # 1. Clean
        df_clean, final_rows, dropped = self.cleaner.clean(df)
        if final_rows < self.min_samples_required:
            raise ValueError(f"Insufficient historical data ({final_rows} valid rows). Minimum {self.min_samples_required} required for reliable ML training.")

        # 2. Extract features
        df_feat, active_features, feat_meta = self.feature_engineer.extract_features(df_clean)

        horizon_steps = {
            "15m": (1, timedelta(minutes=15)),
            "30m": (2, timedelta(minutes=30)),
            "60m": (4, timedelta(minutes=60))
        }

        split_datasets: Dict[str, Tuple[pd.DataFrame, pd.Series, pd.DataFrame, pd.Series, pd.DataFrame, pd.Series]] = {}

        # Target variable: future congestion_level or 1 - speed_ratio
        if "congestion_level" not in df_feat.columns and "current_speed_kmh" in df_feat.columns and "free_flow_speed_kmh" in df_feat.columns:
            df_feat["congestion_level"] = (1.0 - (df_feat["current_speed_kmh"] / df_feat["free_flow_speed_kmh"].clip(lower=1.0))).clip(0.0, 1.0)

        df_sorted = df_feat.sort_values(by=["road_segment_id", "timestamp"]).reset_index(drop=True)

        for h in horizons:
            if h not in horizon_steps:
                continue
            steps_shift, delta = horizon_steps[h]

            # Vectorized future target and future timestamp shift per road_segment_id
            df_h = df_sorted.copy()
            df_h["target_val"] = df_h.groupby("road_segment_id")["congestion_level"].shift(-steps_shift)
            df_h["target_ts"] = df_h.groupby("road_segment_id")["timestamp"].shift(-steps_shift)

            # Keep only rows where future observation exists at exactly timestamp + delta
            valid_mask = df_h["target_val"].notna() & ((df_h["target_ts"] - df_h["timestamp"]) == delta)
            df_valid = df_h[valid_mask].copy()

            if len(df_valid) < self.min_samples_required:
                raise ValueError(f"Insufficient historical pairs for horizon {h} ({len(df_valid)} pairs found).")

            X = df_valid[active_features].fillna(0.0)
            y = df_valid["target_val"]

            # 4. Strict Chronological Split (70% Train, 15% Val, 15% Test)
            n = len(X)
            train_end = int(n * 0.70)
            val_end = int(n * 0.85)

            X_train, y_train = X.iloc[:train_end], y.iloc[:train_end]
            X_val, y_val = X.iloc[train_end:val_end], y.iloc[train_end:val_end]
            X_test, y_test = X.iloc[val_end:], y.iloc[val_end:]

            split_datasets[h] = (X_train, y_train, X_val, y_val, X_test, y_test)

        summary_meta = {
            "total_raw_rows": len(df),
            "cleaned_rows": final_rows,
            "active_features_count": len(active_features),
            "active_features": active_features,
            "feature_metadata": feat_meta,
            "horizons_generated": list(split_datasets.keys())
        }

        return split_datasets, active_features, summary_meta
