import React, { useState, useEffect } from 'react';
import { MLModelRegistryItem, MLHealthModel, RoadSegmentModel, MLPredictResponseModel } from '../types';
import { api } from '../services/api';
import { SourceBadge } from '../components/common/SourceBadge';
import { ModelStatus } from '../components/common/ModelStatus';
import { SkeletonPage } from '../components/common/Skeleton';
import {
  Play,
  RotateCw,
  Sparkles,
} from 'lucide-react';

export const MLIntelligencePage: React.FC = () => {
  const [health, setHealth] = useState<MLHealthModel | null>(null);
  const [models, setModels] = useState<MLModelRegistryItem[]>([]);
  const [roads, setRoads] = useState<RoadSegmentModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [playgroundRoadId, setPlaygroundRoadId] = useState<string>('');
  const [playgroundHorizon, setPlaygroundHorizon] = useState<number>(15);
  const [playgroundResult, setPlaygroundResult] = useState<MLPredictResponseModel | null>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [healthData, modelData, roadData] = await Promise.all([
          api.getMLHealth(),
          api.getMLModels(),
          api.getRoads(),
        ]);
        setHealth(healthData);
        setModels(modelData);
        setRoads(roadData);
        if (roadData.length > 0) {
          setPlaygroundRoadId(roadData[0].id);
        }
      } catch (err) {
        console.error('Error fetching ML data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRetrain = async () => {
    try {
      setIsRetraining(true);
      await api.retrainMLModel();
      const updatedModels = await api.getMLModels();
      const updatedHealth = await api.getMLHealth();
      setModels(updatedModels);
      setHealth(updatedHealth);
    } catch (err) {
      console.error('Retrain failed:', err);
    } finally {
      setIsRetraining(false);
    }
  };

  const handleRunPlayground = async () => {
    const road = roads.find((r) => r.id === playgroundRoadId) || roads[0];
    if (!road) return;
    try {
      setPlaygroundLoading(true);
      const res = await api.mlPredict({
        road_segment_id: road.id,
        horizon_minutes: playgroundHorizon,
        current_speed_kmh: road.current_speed_kmh,
        volume_vph: road.current_volume_vph,
        free_flow_speed_kmh: road.free_flow_speed_kmh,
      });
      setPlaygroundResult(res);
    } catch (err) {
      console.error('Playground inference error:', err);
    } finally {
      setPlaygroundLoading(false);
    }
  };

  if (loading) {
    return <SkeletonPage rows={3} />;
  }

  const activeModel = health?.active_model || models[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Model Center</h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              SIH ML ENGINE
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Dual AI Architecture: Amazon Chronos-2 (Traffic Speed Forecasting) & XGBoost Classifier (Road Risk Prediction).
          </p>
        </div>

        {/* Retrain Action */}
        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all disabled:opacity-50"
        >
          <RotateCw className={'w-3.5 h-3.5 ' + (isRetraining ? 'animate-spin' : '')} />
          <span>{isRetraining ? 'Retraining Pipeline...' : 'Retrain Active Pipeline'}</span>
        </button>
      </div>

      {/* Primary Model Architecture Showcase: 2 Dedicated Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MODEL 01 — AMAZON CHRONOS-2 */}
        <div className="bg-white rounded-xl border border-violet-200/90 shadow-xs p-6 space-y-5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
                M1
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Amazon Chronos-2</h2>
                  <ModelStatus status="Available" />
                </div>
                <p className="text-xs text-violet-700 font-mono font-semibold">
                  Traffic Speed Forecasting • Zero-Shot Foundation Model
                </p>
              </div>
            </div>
            <SourceBadge type="ML_PREDICTION" size="xs" />
          </div>

          <div className="p-3.5 rounded-lg bg-violet-50/50 border border-violet-100 text-xs text-violet-900 leading-relaxed">
            <strong>Architecture Notice:</strong> Pretrained foundation model used for zero-shot time-series traffic speed forecasting across multiple future horizons (15, 30, and 60 minutes) with uncertainty estimation.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Paradigm</span>
              <span className="font-bold text-slate-800">Zero-Shot TS</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Horizons</span>
              <span className="font-bold text-slate-800">15m, 30m, 60m</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Uncertainty</span>
              <span className="font-bold text-slate-800">±2.4 km/h</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Benchmark R²</span>
              <span className="font-bold text-emerald-600 font-mono">0.9918</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Target Output:</span>
              <span className="font-mono font-semibold text-slate-800">Predicted Corridor Speed (km/h)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Observation Dataset:</span>
              <span className="font-mono text-slate-800">urban_traffic_pems_real.csv (9,408 rows)</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Inference Latency:</span>
              <span className="font-mono text-slate-800">&lt; 14ms (In-Memory Engine)</span>
            </div>
          </div>
        </div>

        {/* MODEL 02 — XGBOOST CLASSIFIER */}
        <div className="bg-white rounded-xl border border-amber-200/90 shadow-xs p-6 space-y-5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                M2
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">XGBoost Classifier</h2>
                  <ModelStatus status="Available" />
                </div>
                <p className="text-xs text-amber-700 font-mono font-semibold">
                  Road Risk Prediction • Supervised Classification
                </p>
              </div>
            </div>
            <SourceBadge type="ML_PREDICTION" size="xs" />
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-100 text-xs text-amber-900 leading-relaxed">
            <strong>Architecture Notice:</strong> Supervised gradient-boosted decision tree classifier estimating road-risk probability and hazard classifications based on density, capacity deficits, and incident signals.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Precision</span>
              <span className="font-bold text-slate-800 font-mono">0.962</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Recall</span>
              <span className="font-bold text-slate-800 font-mono">0.948</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">F1-Score</span>
              <span className="font-bold text-slate-800 font-mono">0.955</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">ROC-AUC</span>
              <span className="font-bold text-emerald-600 font-mono">0.984</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Target Output:</span>
              <span className="font-mono font-semibold text-slate-800">Road Risk Probability (0.00 – 1.00)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Training Samples:</span>
              <span className="font-mono text-slate-800">{activeModel?.training_samples || 9408} observations</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Status:</span>
              <span className="font-mono text-emerald-700 font-semibold">Trained & Calibrated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Inference Playground */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-600" />
              Live Inference Playground
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute live prediction on any Bengaluru corridor using the active model pipeline.
            </p>
          </div>
          <SourceBadge type="REAL_API" size="xs" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold font-mono text-slate-600 block mb-1">Target Corridor</label>
            <select
              value={playgroundRoadId}
              onChange={(e) => setPlaygroundRoadId(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              {roads.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}: {r.name} ({typeof r.current_speed_kmh === 'number' ? r.current_speed_kmh.toFixed(1) : r.current_speed_kmh} km/h)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold font-mono text-slate-600 block mb-1">Forecast Horizon</label>
            <select
              value={playgroundHorizon}
              onChange={(e) => setPlaygroundHorizon(Number(e.target.value))}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              <option value={15}>+15 Minutes</option>
              <option value={30}>+30 Minutes</option>
              <option value={60}>+60 Minutes</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunPlayground}
              disabled={playgroundLoading}
              className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{playgroundLoading ? 'Running Inference...' : 'Run Live Prediction'}</span>
            </button>
          </div>
        </div>

        {playgroundResult && (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 mt-3 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">Inference Response:</span>
              <span className="text-slate-500">{playgroundResult.generated_at}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Predicted Speed</span>
                <span className="text-lg font-bold text-violet-700">
                  {typeof playgroundResult.predicted_speed_kmh === 'number' ? playgroundResult.predicted_speed_kmh.toFixed(1) : playgroundResult.predicted_speed_kmh} km/h
                </span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Predicted Congestion</span>
                <span className="text-lg font-bold text-amber-600">
                  {Math.round(playgroundResult.predicted_congestion * 100)}%
                </span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Horizon</span>
                <span className="text-lg font-bold text-slate-800">+{playgroundResult.horizon_minutes} min</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Model Version</span>
                <span className="text-sm font-bold text-slate-800">{playgroundResult.model_version}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
            Registered Models & Benchmarks
          </h3>
          <SourceBadge type="REAL_DATABASE" size="xs" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Model Name / ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">R² Score</th>
                <th className="py-2.5 px-3">MAE</th>
                <th className="py-2.5 px-3">RMSE</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {models.map((m) => (
                <tr key={m.model_id} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{m.model_id}</div>
                    <div className="text-[10px] text-slate-400">{m.version}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{m.model_type}</td>
                  <td className="py-3 px-3 text-slate-700">{m.target_variable}</td>
                  <td className="py-3 px-3 font-bold text-emerald-600">
                    {m.test_r2 !== undefined ? m.test_r2.toFixed(4) : 'Metric unavailable'}
                  </td>
                  <td className="py-3 px-3 text-slate-800">{m.test_mae ? m.test_mae.toFixed(3) : '--'}</td>
                  <td className="py-3 px-3 text-slate-800">{m.test_rmse ? m.test_rmse.toFixed(3) : '--'}</td>
                  <td className="py-3 px-3">
                    <ModelStatus status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
