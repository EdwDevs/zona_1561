/**
 * 🏢 SISTEMA EJECUTIVO COMPLETO - TRANSFERENCIAS
 * JavaScript completo con todas las funciones implementadas
 * @version: Executive Complete 5.0
 * @bugfix: Todas las funciones de renderizado incluidas
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

// 🎯 Executive System Class - COMPLETA
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
        const searchTransferencias = document.getElementById('searchTransferencias');
        if (searchTransferencias) {
            searchTransferencias.addEventListener('input', 
                this.debounce((e) => this.handleSearch('transferencias', e.target.value), 300));
        }
        
        const searchPagos = document.getElementById('searchPagos');
        if (searchPagos) {
            searchPagos.addEventListener('input', 
                this.debounce((e) => this.handleSearch('pagos', e.target.value), 300));
        }

        // Filter selects
        const filterDistribuidora = document.getElementById('filterDistribuidora');
        if (filterDistribuidora) {
            filterDistribuidora.addEventListener('change', 
                (e) => this.handleFilter('distribuidora', e.target.value));
        }
        
        const filterProducto = document.getElementById('filterProducto');
        if (filterProducto) {
            filterProducto.addEventListener('change', 
                (e) => this.handleFilter('producto', e.target.value));
        }

        // Forms
        const transferenciaForm = document.getElementById('transferenciaForm');
        if (transferenciaForm) {
            transferenciaForm.addEventListener('submit', (e) => this.handleTransferenciaSubmit(e));
        }
        
        const pagoForm = document.getElementById('pagoForm');
        if (pagoForm) {
            pagoForm.addEventListener('submit', (e) => this.handlePagoSubmit(e));
        }

        // Auto-calculate payment total
        ['cajasPagadas', 'valorUnitario'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.calculatePaymentTotal());
            }
        });

        // Modal management
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeAllModals());
        }

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
        
        const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(`${tabName}Panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        
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
            this.renderAllData();
            this.updateDashboardMetrics();
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

    // 🎨 Render All Data - FUNCIÓN FALTANTE IMPLEMENTADA
    renderAllData() {
        this.renderTransferencias();
        this.renderPagos();
        this.updateRecordCounts();
    }

    // 📊 Render Transferencias - FUNCIÓN FALTANTE IMPLEMENTADA
    renderTransferencias() {
        const tableBody = document.getElementById('transferenciasTableBody');
        const emptyState = document.getElementById('transferenciasEmpty');
        
        if (!tableBody) {
            this.log('❌ No se encontró tabla de transferencias', 'warning');
            return;
        }
        
        // Apply filters
        let filteredTransferencias = this.applyTransferenciasFilters();
        
        // Clear table
        tableBody.innerHTML = '';
        
        if (filteredTransferencias.length === 0) {
            this.showEmptyState('transferencias');
            return;
        }
        
        // Hide empty state
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Render rows
        filteredTransferencias.forEach((transferencia, index) => {
            const row = this.createTransferenciaRow(transferencia, index);
            tableBody.appendChild(row);
        });
        
        // Add stagger animation
        this.addStaggerAnimation(tableBody.querySelectorAll('tr'));
        
        this.log(`📊 ${filteredTransferencias.length} transferencias renderizadas`, 'info');
    }

    // 💰 Render Pagos - FUNCIÓN FALTANTE IMPLEMENTADA
    renderPagos() {
        const tableBody = document.getElementById('pagosTableBody');
        const emptyState = document.getElementById('pagosEmpty');
        
        if (!tableBody) {
            this.log('❌ No se encontró tabla de pagos', 'warning');
            return;
        }
        
        // Apply filters
        let filteredPagos = this.applyPagosFilters();
        
        // Clear table
        tableBody.innerHTML = '';
        
        if (filteredPagos.length === 0) {
            this.showEmptyState('pagos');
            return;
        }
        
        // Hide empty state
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Render rows
        filteredPagos.forEach((pago, index) => {
            const row = this.createPagoRow(pago, index);
            tableBody.appendChild(row);
        });
        
        // Add stagger animation
        this.addStaggerAnimation(tableBody.querySelectorAll('tr'));
        
        this.log(`💰 ${filteredPagos.length} pagos renderizados`, 'info');
    }

    // 🔍 Apply Transferencias Filters
    applyTransferenciasFilters() {
        return this.transferencias.filter(transferencia => {
            // Search filter
            const searchTerm = this.searchFilters.transferencias;
            const matchesSearch = !searchTerm || 
                transferencia.cliente?.toLowerCase().includes(searchTerm) ||
                transferencia.distribuidora?.toLowerCase().includes(searchTerm) ||
                transferencia.producto?.toLowerCase().includes(searchTerm) ||
                transferencia.observaciones?.toLowerCase().includes(searchTerm);
            
            // Distribuidora filter
            const distribuidoraFilter = this.searchFilters.distribuidora;
            const matchesDistribuidora = !distribuidoraFilter || 
                transferencia.distribuidora === distribuidoraFilter;
            
            return matchesSearch && matchesDistribuidora;
        });
    }

    // 🔍 Apply Pagos Filters
    applyPagosFilters() {
        return this.pagos.filter(pago => {
            // Search filter
            const searchTerm = this.searchFilters.pagos;
            const matchesSearch = !searchTerm || 
                pago.cliente?.toLowerCase().includes(searchTerm) ||
                pago.producto?.toLowerCase().includes(searchTerm) ||
                pago.observaciones?.toLowerCase().includes(searchTerm);
            
            // Product filter
            const productoFilter = this.searchFilters.producto;
            const matchesProducto = !productoFilter || 
                pago.producto === productoFilter;
            
            return matchesSearch && matchesProducto;
        });
    }

    // 🏗️ Create Transferencia Row
    createTransferenciaRow(transferencia, index) {
        const row = document.createElement('tr');
        row.className = 'data-row';
        
        const fecha = transferencia.fecha ? 
            new Date(transferencia.fecha).toLocaleDateString('es-CO') : 
            'Sin fecha';
        
        row.innerHTML = `
            <td>${fecha}</td>
            <td>
                <span class="distribuidora-badge ${transferencia.distribuidora?.toLowerCase() || ''}">
                    ${transferencia.distribuidora || 'N/A'}
                </span>
            </td>
            <td>${this.highlightSearch(transferencia.cliente || 'Sin cliente', 'transferencias')}</td>
            <td>${this.highlightSearch(transferencia.producto || '-', 'transferencias')}</td>
            <td>${transferencia.cantidad || '-'}</td>
            <td class="observaciones-cell">
                ${this.highlightSearch(transferencia.observaciones || '-', 'transferencias')}
            </td>
            <td>
                <div class="action-buttons">
                    <button onclick="executiveSystem.editTransferencia('${transferencia.id}')" 
                            class="btn btn-edit" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="executiveSystem.deleteTransferencia('${transferencia.id}')" 
                            class="btn btn-delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }

    // 🏗️ Create Pago Row
    createPagoRow(pago, index) {
        const row = document.createElement('tr');
        row.className = 'data-row';
        
        const fecha = pago.fecha ? 
            new Date(pago.fecha).toLocaleDateString('es-CO') : 
            'Sin fecha';
        
        const valorUnitario = pago.valorUnitario ? 
            this.formatCurrency(pago.valorUnitario) : '-';
        
        const total = pago.totalPago ? 
            this.formatCurrency(pago.totalPago) : '-';
        
        row.innerHTML = `
            <td>${fecha}</td>
            <td>${this.highlightSearch(pago.cliente || 'Sin cliente', 'pagos')}</td>
            <td>
                <span class="producto-badge ${this.getProductoBadgeClass(pago.producto)}">
                    ${pago.producto || 'N/A'}
                </span>
            </td>
            <td><strong>${pago.cajasPagadas || 0}</strong></td>
            <td>${valorUnitario}</td>
            <td><strong>${total}</strong></td>
            <td class="observaciones-cell">
                ${this.highlightSearch(pago.observaciones || '-', 'pagos')}
            </td>
            <td>
                <div class="action-buttons">
                    <button onclick="executiveSystem.editPago('${pago.id}')" 
                            class="btn btn-edit" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="executiveSystem.deletePago('${pago.id}')" 
                            class="btn btn-delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }

    // 🏷️ Get Product Badge Class
    getProductoBadgeClass(producto) {
        if (!producto) return '';
        
        const productClass = producto.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        
        return productClass;
    }

    // 🔍 Highlight Search Term
    highlightSearch(text, searchType) {
        const searchTerm = this.searchFilters[searchType];
        if (!searchTerm || !text) return text || '';
        
        const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // 🛡️ Escape Regex
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 📊 Show Empty State
    showEmptyState(type) {
        const emptyState = document.getElementById(`${type}Empty`);
        const tableContainer = document.querySelector(`#${type}Panel .table-wrapper`);
        
        if (emptyState && tableContainer) {
            tableContainer.style.display = 'none';
            emptyState.style.display = 'block';
        }
    }

    // ✨ Add Stagger Animation
    addStaggerAnimation(elements) {
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.3s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // 📊 Update Record Counts - FUNCIÓN FALTANTE IMPLEMENTADA
    updateRecordCounts() {
        const transferenciasCount = document.getElementById('transferenciasCount');
        const pagosCount = document.getElementById('pagosCount');
        
        if (transferenciasCount) {
            const filteredCount = this.applyTransferenciasFilters().length;
            transferenciasCount.textContent = `${filteredCount} registro${filteredCount !== 1 ? 's' : ''}`;
        }
        
        if (pagosCount) {
            const filteredCount = this.applyPagosFilters().length;
            pagosCount.textContent = `${filteredCount} registro${filteredCount !== 1 ? 's' : ''}`;
        }
    }

    // 📝 Handle Transferencia Submit - FUNCIÓN FALTANTE IMPLEMENTADA
    async handleTransferenciaSubmit(event) {
        event.preventDefault();
        
        const formData = {
            distribuidora: document.getElementById('distribuidora')?.value || '',
            cliente: document.getElementById('clienteTransferencia')?.value?.trim() || '',
            producto: document.getElementById('productoTransferencia')?.value?.trim() || '',
            cantidad: parseInt(document.getElementById('cantidadTransferencia')?.value) || 0,
            observaciones: document.getElementById('observacionesTransferencia')?.value?.trim() || '',
            fecha: document.getElementById('fechaTransferencia')?.value || '',
            fechaRegistro: new Date().toISOString()
        };
        
        // Validation
        if (!formData.distribuidora || !formData.cliente || !formData.fecha) {
            alert('Por favor completa los campos obligatorios (Distribuidora, Cliente, Fecha)');
            return;
        }
        
        try {
            if (this.editingId && this.editingType === 'transferencia') {
                await this.updateTransferencia(this.editingId, formData);
            } else {
                await this.addTransferencia(formData);
            }
            
            this.clearTransferenciaForm();
            this.log('✅ Transferencia guardada exitosamente', 'success');
            
        } catch (error) {
            this.log(`❌ Error guardando transferencia: ${error.message}`, 'error');
            alert(`Error: ${error.message}`);
        }
    }

    // 💰 Handle Pago Submit - FUNCIÓN FALTANTE IMPLEMENTADA
    async handlePagoSubmit(event) {
        event.preventDefault();
        
        const cajas = parseInt(document.getElementById('cajasPagadas')?.value) || 0;
        const valor = parseFloat(document.getElementById('valorUnitario')?.value) || 0;
        
        const formData = {
            cliente: document.getElementById('clientePago')?.value?.trim() || '',
            producto: document.getElementById('productoPago')?.value || '',
            cajasPagadas: cajas,
            valorUnitario: valor,
            totalPago: cajas * valor,
            observaciones: document.getElementById('observacionesPago')?.value?.trim() || '',
            fecha: document.getElementById('fechaPago')?.value || '',
            fechaRegistro: new Date().toISOString()
        };
        
        // Validation
        if (!formData.cliente || !formData.producto || !formData.cajasPagadas || !formData.fecha) {
            alert('Por favor completa los campos obligatorios (Cliente, Producto, Cajas, Fecha)');
            return;
        }
        
        try {
            if (this.editingId && this.editingType === 'pago') {
                await this.updatePago(this.editingId, formData);
            } else {
                await this.addPago(formData);
            }
            
            this.clearPagoForm();
            this.log('✅ Pago guardado exitosamente', 'success');
            
        } catch (error) {
            this.log(`❌ Error guardando pago: ${error.message}`, 'error');
            alert(`Error: ${error.message}`);
        }
    }

    // ➕ Add Transferencia
    async addTransferencia(data) {
        if (this.firebaseReady) {
            try {
                const collection = window.firebaseCollection(window.firebaseDB, EXECUTIVE_CONFIG.COLLECTIONS.TRANSFERENCIAS);
                const docRef = await window.firebaseAddDoc(collection, data);
                data.id = docRef.id;
                this.log('✅ Transferencia guardada en Firebase', 'success');
            } catch (error) {
                data.id = 'local_' + Date.now();
                this.log(`📱 Transferencia guardada localmente: ${error.message}`, 'warning');
            }
        } else {
            data.id = 'local_' + Date.now();
            this.log('📱 Transferencia guardada localmente (sin Firebase)', 'warning');
        }
        
        this.transferencias.unshift(data);
        this.saveToLocalStorage();
        this.renderAllData();
        this.updateDashboardMetrics();
    }

    // ➕ Add Pago
    async addPago(data) {
        if (this.firebaseReady) {
            try {
                const collection = window.firebaseCollection(window.firebaseDB, EXECUTIVE_CONFIG.COLLECTIONS.PAGOS);
                const docRef = await window.firebaseAddDoc(collection, data);
                data.id = docRef.id;
                this.log('✅ Pago guardado en Firebase', 'success');
            } catch (error) {
                data.id = 'local_' + Date.now();
                this.log(`📱 Pago guardado localmente: ${error.message}`, 'warning');
            }
        } else {
            data.id = 'local_' + Date.now();
            this.log('📱 Pago guardado localmente (sin Firebase)', 'warning');
        }
        
        this.pagos.unshift(data);
        this.saveToLocalStorage();
        this.renderAllData();
        this.updateDashboardMetrics();
    }

    // ✏️ Edit Transferencia
    editTransferencia(id) {
        const transferencia = this.transferencias.find(t => t.id === id);
        if (!transferencia) {
            this.log(`❌ Transferencia con ID ${id} no encontrada`, 'error');
            return;
        }
        
        // Fill form
        document.getElementById('distribuidora').value = transferencia.distribuidora || '';
        document.getElementById('clienteTransferencia').value = transferencia.cliente || '';
        document.getElementById('productoTransferencia').value = transferencia.producto || '';
        document.getElementById('cantidadTransferencia').value = transferencia.cantidad || '';
        document.getElementById('observacionesTransferencia').value = transferencia.observaciones || '';
        document.getElementById('fechaTransferencia').value = transferencia.fecha || '';
        
        this.editingId = id;
        this.editingType = 'transferencia';
        
        // Switch to transferencias tab and scroll to form
        this.switchTab('transferencias');
        setTimeout(() => {
            document.getElementById('transferenciaForm')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
        
        this.log(`✏️ Editando transferencia: ${transferencia.cliente}`, 'info');
    }

    // ✏️ Edit Pago
    editPago(id) {
        const pago = this.pagos.find(p => p.id === id);
        if (!pago) {
            this.log(`❌ Pago con ID ${id} no encontrada`, 'error');
            return;
        }
        
        // Fill form
        document.getElementById('clientePago').value = pago.cliente || '';
        document.getElementById('productoPago').value = pago.producto || '';
        document.getElementById('cajasPagadas').value = pago.cajasPagadas || '';
        document.getElementById('valorUnitario').value = pago.valorUnitario || '';
        document.getElementById('observacionesPago').value = pago.observaciones || '';
        document.getElementById('fechaPago').value = pago.fecha || '';
        
        // Recalculate total
        this.calculatePaymentTotal();
        
        this.editingId = id;
        this.editingType = 'pago';
        
        // Switch to pagos tab and scroll to form
        this.switchTab('pagos');
        setTimeout(() => {
            document.getElementById('pagoForm')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
        
        this.log(`✏️ Editando pago: ${pago.cliente} - ${pago.producto}`, 'info');
    }

    // 🗑️ Delete Transferencia
    async deleteTransferencia(id) {
        const transferencia = this.transferencias.find(t => t.id === id);
        if (!transferencia) return;
        
        if (!confirm(`¿Eliminar transferencia de ${transferencia.cliente}?\n\nEsta acción no se puede deshacer.`)) {
            return;
        }
        
        const index = this.transferencias.findIndex(t => t.id === id);
        
        if (this.firebaseReady && !id.startsWith('local_')) {
            try {
                const docRef = window.firebaseDoc(window.firebaseDB, EXECUTIVE_CONFIG.COLLECTIONS.TRANSFERENCIAS, id);
                await window.firebaseDeleteDoc(docRef);
                this.log('✅ Transferencia eliminada de Firebase', 'success');
            } catch (error) {
                this.log(`📱 Error Firebase, eliminando localmente: ${error.message}`, 'warning');
            }
        }
        
        this.transferencias.splice(index, 1);
        this.saveToLocalStorage();
        this.renderAllData();
        this.updateDashboardMetrics();
        
        this.log(`🗑️ Transferencia eliminada: ${transferencia.cliente}`, 'info');
    }

    // 🗑️ Delete Pago
    async deletePago(id) {
        const pago = this.pagos.find(p => p.id === id);
        if (!pago) return;
        
        if (!confirm(`¿Eliminar pago de ${pago.cliente} - ${pago.producto}?\n\nEsta acción no se puede deshacer.`)) {
            return;
        }
        
        const index = this.pagos.findIndex(p => p.id === id);
        
        if (this.firebaseReady && !id.startsWith('local_')) {
            try {
                const docRef = window.firebaseDoc(window.firebaseDB, EXECUTIVE_CONFIG.COLLECTIONS.PAGOS, id);
                await window.firebaseDeleteDoc(docRef);
                this.log('✅ Pago eliminado de Firebase', 'success');
            } catch (error) {
                this.log(`📱 Error Firebase, eliminando localmente: ${error.message}`, 'warning');
            }
        }
        
        this.pagos.splice(index, 1);
        this.saveToLocalStorage();
        this.renderAllData();
        this.updateDashboardMetrics();
        
        this.log(`🗑️ Pago eliminado: ${pago.cliente} - ${pago.producto}`, 'info');
    }

    // 🧹 Clear Forms
    clearTransferenciaForm() {
        const form = document.getElementById('transferenciaForm');
        if (form) {
            form.reset();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('fechaTransferencia').value = today;
        }
        
        this.editingId = null;
        this.editingType = null;
    }

    clearPagoForm() {
        const form = document.getElementById('pagoForm');
        if (form) {
            form.reset();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('fechaPago').value = today;
        }
        
        this.editingId = null;
        this.editingType = null;
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

    // 📊 Update Analytics - FUNCIÓN AGREGADA
    updateAnalytics() {
        // Update summary stats
        const totalTransferencias = this.transferencias.length;
        const totalPagos = this.pagos.length;
        const totalCajas = this.pagos.reduce((sum, pago) => sum + (pago.cajasPagadas || 0), 0);
        const montoTotal = this.pagos.reduce((sum, pago) => sum + (pago.totalPago || 0), 0);
        
        document.getElementById('reporteTotalTransferencias').textContent = totalTransferencias;
        document.getElementById('reporteTotalPagos').textContent = totalPagos;
        document.getElementById('reporteTotalCajas').textContent = totalCajas;
        document.getElementById('reporteMontoTotal').textContent = this.formatCurrency(montoTotal);
        
        // Update distributor stats
        const drosanTransferencias = this.transferencias.filter(t => t.distribuidora === 'DROSAN').length;
        const unidrogasTransferencias = this.transferencias.filter(t => t.distribuidora === 'UNIDROGAS').length;
        
        document.getElementById('drosanTransferencias').textContent = drosanTransferencias;
        document.getElementById('unidrogasTransferencias').textContent = unidrogasTransferencias;
        
        // Count unique products
        const drosanProductos = new Set(
            this.transferencias.filter(t => t.distribuidora === 'DROSAN' && t.producto)
                             .map(t => t.producto)
        ).size;
        const unidrogasProductos = new Set(
            this.transferencias.filter(t => t.distribuidora === 'UNIDROGAS' && t.producto)
                             .map(t => t.producto)
        ).size;
        
        document.getElementById('drosanProductos').textContent = drosanProductos;
        document.getElementById('unidrogasProductos').textContent = unidrogasProductos;
        
        // Update product analytics
        const descongelPagos = this.pagos.filter(p => p.producto === 'DESCONGELX100');
        const multidol400Pagos = this.pagos.filter(p => p.producto === 'MULTIDOL X400');
        const multidol800Pagos = this.pagos.filter(p => p.producto === 'MULTIDOL X800');
        
        const descongelCajas = descongelPagos.reduce((sum, p) => sum + p.cajasPagadas, 0);
        const multidol400Cajas = multidol400Pagos.reduce((sum, p) => sum + p.cajasPagadas, 0);
        const multidol800Cajas = multidol800Pagos.reduce((sum, p) => sum + p.cajasPagadas, 0);
        
        const descongelTotal = descongelPagos.reduce((sum, p) => sum + (p.totalPago || 0), 0);
        const multidol400Total = multidol400Pagos.reduce((sum, p) => sum + (p.totalPago || 0), 0);
        const multidol800Total = multidol800Pagos.reduce((sum, p) => sum + (p.totalPago || 0), 0);
        
        document.getElementById('descongelCajas').textContent = descongelCajas;
        document.getElementById('multidol400Cajas').textContent = multidol400Cajas;
        document.getElementById('multidol800Cajas').textContent = multidol800Cajas;
        
        document.getElementById('descongelTotal').textContent = this.formatCurrency(descongelTotal);
        document.getElementById('multidol400Total').textContent = this.formatCurrency(multidol400Total);
        document.getElementById('multidol800Total').textContent = this.formatCurrency(multidol800Total);
    }

    // 🔍 Handle Search
    handleSearch(type, value) {
        this.searchFilters[type] = value.toLowerCase().trim();
        
        if (type === 'transferencias') {
            this.renderTransferencias();
        } else if (type === 'pagos') {
            this.renderPagos();
        }
        
        this.updateRecordCounts();
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
        
        this.updateRecordCounts();
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
        
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
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

    // 📤 Export Functions
    exportTransferencias() {
        try {
            const dataToExport = this.transferencias.map((t, index) => ({
                'N°': index + 1,
                'FECHA': t.fecha ? new Date(t.fecha).toLocaleDateString('es-CO') : '',
                'DISTRIBUIDORA': t.distribuidora || '',
                'CLIENTE': t.cliente || '',
                'PRODUCTO': t.producto || '',
                'CANTIDAD': t.cantidad || '',
                'OBSERVACIONES': t.observaciones || '',
                'FECHA_REGISTRO': t.fechaRegistro ? new Date(t.fechaRegistro).toLocaleString('es-CO') : ''
            }));
            
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Transferencias');
            
            const fecha = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `Transferencias_Ejecutivo_${fecha}.xlsx`);
            
            this.log(`📊 Excel exportado: ${this.transferencias.length} transferencias`, 'success');
            
        } catch (error) {
            this.log(`❌ Error exportando: ${error.message}`, 'error');
            alert('Error al exportar transferencias');
        }
    }

    exportPagos() {
        try {
            const dataToExport = this.pagos.map((p, index) => ({
                'N°': index + 1,
                'FECHA': p.fecha ? new Date(p.fecha).toLocaleDateString('es-CO') : '',
                'CLIENTE': p.cliente || '',
                'PRODUCTO': p.producto || '',
                'CAJAS_PAGADAS': p.cajasPagadas || 0,
                'VALOR_UNITARIO': p.valorUnitario || 0,
                'TOTAL_PAGO': p.totalPago || 0,
                'OBSERVACIONES': p.observaciones || '',
                'FECHA_REGISTRO': p.fechaRegistro ? new Date(p.fechaRegistro).toLocaleString('es-CO') : ''
            }));
            
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Pagos_Productos');
            
            const fecha = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `Pagos_Ejecutivo_${fecha}.xlsx`);
            
            this.log(`📊 Excel exportado: ${this.pagos.length} pagos`, 'success');
            
        } catch (error) {
            this.log(`❌ Error exportando: ${error.message}`, 'error');
            alert('Error al exportar pagos');
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
    const modal = document.getElementById('quickAddModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
    }
}

function closeQuickAdd() {
    const modal = document.getElementById('quickAddModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function showNotifications() {
    const modal = document.getElementById('notificationsModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
    }
}

function closeNotifications() {
    const modal = document.getElementById('notificationsModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Quick actions
function quickAddTransferencia() {
    closeQuickAdd();
    if (executiveSystem) {
        executiveSystem.switchTab('transferencias');
        setTimeout(() => {
            const element = document.getElementById('distribuidora');
            if (element) element.focus();
        }, 100);
    }
}

function quickAddPago() {
    closeQuickAdd();
    if (executiveSystem) {
        executiveSystem.switchTab('pagos');
        setTimeout(() => {
            const element = document.getElementById('clientePago');
            if (element) element.focus();
        }, 100);
    }
}

// Utility functions
function refreshData() {
    if (executiveSystem) {
        executiveSystem.loadAllData();
    }
}

function exportData() {
    if (!executiveSystem) return;
    
    if (executiveSystem.currentTab === 'transferencias') {
        executiveSystem.exportTransferencias();
    } else if (executiveSystem.currentTab === 'pagos') {
        executiveSystem.exportPagos();
    }
}

function toggleSettings() {
    console.log('Settings panel - Coming soon');
}

function clearLog() {
    const logContainer = document.getElementById('logContainer');
    if (logContainer) {
        logContainer.innerHTML = '';
        if (executiveSystem) {
            executiveSystem.log('🧹 Log ejecutivo limpiado', 'info');
        }
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

// Form clearing functions
function clearTransferenciaForm() {
    if (executiveSystem) {
        executiveSystem.clearTransferenciaForm();
    }
}

function clearPagoForm() {
    if (executiveSystem) {
        executiveSystem.clearPagoForm();
    }
}

// Focus functions
function focusFirstInput() {
    const element = document.getElementById('distribuidora');
    if (element) element.focus();
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
    if (executiveSystem) {
        executiveSystem.log(`💥 Error del sistema: ${event.error.message}`, 'error');
    }
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
    exportConfig: () => EXECUTIVE_CONFIG,
    testData: () => {
        if (executiveSystem) {
            console.log('Transferencias:', executiveSystem.transferencias);
            console.log('Pagos:', executiveSystem.pagos);
        }
    }
};
