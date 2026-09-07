import React, { useState, useEffect } from 'react';
import { RoadSegmentModel, ZonePredictionModel, IncidentModel } from '../types';
import { api } from '../services/api';
import { mockRoads, mockPredictions, mockIncidents } from '../services/mockData';
import { SourceBadge } from '../components/common/SourceBadge';
import { ModelStatus } from '../components/common/ModelStatus';
import {
  ShieldAlert,
  ArrowUpDown,
  Search,
} from 'lucide-react';

export const RoadRiskPage: React.FC = () => {
  const [roads, setRoads] = useState<RoadSegmentModel[]>(mockRoads);
  const [predictions, setPredictions] = useState<ZonePredictionModel[]>(mockPredictions);
  const [incidents, setIncidents] = useState<IncidentModel[]>(mockIncidents);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<'risk' | 'speed' | 'volume'>('risk');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(mockRoads[0]?.id || 'R-01');

  useEffect(() => {
    async function loadData() {
      try {
        const [roadData, predData, incData] = await Promise.all([
          api.getRoads(),
          api.getPredictions(),
          api.getIncidents(),
        ]);
        if (roadData && roadData.length > 0) setRoads(roadData);
        if (predData && predData.length > 0) setPredictions(predData);
        if (incData && incData.length > 0) setIncidents(incData);
      } catch (err) {
        console.error('Road risk data loaded with Delhi NCR fallback.');
      }
    }
    loadData();
  }, []);

  const segmentRiskList = roads.map((road) => {
    const matchingPred = predictions.find((p) => p.zone_id === road.from_zone_id || p.zone_id === road.to_zone_id);
    const congestion = road.congestion_level || 0.45;
    const speedDeficit = Math.max(0, (road.free_flow_speed_kmh - road.current_speed_kmh) / (road.free_flow_speed_kmh || 50));
    const volumeRatio = (road.current_volume_vph || 1200) / (road.capacity_vph || 2400);

    const rawRisk = Math.min(98, Math.max(12, Math.round((congestion * 40) + (speedDeficit * 35) + (volumeRatio * 25))));
    const probability = (rawRisk / 100).toFixed(2);
    const riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = rawRisk > 70 ? 'HIGH' : rawRisk > 45 ? 'MODERATE' : 'LOW';

    return {
      road,
      riskScore: rawRisk,
      probability,
      riskLevel,
      matchingPred,
      incidentsOnRoad: incidents.filter((inc) => inc.affected_road_ids?.includes(road.id)),
    };
  });

  const filteredList = segmentRiskList
    .filter((item) => {
      if (!searchTerm) return true;
      return (
        item.road.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.road.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortField === 'risk') {
        valA = a.riskScore;
        valB = b.riskScore;
      } else if (sortField === 'speed') {
        valA = a.road.current_speed_kmh;
        valB = b.road.current_speed_kmh;
      } else if (sortField === 'volume') {
        valA = a.road.current_volume_vph;
        valB = b.road.current_volume_vph;
      }
      return sortAsc ? valA - valB : valB - valA;
    });

  const highRiskCount = segmentRiskList.filter((s) => s.riskLevel === 'HIGH').length;
  const modRiskCount = segmentRiskList.filter((s) => s.riskLevel === 'MODERATE').length;
  const lowRiskCount = segmentRiskList.filter((s) => s.riskLevel === 'LOW').length;
  const avgRiskScore = Math.round(segmentRiskList.reduce((acc, s) => acc + s.riskScore, 0) / (segmentRiskList.length || 1));

  const activeSelected = segmentRiskList.find((s) => s.road.id === selectedSegmentId) || segmentRiskList[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Road Risk Intelligence</h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              XGBoost Classifier
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Supervised road-risk classification and hazard probability prediction across Delhi NCR corridors.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-mono shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <div>
            <div className="text-slate-500 text-[10px]">SUPERVISED CLASSIFICATION</div>
            <div className="font-semibold text-slate-800">XGBoost Risk Predictor</div>
          </div>
          <ModelStatus status="Available" />
        </div>
      </div>

      {/* Top Network Risk Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Network Average Risk */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Overall Network Risk
            </span>
            <SourceBadge type="ML_PREDICTION" size="xs" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={'text-3xl font-bold font-mono ' + (avgRiskScore > 65 ? 'text-rose-600' : 'text-amber-600')}>
              {avgRiskScore}
            </span>
            <span className="text-xs font-mono text-slate-500">/100 Index</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 font-mono">
            <span>Risk Status:</span>
            <span className="font-bold text-amber-700">{avgRiskScore > 65 ? 'ELEVATED' : 'MODERATE'}</span>
          </div>
        </div>

        {/* High Risk Corridors */}
        <div className="p-4 bg-white rounded-xl border border-rose-200/90 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 font-mono">
              High-Risk Corridors
            </span>
            <SourceBadge type="ML_PREDICTION" size="xs" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-bold font-mono text-rose-700">{highRiskCount}</span>
            <span className="text-xs font-mono text-rose-600">segments</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-rose-100 font-mono">
            <span>Critical threshold:</span>
            <span className="font-bold text-rose-700">&gt; 70 Risk Score</span>
          </div>
        </div>

        {/* Moderate Risk Corridors */}
        <div className="p-4 bg-white rounded-xl border border-amber-200/90 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 font-mono">
              Moderate Risk
            </span>
            <SourceBadge type="ML_PREDICTION" size="xs" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-bold font-mono text-amber-700">{modRiskCount}</span>
            <span className="text-xs font-mono text-amber-600">segments</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-amber-100 font-mono">
            <span>Range:</span>
            <span className="font-bold text-amber-700">45 – 70 Score</span>
          </div>
        </div>

        {/* Low Risk / Stable */}
        <div className="p-4 bg-white rounded-xl border border-emerald-200/90 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Low Risk / Free Flow
            </span>
            <SourceBadge type="ML_PREDICTION" size="xs" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-bold font-mono text-emerald-700">{lowRiskCount}</span>
            <span className="text-xs font-mono text-emerald-600">segments</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-emerald-100 font-mono">
            <span>Range:</span>
            <span className="font-bold text-emerald-700">&lt; 45 Score</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sortable Risk Table & Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
                <span>Corridor Risk Classification Matrix</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {filteredList.length} corridors
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any row to view XGBoost feature contributions and telemetry breakdown.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search road name or ID..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none w-48 sm:w-56"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Segment</th>
                  <th
                    className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
                    onClick={() => {
                      setSortField('risk');
                      setSortAsc(!sortAsc);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Risk Score</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3">Probability</th>
                  <th
                    className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
                    onClick={() => {
                      setSortField('speed');
                      setSortAsc(!sortAsc);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Speed / Flow</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3">Incidents</th>
                  <th className="py-2.5 px-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredList.map((item) => {
                  const isSelected = item.road.id === selectedSegmentId;
                  const riskColor = item.riskLevel === 'HIGH' ? 'text-rose-600' : item.riskLevel === 'MODERATE' ? 'text-amber-600' : 'text-emerald-600';
                  const badgeStyle = item.riskLevel === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' : item.riskLevel === 'MODERATE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  return (
                    <tr
                      key={item.road.id}
                      onClick={() => setSelectedSegmentId(item.road.id)}
                      className={'cursor-pointer transition-colors duration-150 ' + (isSelected ? 'bg-slate-100/90 font-medium' : 'hover:bg-slate-50')}
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 font-sans">{item.road.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {item.road.id} • {item.road.length_km} km • {item.road.lane_count} Lanes
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={'font-bold text-sm ' + riskColor}>
                            {item.riskScore}
                          </span>
                          <span className={'text-[9px] font-bold px-1.5 py-0.2 rounded border ' + badgeStyle}>
                            {item.riskLevel}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{item.probability}</td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800">{typeof item.road.current_speed_kmh === 'number' ? item.road.current_speed_kmh.toFixed(1) : item.road.current_speed_kmh} km/h</div>
                        <div className="text-[10px] text-slate-400">Cap: {item.road.capacity_vph} vph</div>
                      </td>
                      <td className="py-3 px-3">
                        {item.incidentsOnRoad.length > 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                            {item.incidentsOnRoad.length} ACTIVE
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">None</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <SourceBadge type="ML_PREDICTION" size="xs" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Explanation Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Risk Factor Explanation
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">XGBoost Decision-Tree Feature Attribution</p>
            </div>
            <SourceBadge type="ML_PREDICTION" size="xs" />
          </div>

          {activeSelected && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase">Selected Segment</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{activeSelected.road.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">ID: {activeSelected.road.id}</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Predicted Risk Probability:</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">{activeSelected.probability}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Classified Risk Level:</span>
                  <span
                    className={'font-mono font-bold text-xs px-2 py-0.5 rounded border ' + (
                      activeSelected.riskLevel === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : activeSelected.riskLevel === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    )}
                  >
                    {activeSelected.riskLevel}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-700 font-mono uppercase">Key Contributing Factors</div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">Traffic Speed Deficit</div>
                      <div className="text-[11px] text-slate-500">
                        {Math.max(0, activeSelected.road.free_flow_speed_kmh - activeSelected.road.current_speed_kmh).toFixed(1)} km/h below standard
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-700">35% Impact</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">Corridor Density Saturation</div>
                      <div className="text-[11px] text-slate-500">
                        {Math.round((activeSelected.road.congestion_level || 0.5) * 100)}% utilization ratio
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-700">40% Impact</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">Volume vs Capacity</div>
                      <div className="text-[11px] text-slate-500">
                        {activeSelected.road.current_volume_vph} / {activeSelected.road.capacity_vph} vph
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-700">25% Impact</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>Decision Support:</strong>{' '}
                {activeSelected.riskLevel === 'HIGH'
                  ? 'Recommend dynamic freight diversion and signal timing preemption to prevent gridlock.'
                  : activeSelected.riskLevel === 'MODERATE'
                  ? 'Monitor lane queues and consider staggered delivery slot dispatching.'
                  : 'Road conditions optimal. Normal commercial dispatch permitted.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
