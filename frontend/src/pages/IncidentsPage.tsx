import React, { useState, useEffect } from 'react';
import { IncidentModel, RoadSegmentModel, ZoneModel } from '../types';
import { api } from '../services/api';
import { SourceBadge } from '../components/common/SourceBadge';
import { SkeletonPage } from '../components/common/Skeleton';
import {
  AlertTriangle,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  ShieldAlert,
} from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentModel[]>([]);
  const [_roads, setRoads] = useState<RoadSegmentModel[]>([]);
  const [_zones, setZones] = useState<ZoneModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [incData, roadData, zoneData] = await Promise.all([
          api.getIncidents(),
          api.getRoads(),
          api.getZones(),
        ]);
        setIncidents(incData);
        setRoads(roadData);
        setZones(zoneData);
      } catch (err) {
        console.error('Error fetching incidents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <SkeletonPage rows={3} />;
  }

  const filteredIncidents = incidents.filter((inc) => {
    const matchesType = filterType === 'ALL' || inc.type === filterType;
    const matchesSeverity = filterSeverity === 'ALL' || inc.severity === filterSeverity;
    const matchesSearch = !searchTerm ||
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSeverity && matchesSearch;
  });

  const activeCount = incidents.filter((i) => i.active !== false).length;
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL' || i.severity === 'SEVERE').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Incident Management</h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              REAL-TIME FEED
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Road hazards, closures, construction disruptions, and priority vehicle corridors across Bengaluru.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SourceBadge type="REAL_DATABASE" size="sm" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Total Logged Incidents
            </span>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900">{incidents.length}</div>
          <p className="text-xs text-slate-500 mt-1">Recorded in current session</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-rose-200/90 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 font-mono">
              Active Obstructions
            </span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-rose-700">{activeCount}</div>
          <p className="text-xs text-rose-600 mt-1">Impacting traffic flow</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-amber-200/90 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 font-mono">
              High Severity Events
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-700">{criticalCount}</div>
          <p className="text-xs text-amber-600 mt-1">Requiring active diversion</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              <option value="ALL">All Incident Types</option>
              <option value="ACCIDENT">Accident</option>
              <option value="ROAD_CLOSURE">Road Closure</option>
              <option value="CONSTRUCTION">Construction</option>
              <option value="FESTIVAL_EVENT">Festival / Public Event</option>
              <option value="WATERLOGGING">Waterlogging</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="SEVERE">Severe</option>
              <option value="MODERATE">Moderate</option>
              <option value="MINOR">Minor</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search incidents..."
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none w-56"
          />
        </div>
      </div>

      {/* Incidents Grid */}
      {filteredIncidents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className={'p-5 bg-white rounded-xl border shadow-xs space-y-3 transition-all hover:border-slate-300 ' + (
                inc.severity === 'CRITICAL' || inc.severity === 'SEVERE'
                  ? 'border-rose-200 bg-rose-50/10'
                  : 'border-slate-200/90'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={'text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ' + (
                      inc.severity === 'CRITICAL' || inc.severity === 'SEVERE'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : inc.severity === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    )}
                  >
                    {inc.severity} • {inc.type}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{inc.title}</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">{inc.id}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reported: {inc.start_time}</span>
                </div>
                {inc.affected_road_ids && inc.affected_road_ids.length > 0 && (
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Corridors: {inc.affected_road_ids.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-xl border border-slate-200 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Incidents Matching Filter</h3>
          <p className="text-xs text-slate-500">All corridors within selected filters are operating normally.</p>
        </div>
      )}
    </div>
  );
};
