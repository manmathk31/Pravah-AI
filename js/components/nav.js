/**
 * PravahAi Navigation Component (nav.js)
 * Manages desktop topbar, mobile bottom tabs, slide-out drawer, and global connectivity toggle.
 */

import { sim } from '../sim.js';

export class NavigationComponent {
  constructor() {
    this.drawerEl = document.getElementById('mobile-drawer');
    this.drawerOverlay = document.getElementById('drawer-overlay');
    this.hamburgerBtn = document.getElementById('hamburger-btn');
    this.drawerCloseBtn = document.getElementById('drawer-close-btn');
    this.globalBanner = document.getElementById('global-banner');
    this.onlineToggleBtn = document.getElementById('toggle-online');
    this.loraToggleBtn = document.getElementById('toggle-lora');

    this.initListeners();
  }

  initListeners() {
    // Hamburger drawer controls
    if (this.hamburgerBtn) {
      this.hamburgerBtn.addEventListener('click', () => this.openDrawer());
    }
    if (this.drawerCloseBtn) {
      this.drawerCloseBtn.addEventListener('click', () => this.closeDrawer());
    }
    if (this.drawerOverlay) {
      this.drawerOverlay.addEventListener('click', () => this.closeDrawer());
    }

    // Drawer links auto-close drawer
    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => this.closeDrawer());
    });

    // Global Connectivity Toggle (Online vs LoRa Offline Mode)
    if (this.onlineToggleBtn && this.loraToggleBtn) {
      this.onlineToggleBtn.addEventListener('click', () => this.setConnectivity(false));
      this.loraToggleBtn.addEventListener('click', () => this.setConnectivity(true));
    }

    // Listen to simulation engine updates
    sim.on('connectivityChanged', ({ isLoRaMode }) => {
      this.updateConnectivityUI(isLoRaMode);
    });
  }

  openDrawer() {
    this.drawerEl?.classList.add('open');
    this.drawerOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeDrawer() {
    this.drawerEl?.classList.remove('open');
    this.drawerOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  setConnectivity(isLoRa) {
    sim.setConnectivityMode(isLoRa ? 'lora' : 'online');
  }

  updateConnectivityUI(isLoRa) {
    if (isLoRa) {
      this.onlineToggleBtn?.classList.remove('active');
      this.loraToggleBtn?.classList.add('lora-active');
      this.globalBanner?.classList.add('active');
      document.body.classList.add('lora-mode-active');
    } else {
      this.onlineToggleBtn?.classList.add('active');
      this.loraToggleBtn?.classList.remove('lora-active');
      this.globalBanner?.classList.remove('active');
      document.body.classList.remove('lora-mode-active');
    }
  }

  setActiveRoute(hash) {
    const route = hash.replace(/^#\/?/, '').split('?')[0] || 'landing';

    // Desktop links
    document.querySelectorAll('.desktop-nav-links .nav-link-item').forEach(link => {
      const target = link.getAttribute('href').replace(/^#\/?/, '');
      link.classList.toggle('active', target === route);
    });

    // Mobile bottom tabs
    document.querySelectorAll('.mobile-bottom-tabs .tab-link').forEach(tab => {
      const target = tab.getAttribute('href').replace(/^#\/?/, '');
      tab.classList.toggle('active', target === route);
    });

    // Drawer links
    document.querySelectorAll('.drawer-links .drawer-link').forEach(link => {
      const target = link.getAttribute('href').replace(/^#\/?/, '');
      link.classList.toggle('active', target === route);
    });
  }
}
