/**
 * PravahAi Simulation Engine (sim.js)
 * Standalone client-side event bus & hydrological edge telemetry simulator.
 * Supports random walks, multi-sensor fusion, and on-demand flood scenario triggers.
 */

class SimulationEngine {
  constructor() {
    this.listeners = new Map();
    this.nodes = [];
    this.alerts = [];
    this.incidents = [];
    this.routes = null;
    this.isLoRaMode = false;
    this.simulationSpeed = 1; // 1x or 5x
    this.activeScenario = 'NORMAL'; // 'NORMAL' | 'FLOOD'
    this.timerId = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    try {
      const [nodesRes, alertsRes, incidentsRes, routesRes] = await Promise.all([
        fetch('./mock/nodes.json').then(r => r.json()),
        fetch('./mock/alerts.json').then(r => r.json()),
        fetch('./mock/incidents.json').then(r => r.json()),
        fetch('./mock/routes.json').then(r => r.json())
      ]);

      this.nodes = nodesRes;
      this.alerts = alertsRes;
      this.incidents = incidentsRes;
      this.routes = routesRes;
      this.initialized = true;

      this.startLoop();
      this.emit('initialized', { nodes: this.nodes, alerts: this.alerts, routes: this.routes });
    } catch (err) {
      console.error('Failed to initialize PravahAi simulation engine:', err);
    }
  }

  // Pub/Sub Event System
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in subscriber for event ${event}:`, e);
        }
      });
    }
  }

  startLoop() {
    if (this.timerId) clearInterval(this.timerId);
    const intervalMs = Math.max(800, 3500 / this.simulationSpeed);
    this.timerId = setInterval(() => this.tick(), intervalMs);
  }

  setSpeed(speedMultiplier) {
    this.simulationSpeed = speedMultiplier;
    this.startLoop();
    this.emit('speedChanged', { speed: this.simulationSpeed });
  }

  setConnectivityMode(mode) {
    this.isLoRaMode = (mode === 'lora');
    this.emit('connectivityChanged', { isLoRaMode: this.isLoRaMode });
  }

  // Hydrological Random Walk & Multimodal Fusion
  tick() {
    if (!this.nodes || this.nodes.length === 0) return;

    this.nodes.forEach(node => {
      // In flood scenario, Node 03 (Lowland Causeway) and Node 02 surge
      if (this.activeScenario === 'FLOOD' && (node.id === 'node-03' || node.id === 'node-02')) {
        const delta = (Math.random() * 0.05 + 0.02);
        node.water_level = Math.min(2.85, +(node.water_level + delta).toFixed(2));
        node.rate_of_rise = Math.min(18.5, +(node.rate_of_rise + 0.4).toFixed(1));
        node.rainfall_15m = Math.min(35.0, +(node.rainfall_15m + 0.8).toFixed(1));
      } else {
        // Normal Brownian fluctuation
        const jitter = (Math.random() - 0.48) * 0.02;
        node.water_level = Math.max(0.3, +(node.water_level + jitter).toFixed(2));
        const rateJitter = (Math.random() - 0.5) * 0.2;
        node.rate_of_rise = +(node.rate_of_rise + rateJitter).toFixed(1);
      }

      // Dynamic Multimodal Risk Formula:
      // Risk = 0.5 * (water_level / critical) + 0.3 * (rate_of_rise / 10) + 0.2 * (rainfall / 30)
      const waterRatio = node.water_level / node.critical_threshold;
      const riseRatio = Math.max(0, node.rate_of_rise / 12);
      const rainRatio = Math.min(1, node.rainfall_15m / 30);
      const computedRisk = Math.min(99, Math.round((waterRatio * 55 + riseRatio * 25 + rainRatio * 20)));

      node.risk_pct = Math.max(5, computedRisk);

      // Status Assessment
      const prevStatus = node.status;
      if (node.water_level >= node.critical_threshold * 0.9 || node.risk_pct >= 80) {
        node.status = 'UNSAFE';
      } else if (node.water_level >= node.warning_threshold || node.risk_pct >= 50) {
        node.status = 'AT_RISK';
      } else {
        node.status = 'SAFE';
      }

      if (prevStatus !== node.status) {
        this.emit('nodeStatusChanged', { node, prevStatus });
      }
    });

    this.emit('tick', {
      nodes: this.nodes,
      systemRisk: this.getOverallSystemRisk(),
      activeScenario: this.activeScenario
    });
  }

  getOverallSystemRisk() {
    if (!this.nodes.length) return 42;
    const maxRisk = Math.max(...this.nodes.map(n => n.risk_pct));
    const avgRisk = Math.round(this.nodes.reduce((acc, n) => acc + n.risk_pct, 0) / this.nodes.length);
    // Bias towards maximum danger point
    return Math.round(maxRisk * 0.6 + avgRisk * 0.4);
  }

  getNodeById(id) {
    return this.nodes.find(n => n.id === id) || this.nodes[0];
  }

  // Demo Trigger: Flash Flood Scenario
  triggerFloodScenario() {
    this.activeScenario = 'FLOOD';
    const targetNode = this.getNodeById('node-03');
    if (targetNode) {
      targetNode.water_level = 2.45;
      targetNode.rate_of_rise = 12.8;
      targetNode.rainfall_15m = 26.4;
      targetNode.risk_pct = 94;
      targetNode.status = 'UNSAFE';
      targetNode.camera_health = 'FLOODED';
    }

    // Push new Critical Alert
    const newAlert = {
      id: `alt-${Date.now()}`,
      timestamp: 'Just now',
      severity: 'CRITICAL',
      node_id: 'node-03',
      title: 'CRITICAL INUNDATION: Lowland Causeway Flooded',
      description: 'Water crest has exceeded roadway safety threshold by 34cm. Edge camera confirms vehicles turning back. Route automatically recalculated to Ridge Bypass.',
      action: 'Emergency detour active (+7 min)',
      confidence: 97,
      active: true
    };

    this.alerts.unshift(newAlert);

    // Push new Incident Log Step
    const newIncident = {
      id: `inc-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      stage: 'ACT',
      badge: 'Emergency Safe Reroute Enacted',
      severity: 'CRITICAL',
      node_id: 'node-03',
      title: 'Lowland Boulevard Causeway Closed — Traffic Diverted',
      summary: 'Automated barrier activation request transmitted via LoRa mesh packet. Navigational guidance dynamically shifted 100% of vehicular flow to Ridge Highway.',
      metrics: {
        road_status: 'CLOSED',
        detour_time: '+7 min',
        live_safety_index: '100% SAFE'
      }
    };

    this.incidents.unshift(newIncident);

    // Mark route direct as impassable
    if (this.routes && this.routes.direct_route) {
      this.routes.direct_route.passable = false;
      this.routes.direct_route.status = 'UNSAFE';
      this.routes.direct_route.hazard_score = 98;
    }

    this.emit('floodScenarioTriggered', {
      targetNode,
      newAlert,
      newIncident,
      routes: this.routes
    });

    this.tick();
  }

  // Reset to Calm Baseline
  resetScenario() {
    this.activeScenario = 'NORMAL';
    this.nodes.forEach(n => {
      if (n.id === 'node-03') {
        n.water_level = 1.15;
        n.rate_of_rise = 1.4;
        n.rainfall_15m = 4.2;
        n.risk_pct = 28;
        n.status = 'SAFE';
        n.camera_health = 'OPTIMAL';
      } else if (n.id === 'node-02') {
        n.water_level = 0.95;
        n.rate_of_rise = 1.1;
        n.rainfall_15m = 3.8;
        n.risk_pct = 24;
        n.status = 'SAFE';
      }
    });

    if (this.routes && this.routes.direct_route) {
      this.routes.direct_route.passable = true;
      this.routes.direct_route.status = 'AT_RISK';
      this.routes.direct_route.hazard_score = 45;
    }

    this.emit('scenarioReset', { nodes: this.nodes, routes: this.routes });
    this.tick();
  }
}

export const sim = new SimulationEngine();
