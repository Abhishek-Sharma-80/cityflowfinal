import requests
import json

BASE = 'http://localhost:8000'

# Test simulator
sim_body = {
    'name': 'Festival and Construction',
    'description': 'Test',
    'road_closures': ['R-06'],
    'accident_zones': ['Z-03'],
    'festival_zones': ['Z-02'],
    'demand_multiplier': 1.25,
    'traffic_multiplier': 1.20,
    'add_loading_zones': ['Z-01'],
    'temporary_construction_roads': ['R-06']
}
r = requests.post(BASE + '/api/simulator/run', json=sim_body, timeout=15)
print('Simulator:', r.status_code)
if r.status_code == 200:
    d = r.json()
    print('  travel_time_change_pct:', d['travel_time_change_pct'])
    print('  congestion_change_pct:', d['congestion_change_pct'])
    print('  co2_change_pct:', d['co2_change_pct'])
    print('  recommended_actions count:', len(d['recommended_actions']))
else:
    print(r.text[:400])

# Test emergency activate
emerg_body = {
    'emergency_type': 'AMBULANCE',
    'origin_lat': 13.0216,
    'origin_lng': 77.5796,
    'destination_lat': 12.9716,
    'destination_lng': 77.5946,
    'vehicle_callsign': 'MED-ICU-09'
}
r2 = requests.post(BASE + '/api/emergency/activate', json=emerg_body, timeout=15)
print('Emergency Activate:', r2.status_code)
if r2.status_code == 200:
    d2 = r2.json()
    print('  vehicle_callsign:', d2['vehicle_callsign'])
    print('  original_eta_mins:', d2['original_eta_mins'])
    print('  optimized_eta_mins:', d2['optimized_eta_mins'])
    print('  time_saved_mins:', d2['time_saved_mins'])
    print('  diverted_vehicles:', d2['diverted_logistics_vehicles_count'])
else:
    print(r2.text[:400])

# Test demo
r3 = requests.post(BASE + '/api/demo/run-surge', timeout=30)
print('Demo Run-Surge:', r3.status_code)
if r3.status_code == 200:
    d3 = r3.json()
    m = d3['final_impact_metrics']
    print('  travel_time_reduction_pct:', m['travel_time_reduction_pct'])
    print('  congestion_reduction_pct:', m['congestion_reduction_pct'])
    print('  fuel_saving_pct:', m['fuel_saving_pct'])
    print('  co2_reduction_pct:', m['co2_reduction_pct'])
    print('  delivery_delay_reduction_pct:', m['delivery_delay_reduction_pct'])
    print('  actions:', d3['system_actions_taken'][0][:80])
else:
    print(r3.text[:400])

print('\nAll endpoint tests complete.')
