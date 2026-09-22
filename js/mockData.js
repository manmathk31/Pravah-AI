/**
 * PravahAi Inlined Mock Datasets (mockData.js)
 * Pre-bundled initial telemetry and route configurations for instant 0ms app bootstrapping.
 */

export const initialNodes = [
  {
    "id": "node-01",
    "name": "Riverbank Promenade (North Pier)",
    "location": "North Promenade & Sector 4",
    "lat": 18.5365,
    "lng": 73.8375,
    "status": "SAFE",
    "water_level": 0.82,
    "warning_threshold": 1.50,
    "critical_threshold": 2.20,
    "rate_of_rise": 1.2,
    "rainfall_15m": 2.4,
    "rainfall_60m": 8.5,
    "risk_pct": 18,
    "battery_pct": 94,
    "solar_w": 18.2,
    "lora_rssi": -74,
    "edge_device": "Station Computer #01",
    "last_ping": "12s ago",
    "camera_health": "OPTIMAL",
    "road_impact": "Service Lane is Open & Safe",
    "elevation_m": 548.2
  },
  {
    "id": "node-02",
    "name": "Central Metro Underpass",
    "location": "Metro Line 1 Underpass Junction",
    "lat": 18.5280,
    "lng": 73.8460,
    "status": "AT_RISK",
    "water_level": 1.48,
    "warning_threshold": 1.40,
    "critical_threshold": 2.10,
    "rate_of_rise": 4.8,
    "rainfall_15m": 12.8,
    "rainfall_60m": 29.4,
    "risk_pct": 64,
    "battery_pct": 89,
    "solar_w": 6.4,
    "lora_rssi": -81,
    "edge_device": "Station Computer #02",
    "last_ping": "4s ago",
    "camera_health": "LIGHT_SPLASH",
    "road_impact": "Right Lane Waterlogged — Slow Down to 25 km/h",
    "elevation_m": 539.1
  },
  {
    "id": "node-03",
    "name": "Riverside Causeway (Lowland Blvd)",
    "location": "Lowland Blvd Bridge Culvert",
    "lat": 18.5225,
    "lng": 73.8510,
    "status": "AT_RISK",
    "water_level": 1.76,
    "warning_threshold": 1.60,
    "critical_threshold": 2.30,
    "rate_of_rise": 8.4,
    "rainfall_15m": 19.2,
    "rainfall_60m": 42.0,
    "risk_pct": 74,
    "battery_pct": 91,
    "solar_w": 4.1,
    "lora_rssi": -79,
    "edge_device": "Station Computer #03",
    "last_ping": "2s ago",
    "camera_health": "WATER_PONDING",
    "road_impact": "Road Closing Soon — Please Detour via Ridge Highway",
    "elevation_m": 536.8
  },
  {
    "id": "node-04",
    "name": "Industrial Basin Storm Canal",
    "location": "Gate 3 Drainage Sluice",
    "lat": 18.5140,
    "lng": 73.8420,
    "status": "SAFE",
    "water_level": 0.65,
    "warning_threshold": 1.80,
    "critical_threshold": 2.50,
    "rate_of_rise": 0.6,
    "rainfall_15m": 4.1,
    "rainfall_60m": 11.2,
    "risk_pct": 14,
    "battery_pct": 98,
    "solar_w": 21.0,
    "lora_rssi": -69,
    "edge_device": "Station Computer #04",
    "last_ping": "18s ago",
    "camera_health": "OPTIMAL",
    "road_impact": "Factory Link Road is Clear & Safe",
    "elevation_m": 552.4
  },
  {
    "id": "node-05",
    "name": "South East Creek Culvert",
    "location": "Old Trunk Road Dip",
    "lat": 18.5110,
    "lng": 73.8590,
    "status": "SAFE",
    "water_level": 0.54,
    "warning_threshold": 1.30,
    "critical_threshold": 2.00,
    "rate_of_rise": -0.2,
    "rainfall_15m": 1.8,
    "rainfall_60m": 6.2,
    "risk_pct": 11,
    "battery_pct": 82,
    "solar_w": 14.5,
    "lora_rssi": -86,
    "edge_device": "Station Computer #05",
    "last_ping": "32s ago",
    "camera_health": "OPTIMAL",
    "road_impact": "Old Trunk Road is Clear & Dry",
    "elevation_m": 558.0
  },
  {
    "id": "node-06",
    "name": "Hillside Runoff Retention Weir",
    "location": "Upper Ridge Spillway",
    "lat": 18.5420,
    "lng": 73.8550,
    "status": "SAFE",
    "water_level": 1.10,
    "warning_threshold": 2.40,
    "critical_threshold": 3.20,
    "rate_of_rise": 2.1,
    "rainfall_15m": 8.0,
    "rainfall_60m": 18.4,
    "risk_pct": 22,
    "battery_pct": 96,
    "solar_w": 19.8,
    "lora_rssi": -72,
    "edge_device": "Station Computer #06",
    "last_ping": "9s ago",
    "camera_health": "OPTIMAL",
    "road_impact": "Ridge Highway is Elevated & Completely Dry",
    "elevation_m": 584.5
  }
];

export const initialAlerts = [
  {
    "id": "alt-109",
    "timestamp": "2 min ago",
    "severity": "CRITICAL",
    "node_id": "node-03",
    "title": "Severe Flood Warning — Lowland Boulevard",
    "description": "Water is rising rapidly (1.76m deep, rising 8.4 cm every hour) and spreading onto the street. The road will be completely blocked in 35 minutes.",
    "action": "Close road & redirect traffic to Ridge Highway",
    "confidence": 94,
    "active": true
  },
  {
    "id": "alt-108",
    "timestamp": "7 min ago",
    "severity": "WARNING",
    "node_id": "node-02",
    "title": "Water Rising — Central Metro Underpass",
    "description": "Storm drains are 78% full with 12 cm of water on the right lane. Drivers are advised to slow down to 25 km/h.",
    "action": "Turn on city drainage pump 2B",
    "confidence": 88,
    "active": true
  },
  {
    "id": "alt-107",
    "timestamp": "22 min ago",
    "severity": "INFO",
    "node_id": "node-06",
    "title": "Water Level Normal — Hillside Spillway",
    "description": "Water flow is steady at a safe 1.10m. Storm clouds have cleared and moved away from the hills.",
    "action": "Road remains open & safe for all vehicles",
    "confidence": 99,
    "active": false
  },
  {
    "id": "alt-106",
    "timestamp": "45 min ago",
    "severity": "INFO",
    "node_id": "node-01",
    "title": "Station Healthy — Riverbank Promenade",
    "description": "Daily self-check passed. Battery is at 94%, radio signal is strong, and street camera lens is clear.",
    "action": "No action needed — station running normally",
    "confidence": 100,
    "active": false
  }
];

export const initialIncidents = [
  {
    "id": "inc-step-5",
    "timestamp": "14:24:10",
    "stage": "PROTECT",
    "badge": "Action Taken",
    "severity": "CRITICAL",
    "node_id": "node-03",
    "title": "Emergency Alert Broadcast & Safe Detour Opened",
    "summary": "Electronic road signs at Sector 4 Junction updated. Navigation maps notified of Lowland Blvd closure. Local emergency radios broadcasting warnings to nearby drivers.",
    "metrics": {
      "detour_time": "+7 min",
      "radios_reached": 142,
      "traffic_diverted": "100%"
    }
  },
  {
    "id": "inc-step-4",
    "timestamp": "14:21:45",
    "stage": "CHECK",
    "badge": "Safety Check",
    "severity": "CRITICAL",
    "node_id": "node-03",
    "title": "Road Section 3B Marked UNSAFE for Cars",
    "summary": "Water will exceed 25cm (exhaust pipe height) within 40 minutes. City flood management notified to prepare barricades.",
    "metrics": {
      "road_status": "UNSAFE",
      "expected_depth": "31 cm",
      "road_lane": "CLOSED"
    }
  },
  {
    "id": "inc-step-3",
    "timestamp": "14:18:20",
    "stage": "FORECAST",
    "badge": "AI Forecast",
    "severity": "WARNING",
    "node_id": "node-03",
    "title": "AI Predicts Road Will Flood in 48 Minutes",
    "summary": "Local on-site AI predicts an 89% chance that water will overflow onto Lowland Causeway between 14:50 and 15:30.",
    "metrics": {
      "warning_time": "48 min",
      "flood_chance": "89.2%",
      "calculation_speed": "38 ms"
    }
  },
  {
    "id": "inc-step-2",
    "timestamp": "14:15:05",
    "stage": "VERIFY",
    "badge": "Sensor Check",
    "severity": "WARNING",
    "node_id": "node-03",
    "title": "Street Camera and Water Gauge Both Confirm Rising Water",
    "summary": "Camera sees 18m² of standing water on the street. Water depth sensor confirms fast water surge at 1.4 meters per second.",
    "metrics": {
      "puddle_area": "18.4 m²",
      "water_speed": "1.42 m/s",
      "sensor_agreement": "93.4%"
    }
  },
  {
    "id": "inc-step-1",
    "timestamp": "14:11:30",
    "stage": "MEASURE",
    "badge": "Sensor Alert",
    "severity": "INFO",
    "node_id": "node-03",
    "title": "Water Sensor Detects Sudden Water Surge",
    "summary": "Water gauge reports water rise jumped from 1.2 cm/hr to 8.4 cm/hr following heavy downpour (19 mm in 15 minutes).",
    "metrics": {
      "water_level": "1.76 m",
      "rise_rate": "+8.4 cm/hr",
      "rainfall": "76.8 mm/hr"
    }
  }
];

export const initialRoutes = {
  "origin": {
    "name": "North Riverside Tech Park (Gate 1)",
    "lat": 18.5385,
    "lng": 73.8380
  },
  "destination": {
    "name": "Hillside District Medical Center",
    "lat": 18.5135,
    "lng": 73.8570
  },
  "direct_route": {
    "id": "rt-direct",
    "name": "Lowland Boulevard (Direct Route)",
    "status": "UNSAFE",
    "status_label": "Dangerous Flooding — Road Impassable",
    "distance_km": 4.1,
    "est_time_mins": 11,
    "hazard_score": 88,
    "passable": false,
    "color": "#E5484D",
    "hazard_summary": "Road underwater at Lowland Causeway. Water depth is over 28cm with high risk of engine damage and vehicles getting trapped.",
    "detour_time_diff": "0 min",
    "elevation_profile": "Low-Lying River Dip (Low Ground)",
    "segments": [
      [18.5385, 73.8380],
      [18.5340, 73.8410],
      [18.5285, 73.8455],
      [18.5225, 73.8510],
      [18.5180, 73.8535],
      [18.5135, 73.8570]
    ]
  },
  "safe_route": {
    "id": "rt-safe",
    "name": "Ridge Highway Bypass (Recommended)",
    "status": "SAFE",
    "status_label": "Completely Dry & Open",
    "distance_km": 5.9,
    "est_time_mins": 18,
    "hazard_score": 8,
    "passable": true,
    "color": "#2FBF71",
    "hazard_summary": "Completely dry road on high ground (+48m above the river). Zero standing water and smooth traffic.",
    "detour_time_diff": "+7 min detour",
    "elevation_profile": "High Ground Ridge (Safe Elevation)",
    "segments": [
      [18.5385, 73.8380],
      [18.5410, 73.8430],
      [18.5435, 73.8490],
      [18.5420, 73.8550],
      [18.5320, 73.8610],
      [18.5210, 73.8625],
      [18.5140, 73.8595],
      [18.5135, 73.8570]
    ]
  }
};
