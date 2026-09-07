import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from sklearn.preprocessing import StandardScaler

class DataTransformer:
    """
    Normalizes and transforms feature matrices for ML model consumption.
    """
    def __init__(self):
        self.scaler = StandardScaler()
        self.is_fitted = False

    def fit_transform(self, X: pd.DataFrame) -> pd.DataFrame:
        cols = X.columns
        scaled = self.scaler.fit_transform(X)
        self.is_fitted = True
        return pd.DataFrame(scaled, columns=cols, index=X.index)

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        if not self.is_fitted:
            return X
        cols = X.columns
        scaled = self.scaler.transform(X)
        return pd.DataFrame(scaled, columns=cols, index=X.index)
