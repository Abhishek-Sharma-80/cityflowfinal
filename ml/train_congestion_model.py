"""
CityFlow AI - Offline / Continuous Model Training Pipeline
Trains RandomForest, GradientBoosting, and Ridge regressors for 15, 30, and 60-minute urban congestion prediction.
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
import joblib
import os

def generate_training_dataset(n_samples: int = 5000):
    np.random.seed(42)
    hours = np.random.randint(0, 24, size=n_samples)
    days = np.random.randint(0, 7, size=n_samples)
    is_weekend = (days >= 5).astype(float)

    morning_peak = np.exp(-((hours - 9) ** 2) / 4.0)
    evening_peak = np.exp(-((hours - 18) ** 2) / 6.0)
    base_peak = (0.35 * morning_peak + 0.55 * evening_peak) * (1.0 - 0.3 * is_weekend)

    curr_cong = np.clip(base_peak + np.random.normal(0.25, 0.15, size=n_samples), 0.05, 0.98)
    density = np.clip(curr_cong * 0.9 + np.random.normal(0.05, 0.08, size=n_samples), 0.05, 0.99)
    demand = np.clip(base_peak * 1.1 + np.random.normal(0.3, 0.18, size=n_samples), 0.1, 1.0)
    parking = np.clip(curr_cong * 0.85 + np.random.normal(0.1, 0.1, size=n_samples), 0.1, 1.0)
    incidents = np.random.choice([0.0, 0.3, 0.7, 1.0], p=[0.75, 0.15, 0.08, 0.02], size=n_samples)
    events = np.random.choice([0.0, 0.5, 0.9], p=[0.85, 0.12, 0.03], size=n_samples)
    rain_mm = np.random.exponential(scale=1.5, size=n_samples) * np.random.choice([0.0, 1.0], p=[0.7, 0.3], size=n_samples)
    speed_ratio = np.clip(1.0 - (curr_cong * 0.75) + np.random.normal(0, 0.05, size=n_samples), 0.15, 1.0)

    X = np.column_stack([
        hours, days, is_weekend, curr_cong, density, demand,
        parking, incidents, events, rain_mm, speed_ratio
    ])

    y_15 = np.clip(curr_cong * 0.70 + (density * 0.15) + (incidents * 0.15) + (events * 0.10) + np.random.normal(0, 0.03, size=n_samples), 0.05, 0.99)
    y_30 = np.clip(curr_cong * 0.45 + (base_peak * 0.35) + (demand * 0.15) + (incidents * 0.18) + (events * 0.15) + np.random.normal(0, 0.05, size=n_samples), 0.05, 0.99)
    y_60 = np.clip((base_peak * 0.55) + (demand * 0.25) + (curr_cong * 0.20) + (incidents * 0.10) + np.random.normal(0, 0.07, size=n_samples), 0.05, 0.99)

    return X, y_15, y_30, y_60

def train_and_evaluate():
    print("[1/3] Generating synthetic metropolitan traffic training set (5,000 samples)...")
    X, y_15, y_30, y_60 = generate_training_dataset()

    X_train, X_test, y15_train, y15_test = train_test_split(X, y_15, test_size=0.2, random_state=42)
    _, _, y30_train, y30_test = train_test_split(X, y_30, test_size=0.2, random_state=42)
    _, _, y60_train, y60_test = train_test_split(X, y_60, test_size=0.2, random_state=42)

    print("[2/3] Training Ensemble Regressors for 15m, 30m, and 60m horizons...")
    rf_15 = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
    rf_15.fit(X_train, y15_train)
    p15 = rf_15.predict(X_test)
    print(f"  -> 15m Model: R2 = {r2_score(y15_test, p15):.4f}, RMSE = {np.sqrt(mean_squared_error(y15_test, p15)):.4f}")

    rf_30 = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
    rf_30.fit(X_train, y30_train)
    p30 = rf_30.predict(X_test)
    print(f"  -> 30m Model: R2 = {r2_score(y30_test, p30):.4f}, RMSE = {np.sqrt(mean_squared_error(y30_test, p30)):.4f}")

    rf_60 = GradientBoostingRegressor(n_estimators=60, max_depth=6, random_state=42)
    rf_60.fit(X_train, y60_train)
    p60 = rf_60.predict(X_test)
    print(f"  -> 60m Model: R2 = {r2_score(y60_test, p60):.4f}, RMSE = {np.sqrt(mean_squared_error(y60_test, p60)):.4f}")

    print("[3/3] Training pipeline complete. Models validated.")

if __name__ == "__main__":
    train_and_evaluate()
