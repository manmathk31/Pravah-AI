/**
 * PravahAi Client-Side Router (router.js)
 * Lightweight hash-based view router with parameter parsing and screen lifecycle management.
 */

import { renderLanding } from './screens/landing.js?v=9';
import { renderDashboard } from './screens/dashboard.js?v=9';
import { renderMap } from './screens/map.js?v=9';
import { renderNodeDetail } from './screens/nodeDetail.js?v=9';
import { renderIncidents } from './screens/incidents.js?v=9';
import { renderRouting } from './screens/routing.js?v=9';
import { renderModelHealth } from './screens/modelHealth.js?v=9';
import { renderAbout } from './screens/about.js?v=11';

export class Router {
  constructor(mountContainerEl, navComponent) {
    this.container = mountContainerEl;
    this.nav = navComponent;
    this.isFirstRender = true;
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

    const executeRender = () => {
      try {
        renderFn(this.container, params);
      } catch (err) {
        console.error(`Error rendering route ${routeName}:`, err);
        this.container.innerHTML = `
          <div class="glass-panel" style="padding: 32px; text-align: center; max-width: 600px; margin: 40px auto;">
            <h2 style="color: #f87171;">Unable to load screen</h2>
            <p style="color: var(--text-muted); margin-top: 8px;">${err.message}</p>
            <a href="#landing" class="btn btn-primary" style="margin-top: 16px;">Back to Home</a>
          </div>
        `;
      }
      this.container.style.opacity = '1';
      this.container.style.transform = 'translateY(0)';
    };

    if (this.isFirstRender) {
      this.isFirstRender = false;
      this.container.style.opacity = '1';
      this.container.style.transform = 'translateY(0)';
      executeRender();
    } else {
      this.container.style.opacity = '0';
      this.container.style.transform = 'translateY(6px)';
      this.container.style.transition = 'opacity 140ms ease, transform 140ms ease';
      setTimeout(executeRender, 140);
    }
  }
}
