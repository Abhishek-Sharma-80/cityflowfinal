import React, { useState, useEffect } from 'react';
import {
  Database, UploadCloud, CheckCircle2, AlertTriangle, RefreshCw,
  FileSpreadsheet, Clock, Activity, ShieldCheck, FileText, Search, Zap, Radio
} from 'lucide-react';
import { api } from '../services/api';
import { useMentorDemo } from '../context/MentorDemoContext';
import { DatasetSummaryModel, DataQualityReportModel } from '../types';

export const DataQualityPage: React.FC = () => {
  const [report, setReport] = useState<DataQualityReportModel | null>(null);
  const [datasets, setDatasets] = useState<DatasetSummaryModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
  const [auditLoading, setAuditLoading] = useState<boolean>(false);

  const {
    qualityScore,
    dataDriftDetected,
    driftStatus,
    anomaliesCount,
    injectSensorNoise,
    cleanseDataStream
  } = useMentorDemo();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [r, d] = await Promise.all([
        api.getDataQuality().catch(() => null),
        api.getDatasets().catch(() => [])
      ]);
      setReport(r);
      setDatasets(d);
    } catch (err) {
      console.error('Failed to load data quality data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      const res = await api.uploadDataset(file);
      setUploadSuccess(`Successfully ingested dataset '${res.filename}' with ${res.row_count.toLocaleString()} rows (${res.quality_score_pct}% quality)!`);
      await fetchData();
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewAudit = async (datasetId: string) => {
    try {
      setAuditLoading(true);
      const data = await api.getDatasetQualityAudit(datasetId);
      setSelectedAudit(data);
    } catch (err) {
      console.error('Failed to load quality audit', err);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1750px] mx-auto animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)]">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-inner">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Data Quality & Ingestion Command Center
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-300 font-bold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-600 animate-pulse" />
                Live Ingestion Stream
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated sensor stream validation, IQR & Z-Score anomaly detection, and Kolmogorov-Smirnov data drift auditing
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={dataDriftDetected ? cleanseDataStream : injectSensorNoise}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border shadow-sm flex items-center gap-1.5 transition active:scale-95 ${
              dataDriftDetected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${dataDriftDetected ? 'text-emerald-600' : 'text-amber-600 animate-pulse'}`} />
            <span>{dataDriftDetected ? 'Cleanse Sensor Stream' : '⚡ Inject Sensor Noise (+120 Anomalies)'}</span>
          </button>

          <button
            onClick={fetchData}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-600 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Total Observations</span>
            <Database className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {report?.total_observations ? report.total_observations.toLocaleString() : '9,408'}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            Valid: <span className="text-emerald-600 font-semibold">{report?.valid_observations ? report.valid_observations.toLocaleString() : '9,380'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Quality Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className={`text-2xl font-bold font-mono transition-all ${qualityScore >= 98 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {qualityScore.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            Status: <span className="text-slate-800 font-semibold">{qualityScore >= 98 ? 'Production Certified' : 'Noise Filter Active'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Anomalies Detected</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className={`text-2xl font-bold font-mono ${anomaliesCount > 20 ? 'text-rose-600' : 'text-slate-900'}`}>
            {anomaliesCount} Records
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            IQR Z-Score &gt; 3.0
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Corridors Monitored</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            10 Arterials
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            15-min Time Resolution
          </div>
        </div>

        <div className={`p-5 rounded-2xl backdrop-blur-md shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)] border transition-all ${
          dataDriftDetected
            ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/40 animate-pulse'
            : 'bg-white/85 border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Data Drift Status</span>
            <AlertTriangle className={`w-4 h-4 ${dataDriftDetected ? 'text-amber-600' : 'text-emerald-600'}`} />
          </div>
          <div className={`text-sm font-bold font-mono ${dataDriftDetected ? 'text-amber-800' : 'text-emerald-700'}`}>
            {driftStatus}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            KS / PSI Shift Index
          </div>
        </div>
      </div>

      {/* Dataset Ingestion & Upload Area */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">Upload New Real Traffic Dataset (CSV or JSON)</h2>
          </div>
          <span className="text-xs text-slate-500">Max size: 50MB</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 hover:bg-slate-50 transition">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-cyan-600" />
              Upload Time-Series Sensor Observations
            </div>
            <p className="text-xs text-slate-600">
              Supported format: CSV or JSON with <code className="text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded">timestamp</code>, <code className="text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded">road_segment_id</code>, <code className="text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded">volume_vph</code>, <code className="text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded">current_speed_kmh</code>.
            </p>
          </div>

          <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs flex items-center gap-2 shadow transition">
            {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {isUploading ? 'Validating & Ingesting...' : 'Select File to Ingest'}
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {uploadSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            {uploadSuccess}
          </div>
        )}

        {uploadError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            {uploadError}
          </div>
        )}
      </div>

      {/* Ingested Datasets Table */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">Ingested Datasets & Provenance</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">{datasets.length} Total Datasets</span>
        </div>

        {datasets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                  <th className="py-2.5 px-3">Filename</th>
                  <th className="py-2.5 px-3">Source Type</th>
                  <th className="py-2.5 px-3">Total Rows</th>
                  <th className="py-2.5 px-3">Valid Rows</th>
                  <th className="py-2.5 px-3">Quality Score</th>
                  <th className="py-2.5 px-3">Time Span</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {datasets.map((d) => (
                  <tr key={d.dataset_id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
                      {d.filename}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{d.source_id || 'PRE_LOADED_BENCHMARK'}</td>
                    <td className="py-3 px-3 font-mono">{d.row_count.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">{d.valid_rows.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono font-bold text-cyan-700">{d.quality_score_pct}%</td>
                    <td className="py-3 px-3 text-slate-500">{d.span_hours ? `${d.span_hours} hrs` : 'N/A'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleViewAudit(d.dataset_id)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded bg-white hover:bg-slate-100 text-cyan-700 border border-slate-300 shadow-sm transition"
                      >
                        Inspect Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            No datasets found. Upload a dataset to begin.
          </div>
        )}
      </div>

      {/* Quality Audit Details Modal / Panel */}
      {selectedAudit && (
        <div className="p-5 rounded-xl bg-white border border-cyan-400 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-600" />
              <h2 className="text-base font-bold text-slate-900">
                Detailed Quality & Anomaly Audit: {selectedAudit.filename}
              </h2>
            </div>
            <button
              onClick={() => setSelectedAudit(null)}
              className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-medium"
            >
              Close Audit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500 uppercase font-semibold">Duplicate Rows Detected</div>
              <div className="text-lg font-bold text-slate-900">
                {selectedAudit.quality_overview?.duplicate_count || 0}
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500 uppercase font-semibold">Statistical Anomalies (Z &gt; 3.5)</div>
              <div className="text-lg font-bold text-cyan-700">
                {selectedAudit.anomaly_audit?.total_anomalies_detected || 0}
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500 uppercase font-semibold">Time Resolution</div>
              <div className="text-lg font-bold text-emerald-700">
                15 Minutes Uniform
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
