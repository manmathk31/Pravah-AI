/**
 * PravahAi Client-Side Router (router.js)
 * Lightweight hash-based view router with parameter parsing and screen lifecycle management.
 */

import { renderLanding } from './screens/landing.js';
import { renderDashboard } from './screens/dashboard.js';
import { renderMap } from './screens/map.js';
import { renderNodeDetail } from './screens/nodeDetail.js';
import { renderIncidents } from './screens/incidents.js';
import { renderRouting } from './screens/routing.js';
import { renderModelHealth } from './screens/modelHealth.js';
import { renderAbout } from './screens/about.js';

export class Router {
  constructor(mountContainerEl, navComponent) {
    this.container = mountContainerEl;
    this.nav = navComponent;
    this.routes = {
      'landing': renderLanding,
      'dashboard': renderDashboard,
      'map': renderMap,
      'node-detail': renderNodeDetail,
      'incidents': renderIncidents,
      'routing': renderRouting,
      'model-health': renderModelHealth,
      'about': renderAbout
    };

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  parseHash() {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    const [path, queryString] = rawHash.split('?');
    const params = {};

    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      for (const [key, val] of searchParams.entries()) {
        params[key] = val;
      }
    }

    const routeName = path || 'landing';
    return { routeName, params };
  }

  handleRoute() {
    const { routeName, params } = this.parseHash();
    const renderFn = this.routes[routeName] || this.routes['landing'];

    // Scroll to top on navigation
    window.scrollTo(0, 0);

    // Update navigation active states
    this.nav?.setActiveRoute(window.location.hash || '#landing');

    // Smooth transition
    this.container.style.opacity = '0';
    this.container.style.transform = 'translateY(6px)';
    this.container.style.transition = 'opacity 140ms ease, transform 140ms ease';

    setTimeout(() => {
      try {
        renderFn(this.container, params);
      } catch (err) {
        console.error(`Error rendering route ${routeName}:`, err);
        this.container.innerHTML = `
          <div class="glass-panel" style="padding: 32px; text-align: center;">
            <h2>Unable to load screen</h2>
            <p style="color: var(--text-muted); margin-top: 8px;">${err.message}</p>
            <a href="#landing" class="btn btn-primary" style="margin-top: 16px;">Back to Home</a>
          </div>
        `;
      }

      this.container.style.opacity = '1';
      this.container.style.transform = 'translateY(0)';
    }, 140);
  }
}
