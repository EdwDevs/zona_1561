/**
 * 🏢 SISTEMA EJECUTIVO MODERNO - TRANSFERENCIAS
 * JavaScript optimizado para diseño Fortune 500
 * @version: Executive Modern 4.0
 * @performance: Optimized & Responsive
 */

// 🎯 Executive Configuration
const EXECUTIVE_CONFIG = {
    COLLECTIONS: {
        TRANSFERENCIAS: 'transferencias_drosan_unidrogas',
        PAGOS: 'pagos_productos'
    },
    STORAGE_KEYS: {
        TRANSFERENCIAS: 'exec_transferencias_local',
        PAGOS: 'exec_pagos_local',
        SETTINGS: 'exec_settings'
    },
    PAGINATION: {
        PER_PAGE: 10,
        MAX_PAGES: 10
    },
    ANIMATIONS: {
        STAGGER_DELAY: 100,
        TRANSITION_DURATION: 300
    },
    DEBUG: true
};

// 🎯 Executive System Class
class ExecutiveTransferSystem {
    constructor() {
        this.firebaseReady = false;
        this.transferencias = [];
        this.pagos = [];
        this.currentTab = 'transferencias';
        this.editingId = null;
        this.editingType = null;
        this.currentPage = 1;
        this.searchFilters = {
            transferencias: '',
            pagos: '',
            distribuidora: '',
            producto: ''
        };
        
        this.init();
    }

    // 🚀 System Initialization
    async init() {
        this.log('🚀 Iniciando Sistema Ejecutivo...', 'info');
        this.updateConnectionIndicator('connecting', 'Conectando...');
        
        // Setup event listeners
        this.setupEventListeners();
        this.initializeForms();
        
        // Listen for Firebase events
        window.addEventListener('firebaseReady', () => this.handleFirebaseReady());
        window.addEventListener('firebaseError', (e) => this.handleFirebaseError(e));
        
        // Connection timeout
        setTimeout(() => this.checkConnectionTimeout(), 10000);
        
        // Initialize UI
        this.initializeUI();
    }

    // ✅ Firebase Ready Handler
    async handleFirebaseReady() {
        this.firebaseReady = true;
        this.log('✅ Firebase Sistema Ejecutivo conectado', 'success');
        this.updateConnectionIndicator('connected', 'Conectado a zona1561-4de30');
        
        await this.loadAllData();
        this.updateDashboardMetrics();
    }

    // ❌ Firebase Error Handler
    handleFirebaseError(event) {
        const error = event.detail;
        this.log(`❌ Error Firebase: ${error.message}`, 'error');
        this.updateConnectionIndicator('error', `Error: ${error.message}`);
        this.loadLocalData();
    }

    // ⏰ Connection Timeout
    checkConnectionTimeout() {
        if (!this.firebaseReady) {
            this.log('⏰ Timeout - Modo offline ejecutivo', 'warning');
            this.updateConnectionIndicator('error', 'Trabajando offline');
            this.loadLocalData();
        }
    }

    // 🎯 Setup Event Listeners
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Search inputs
        document.getElementById('searchTransferencias')?.addEventListener('input', 
            this.debounce((e) => this.handleSearch('transferencias', e.target.value), 300));
        
        document.getElementById('searchPagos')?.addEventListener('input', 
            this.debounce((e) => this.handleSearch('pagos', e.target.value), 300));

        // Filter selects
        document.getElementById('filterDistribuidora')?.addEventListener('change', 
            (e) => this.handleFilter('distribuidora', e.target.value));
        
        document.getElementById('filterProducto')?.addEventListener('change', 
            (e) => this.handleFilter('producto', e.target.value));

        // Forms
        document.getElementById('transferenciaForm')?.addEventListener('submit', 
            (e) => this.handleTransferenciaSubmit(e));
        
        document.getElementById('pagoForm')?.addEventListener('submit', 
            (e) => this.handlePagoSubmit(e));

        // Auto-calculate payment total
        ['cajasPagadas', 'valorUnitario'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', 
                () => this.calculatePaymentTotal());
        });

        // Modal management
        document.getElementById('modalOverlay')?.addEventListener('click', 
            () => this.closeAllModals());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window events
        window.addEventListener('beforeunload', () => this.saveToLocalStorage());
        window.addEventListener('focus', () => this.handleWindowFocus());
    }

    // 📅 Initialize Forms
    initializeForms() {
        const today = new Date().toISOString().split('T')[0];
        
        const fechaTransferencia = document.getElementById('fechaTransferencia');
        const fechaPago = document.getElementById('fechaPago');
        
        if (fechaTransferencia) fechaTransferencia.value = today;
        if (fechaPago) fechaPago.value = today;
    }

    // 🎨 Initialize UI
    initializeUI() {
        // Add stagger animation to dashboard cards
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        dashboardCards.forEach((card, index) => {
            card.style.animationDelay = `${index * EXECUTIVE_CONFIG.ANIMATIONS.STAGGER_DELAY}ms`;
            card.classList.add('stagger-animation');
        });

        // Initialize tooltips and other UI components
        this.initializeTooltips();
        this.setupProgressCircles();
    }

    // 💡 Initialize Tooltips
    initializeTooltips() {
        document.querySelectorAll('[title]').forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip);
            element.addEventListener('mouseleave', this.hideTooltip);
        });
    }

    // 📊 Setup Progress Circles
    setupProgressCircles() {
        document.querySelectorAll('.progress-circle').forEach(circle => {
            const percentage = circle.dataset.percentage || 0;
            circle.style.setProperty('--percentage', `${percentage}%`);
        });
    }

    // 🔄 Switch Tab
    switchTab(tabName) {
        if (this.currentTab === tabName) return;
        
        this.log(`🔄 Cambiando a tab: ${tabName}`, 'info');
        
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        
        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        document.getElementById(`${tabName}Panel`)?.classList.add('active');
        
        this.currentTab = tabName;
        
        // Load data for current tab
        if (tabName === 'analytics') {
            this.updateAnalytics();
        }
    }

    // 📊 Load All Data
    async loadAllData() {
        if (!this.firebaseReady) {
            this.loadLocalData();
            return;
        }

        try {
            this.log('📊 Cargando datos ejecutivos...', 'info');
            
            await Promise.all([
                this.loadTransferencias(),
                this.loadPagos()
            ]);
            
            this.renderAllData();
            this.updateDashboardMetrics();
            this.log('✅ Datos ejecutivos cargados completamente', 'success');
            
        } catch (error) {
            this.log(`❌ Error cargando datos: ${error.message}`, 'error');
            this.loadLocalData();
        }
    }

    // 📊 Load Transferencias
    async loadTransferencias() {
        const collection = window.firebaseCollection(window.firebaseDB, EXECUTIVE_CONFIG.COLLECTIONS.TRANSFERENCIAS);
        const q = window.firebaseQuery(collection, window.firebaseOrderBy('fecha', 'desc'));
        const snapshot = await window.firebaseGetDocs(q);
        
        this.transferencias = [];
        snapshot.forEach(doc => {
            this.transferencias.push({ id: doc.id, ...doc.data() });
        });
        
        this.log(`📊 ${this.transferencias.length} transferencias cargadas`, 'info');
    }

    // 💰 Load Pagos
    async loadPagos() {
        const collection = window.firebaseCollection(window.firebaseDB, EXECUTIVE_CONFIG.COLLECTIONS.PAGOS);
        const q = window.firebaseQuery(collection, window.firebaseOrderBy('fecha', 'desc'));
        const snapshot = await window.firebaseGetDocs(q);
        
        this.pagos = [];
        snapshot.forEach(doc => {
            this.pagos.push({ id: doc.id, ...doc.data() });
        });
        
        this.log(`💰 ${this.pagos.length} pagos cargados`, 'info');
    }

    // 💾 Load Local Data
    loadLocalData() {
        try {
            const transferenciasLocal = localStorage.getItem(EXECUTIVE_CONFIG.STORAGE_KEYS.TRANSFERENCIAS);
            const pagosLocal = localStorage.getItem(EXECUTIVE_CONFIG.STORAGE_KEYS.PAGOS);
            
            this.transferencias = transferenciasLocal ? JSON.parse(transferenciasLocal) : [];
            this.pagos = pagosLocal ? JSON.parse(pagosLocal) : [];
            
            this.log(`💾 Datos locales: ${this.transferencias.length} transferencias, ${this.pagos.length} pagos`, 'info');
            
            this.renderAllData();
            this.updateDashboardMetrics();
            
        } catch (error) {
            this.log(`❌ Error cargando datos locales: ${error.message}`, 'error');
            this.transferencias = [];
            this.pagos = [];
        }
    }

    // 💾 Save to Local Storage
    saveToLocalStorage() {
        try {
            localStorage.setItem(EXECUTIVE_CONFIG.STORAGE_KEYS.TRANSFERENCIAS, JSON.stringify(this.transferencias));
            localStorage.setItem(EXECUTIVE_CONFIG.STORAGE_KEYS.PAGOS, JSON.stringify(this.pagos));
            
            if (EXECUTIVE_CONFIG.DEBUG) {
                this.log('💾 Datos guardados en localStorage', 'info');
            }
        } catch (error) {
            this.log('❌ Error guardando en localStorage', 'error');
        }
    }

    // 🎨 Render All Data
    renderAllData() {
        this.renderTransferencias();
        this.renderPagos();
        this.updateRecordCounts();
    }

    // 📊 Update Dashboard Metrics
    updateDashboardMetrics() {
        const totalTransferencias = this.transferencias.length;
        const totalPagos = this.pagos.length;
        const totalCajas = this.pagos.reduce((sum, pago) => sum + (pago.cajasPagadas || 0), 0);
        const montoTotal = this.pagos.reduce((sum, pago) => sum + (pago.totalPago || 0), 0);
        
        this.updateMetricCard('totalTransferencias', totalTransferencias);
        this.updateMetricCard('totalPagos', totalPagos);
        this.updateMetricCard('totalCajas', totalCajas);
        this.updateMetricCard('montoTotal', this.formatCurrency(montoTotal));
        
        // Update trend indicators (simulated)
        this.updateTrendIndicators();
    }

    // 📈 Update Metric Card
    updateMetricCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Add counting animation
            this.animateCounter(element, element.textContent, value);
        }
    }

    // ✨ Animate Counter
    animateCounter(element, from, to) {
        const fromValue = typeof from === 'string' ? parseFloat(from.replace(/[^\d.-]/g, '')) || 0 : from;
        const toValue = typeof to === 'string' ? parseFloat(to.replace(/[^\d.-]/g, '')) || 0 : to;
        
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = fromValue + (toValue - fromValue) * easeOut;
            
            if (typeof to === 'string' && to.includes('$')) {
                element.textContent = this.formatCurrency(current);
            } else {
                element.textContent = Math.round(current);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = to;
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 📈 Update Trend Indicators
    updateTrendIndicators() {
        // Simulated trend calculations
        const trends = {
            transferencias: Math.random() > 0.5 ? 'positive' : 'negative',
            pagos: Math.random() > 0.7 ? 'positive' : 'neutral',
            cajas: 'neutral',
            monto: 'positive'
        };
        
        // Update trend classes and percentages
        Object.entries(trends).forEach(([key, trend]) => {
            const trendElement = document.querySelector(`#total${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (trendElement) {
                const cardTrend = trendElement.closest('.dashboard-card')?.querySelector('.card-trend');
                if (cardTrend) {
                    cardTrend.className = `card-trend ${trend}`;
                }
            }
        });
    }

    // 🔍 Handle Search
    handleSearch(type, value) {
        this.searchFilters[type] = value.toLowerCase().trim();
        
        if (type === 'transferencias') {
            this.renderTransferencias();
        } else if (type === 'pagos') {
            this.renderPagos();
        }
        
        this.log(`🔍 Búsqueda ${type}: "${value}"`, 'info');
    }

    // 🎛️ Handle Filter
    handleFilter(filterType, value) {
        this.searchFilters[filterType] = value;
        
        if (filterType === 'distribuidora') {
            this.renderTransferencias();
        } else if (filterType === 'producto') {
            this.renderPagos();
        }
        
        this.log(`🎛️ Filtro ${filterType}: "${value}"`, 'info');
    }

    // 💰 Calculate Payment Total
    calculatePaymentTotal() {
        const cajas = parseFloat(document.getElementById('cajasPagadas')?.value) || 0;
        const valor = parseFloat(document.getElementById('valorUnitario')?.value) || 0;
        const total = cajas * valor;
        
        const totalElement = document.getElementById('totalPago');
        if (totalElement) {
            totalElement.value = total > 0 ? this.formatCurrency(total) : '';
        }
    }

    // 💱 Format Currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // 📱 Update Connection Indicator
    updateConnectionIndicator(status, message) {
        const indicator = document.getElementById('connectionIndicator');
        const dot = indicator?.querySelector('.indicator-dot');
        const text = indicator?.querySelector('.indicator-text');
        
        if (dot && text) {
            dot.className = `indicator-dot ${status}`;
            text.textContent = message;
        }
    }

    // 📝 Logging System
    log(message, type = 'info') {
        const logContainer = document.getElementById('logContainer');
        if (!logContainer) return;
        
        const timestamp = new Date().toLocaleTimeString('es-CO');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        
        const icons = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        };
        
        logEntry.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            ${icons[type]} ${message}
        `;
        
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Console log with colors
        const colors = {
            'info': 'color: #3b82f6',
            'success': 'color: #059669',
            'warning': 'color: #d97706',
            'error': 'color: #dc2626'
        };
        
        console.log(`%c[Executive System] ${message}`, colors[type]);
        
        // Keep only last 100 entries
        const entries = logContainer.querySelectorAll('.log-entry');
        if (entries.length > 100) {
            entries[0].remove();
        }
    }

    // ⏱️ Debounce Utility
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ⌨️ Keyboard Shortcuts
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + S: Save current form
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            this.saveCurrentForm();
        }
        
        // Escape: Close modals
        if (event.key === 'Escape') {
            this.closeAllModals();
        }
        
        // Ctrl/Cmd + F: Focus search
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            this.focusCurrentSearch();
        }
    }

    // 💾 Save Current Form
    saveCurrentForm() {
        const activeTab = document.querySelector('.tab-panel.active');
        const form = activeTab?.querySelector('form');
        
        if (form) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
        }
    }

    // ❌ Close All Modals
    closeAllModals() {
        document.querySelectorAll('.executive-modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        document.getElementById('modalOverlay')?.classList.remove('active');
    }

    // 🔍 Focus Current Search
    focusCurrentSearch() {
        const activeTab = document.querySelector('.tab-panel.active');
        const searchInput = activeTab?.querySelector('input[type="text"]');
        
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    // 🪟 Handle Window Focus
    handleWindowFocus() {
        if (this.firebaseReady) {
            // Refresh data when window regains focus
            this.loadAllData();
        }
    }
}

// 🌐 Global Functions for HTML Integration
let executiveSystem;

// System initialization
document.addEventListener('DOMContentLoaded', () => {
    executiveSystem = new ExecutiveTransferSystem();
    console.log('🏢 Executive Transfer System initialized');
});

// Modal functions
function showQuickAdd() {
    document.getElementById('quickAddModal')?.classList.add('active');
    document.getElementById('modalOverlay')?.classList.add('active');
}

function closeQuickAdd() {
    document.getElementById('quickAddModal')?.classList.remove('active');
    document.getElementById('modalOverlay')?.classList.remove('active');
}

function showNotifications() {
    document.getElementById('notificationsModal')?.classList.add('active');
    document.getElementById('modalOverlay')?.classList.add('active');
}

function closeNotifications() {
    document.getElementById('notificationsModal')?.classList.remove('active');
    document.getElementById('modalOverlay')?.classList.remove('active');
}

// Quick actions
function quickAddTransferencia() {
    closeQuickAdd();
    executiveSystem?.switchTab('transferencias');
    document.getElementById('distribuidora')?.focus();
}

function quickAddPago() {
    closeQuickAdd();
    executiveSystem?.switchTab('pagos');
    document.getElementById('clientePago')?.focus();
}

// Utility functions
function refreshData() {
    executiveSystem?.loadAllData();
}

function exportData() {
    if (executiveSystem?.currentTab === 'transferencias') {
        executiveSystem?.exportTransferencias();
    } else if (executiveSystem?.currentTab === 'pagos') {
        executiveSystem?.exportPagos();
    }
}

function toggleSettings() {
    console.log('Settings panel - Coming soon');
}

function clearLog() {
    const logContainer = document.getElementById('logContainer');
    if (logContainer) {
        logContainer.innerHTML = '';
        executiveSystem?.log('🧹 Log ejecutivo limpiado', 'info');
    }
}

function exportLog() {
    const logContainer = document.getElementById('logContainer');
    const logEntries = Array.from(logContainer?.querySelectorAll('.log-entry') || [])
        .map(entry => entry.textContent.trim())
        .join('\n');
    
    const blob = new Blob([logEntries], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive_log_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Performance monitoring
window.addEventListener('load', () => {
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`🚀 Executive System loaded in ${loadTime}ms`);
    }
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('Executive System Error:', event.error);
    executiveSystem?.log(`💥 Error del sistema: ${event.error.message}`, 'error');
});

// Debug utilities
window.executiveDebug = {
    getStatus: () => executiveSystem,
    reloadData: () => executiveSystem?.loadAllData(),
    clearStorage: () => {
        Object.values(EXECUTIVE_CONFIG.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('🧹 Storage cleared');
    },
    exportConfig: () => EXECUTIVE_CONFIG
};
