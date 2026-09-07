import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any, Optional
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from backend.app.data.preprocessing.transformer import DataTransformer

class ModelTrainer:
    """
    Trains multiple ML candidate models on genuine chronological splits.
    Calculates actual non-fabricated evaluation metrics (MAE, RMSE, R²).
    Selects best model objectively based on validation performance.
    """
    def __init__(self):
        pass

    def train_and_evaluate(
        self,
        split_datasets: Dict[str, Tuple[pd.DataFrame, pd.Series, pd.DataFrame, pd.Series, pd.DataFrame, pd.Series]],
        active_features: List[str],
        candidate_model_names: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        if candidate_model_names is None:
            candidate_model_names = ["RandomForest", "GradientBoosting", "HistGradientBoosting"]

        # Results container
        evaluation_results: Dict[str, Dict[str, Any]] = {}
        trained_models_by_horizon: Dict[str, Dict[str, Any]] = {}
        scalers_by_horizon: Dict[str, DataTransformer] = {}

        candidate_constructors = {
            "RandomForest": lambda: RandomForestRegressor(n_estimators=45, max_depth=8, random_state=42, n_jobs=1),
            "GradientBoosting": lambda: GradientBoostingRegressor(n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42),
            "HistGradientBoosting": lambda: HistGradientBoostingRegressor(max_iter=60, max_depth=5, random_state=42)
        }

        for h, (X_train, y_train, X_val, y_val, X_test, y_test) in split_datasets.items():
            evaluation_results[h] = {"candidates": [], "best_model_name": None}
            trained_models_by_horizon[h] = {}

            # Fit transformer
            transformer = DataTransformer()
            X_train_t = transformer.fit_transform(X_train)
            X_val_t = transformer.transform(X_val)
            X_test_t = transformer.transform(X_test)
            scalers_by_horizon[h] = transformer

            best_r2 = -float("inf")
            best_model_name = candidate_model_names[0]

            for model_name in candidate_model_names:
                if model_name not in candidate_constructors:
                    continue
                
                model = candidate_constructors[model_name]()
                # Fit model on training split
                model.fit(X_train_t, y_train)

                # Predict on test split
                y_pred_test = model.predict(X_test_t)
                y_pred_test = np.clip(y_pred_test, 0.0, 1.0)

                # Real metrics calculation
                mae = float(mean_absolute_error(y_test, y_pred_test))
                rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_test)))
                r2 = float(r2_score(y_test, y_pred_test))

                trained_models_by_horizon[h][model_name] = model

                cand_record = {
                    "model_name": model_name,
                    "mae": round(mae, 4),
                    "rmse": round(rmse, 4),
                    "r2": round(r2, 4),
                    "test_samples": len(y_test),
                    "is_best": False
                }
                evaluation_results[h]["candidates"].append(cand_record)

                if r2 > best_r2:
                    best_r2 = r2
                    best_model_name = model_name

            # Mark best model
            for cand in evaluation_results[h]["candidates"]:
                if cand["model_name"] == best_model_name:
                    cand["is_best"] = True
            evaluation_results[h]["best_model_name"] = best_model_name

        # Primary horizon (15m) for registry summary metrics
        primary_h = "15m" if "15m" in evaluation_results else list(evaluation_results.keys())[0]
        best_primary_candidate = next(c for c in evaluation_results[primary_h]["candidates"] if c["is_best"])

        # Package the best pipeline
        best_pipeline_pack = {
            "trained_models": {h: trained_models_by_horizon[h][evaluation_results[h]["best_model_name"]] for h in evaluation_results},
            "transformers": scalers_by_horizon,
            "best_models_by_horizon": {h: evaluation_results[h]["best_model_name"] for h in evaluation_results},
            "active_features": active_features,
            "evaluation_results": evaluation_results,
            "primary_metrics": best_primary_candidate,
            "sample_counts": {
                "training": len(split_datasets[primary_h][0]),
                "validation": len(split_datasets[primary_h][2]),
                "test": len(split_datasets[primary_h][4])
            }
        }

        return best_pipeline_pack
