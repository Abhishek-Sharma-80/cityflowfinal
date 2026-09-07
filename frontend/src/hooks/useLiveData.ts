import { useState, useEffect, useCallback } from 'react';

export interface LiveZone {
  id: string;
  pressure_score: number;
  pressure_class: string;
  traffic_density: number;
  road_utilization: number;
  avg_speed_kmh: number;
  active_deliveries: number;
  active_vehicles: number;
}

export interface LiveVehicle {
  id: string;
  lat: number;
  lng: number;
  status: string;
  speed_kmh: number;
}

export interface LiveRoad {
  id: string;
  congestion_level: number;
  current_speed_kmh: number;
  status: string;
}

export interface LiveSnapshot {
  timestamp: string;
  tick_count: number;
  is_emergency_active: boolean;
  city_pressure_index: number;
  zones: LiveZone[];
  vehicles: LiveVehicle[];
  roads: LiveRoad[];
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8001';

export function useLiveData(intervalMs: number = 15000) {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [secondsSince, setSecondsSince] = useState(0);

  const fetchSnapshot = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/live/snapshot`, {
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const data: LiveSnapshot = await res.json();
        setSnapshot(data);
        setLastUpdated(new Date());
        setIsConnected(true);
        setSecondsSince(0);
      }
    } catch {
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchSnapshot();
    const poll = setInterval(fetchSnapshot, intervalMs);
    return () => clearInterval(poll);
  }, [fetchSnapshot, intervalMs]);

  useEffect(() => {
    const ticker = setInterval(() => setSecondsSince(s => s + 1), 1000);
    return () => clearInterval(ticker);
  }, [lastUpdated]);

  return { snapshot, lastUpdated, isConnected, secondsSince, refetch: fetchSnapshot };
}
