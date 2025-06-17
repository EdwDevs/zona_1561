/**
 * 🏢 SISTEMA DE TRANSFERENCIAS - DROSAN & UNIDROGAS
 * Control de transferencias y pagos de productos
 * @version: 1.0.0
 */

// 🎯 Variables globales
let firebaseReady = false;
let transferencias = [];
let pagos = [];
let editingId = null;
let editingType = null; // 'transferencia' o 'pago'

const COLLECTIONS = {
    TRANSFERENCIAS: 'transferencias_drosan_unidrogas',
    PAGOS: 'pagos_productos'
};

// 🚀 Inicialización
document.addEventListener('DOMContentLoaded', () => {
    log('🚀 Iniciando Sistema de Transferencias...', 'info');
    setupEventListeners();
    initializeForms();
    
    // Escuchar Firebase
    window.addEventListener('firebaseReady', handleFirebaseReady);
    window.addEventListener('firebaseError', handleFirebaseError);
    
    updateConnectionStatus('connecting', 'Conectando...', 'Inicializando sistema...');
    
    setTimeout(checkConnectionTimeout, 10000);
});

// ✅ Firebase listo
function handleFirebaseReady() {
    firebaseReady = true;
    log('✅ Firebase conectado - Sistema listo', 'success');
    updateConnectionStatus('connected', '✅ Sistema Operativo', 'Conectado a zona1561-4de30');
    
    loadData();
}

// ❌ Error Firebase
function handleFirebaseError(event) {
    const error = event.detail;
    log(`❌ Error Firebase: ${error.message}`, 'error');
    updateConnectionStatus('error', '❌ Error Conexión', error.message);
    loadLocalData();
}

// ⏰ Timeout conexión
function checkConnectionTimeout() {
    if (!firebaseReady) {
        log('⏰ Timeout - Trabajando offline', 'warning');
        updateConnectionStatus('error', '⏰ Modo Offline', 'Usando datos locales');
        loadLocalData();
    }
}

// 🎯 Configurar event listeners
function setupEventListeners() {
    // Formularios
    document.getElementById('transferenciaForm').addEventListener('submit', handleTransferenciaSubmit);
    document.getElementById('pagoForm').addEventListener('submit', handlePagoSubmit);
    
    // Búsquedas
    document.getElementById('searchTransferencias').addEventListener('input', 
        debounce(() => filterTransferencias(), 300));
    document.getElementById('searchPagos').addEventListener('input', 
        debounce(() => filterPagos(), 300));
    
    // Cálculo automático en pagos
    document.getElementById('cajasPagadas').addEventListener('input', calcularTotalPago);
    document.getElementById('valorUnitario').addEventListener('input', calcularTotalPago);
}

// 📅 Inicializar formularios
function initializeForms() {
    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaTransferencia').value = today;
    document.getElementById('fechaPago').value = today;
}

// 💰 Calcular total de pago
function calcularTotalPago() {
    const cajas = parseFloat(document.getElementById('cajasPagadas').value) || 0;
    const valor = parseFloat(document.getElementById('valorUnitario').value) || 0;
    const total = cajas * valor;
    
    document.getElementById('totalPago').value = total > 0 ? 
        `$${total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}` : '';
}

// 📊 Cargar datos
async function loadData() {
    if (!firebaseReady) {
        loadLocalData();
        return;
    }

    try {
        log('📊 Cargando datos desde Firebase...', 'info');
        
        // Cargar transferencias
        const transferenciasQuery = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDB, COLLECTIONS.TRANSFERENCIAS),
            window.firebaseOrderBy('fecha', 'desc')
        );
        const transferenciasSnapshot = await window.firebaseGetDocs(transferenciasQuery);
        
        transferencias = [];
        transferenciasSnapshot.forEach((doc) => {
            transferencias.push({ id: doc.id, ...doc.data() });
        });
        
        // Cargar pagos
        const pagosQuery = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDB, COLLECTIONS.PAGOS),
            window.firebaseOrderBy('fecha', 'desc')
        );
        const pagosSnapshot = await window.firebaseGetDocs(pagosQuery);
        
        pagos = [];
        pagosSnapshot.forEach((doc) => {
            pagos.push({ id: doc.id, ...doc.data() });
        });
        
        log(`✅ Datos cargados: ${transferencias.length} transferencias, ${pagos.length} pagos`, 'success');
        
        renderData();
        updateStats();
        updateReports();
        
    } catch (error) {
        log(`❌ Error cargando datos: ${error.message}`, 'error');
        loadLocalData();
    }
}

// 💾 Cargar datos locales
function loadLocalData() {
    try {
        const localTransferencias = localStorage.getItem('transferencias_local');
        const localPagos = localStorage.getItem('pagos_local');
        
        transferencias = localTransferencias ? JSON.parse(localTransferencias) : [];
        pagos = localPagos ? JSON.parse(localPagos) : [];
        
        log(`📱 Datos locales: ${transferencias.length} transferencias, ${pagos.length} pagos`, 'info');
        
        renderData();
        updateStats();
        updateReports();
        
    } catch (error) {
        log(`❌ Error cargando datos locales: ${error.message}`, 'error');
        transferencias = [];
        pagos = [];
    }
}

// 💾 Guardar datos locales
function saveLocalData() {
    try {
        localStorage.setItem('transferencias_local', JSON.stringify(transferencias));
        localStorage.setItem('pagos_local', JSON.stringify(pagos));
    } catch (error) {
        log('❌ Error guardando datos locales', 'error');
    }
}

// 📝 Manejar envío transferencia
async function handleTransferenciaSubmit(e) {
    e.preventDefault();
    
    const formData = {
        distribuidora: document.getElementById('distribuidora').value,
        cliente: document.getElementById('clienteTransferencia').value.trim(),
        producto: document.getElementById('productoTransferencia').value.trim(),
        cantidad: parseInt(document.getElementById('cantidadTransferencia').value) || 0,
        observaciones: document.getElementById('observacionesTransferencia').value.trim(),
        fecha: document.getElementById('fechaTransferencia').value,
        fechaRegistro: new Date().toISOString()
    };
    
    if (!formData.distribuidora || !formData.cliente || !formData.fecha) {
        alert('Por favor completa los campos obligatorios');
        return;
    }
    
    try {
        if (editingId && editingType === 'transferencia') {
            await updateTransferencia(editingId, formData);
        } else {
            await addTransferencia(formData);
        }
        
        clearTransferenciaForm();
        
    } catch (error) {
        log(`❌ Error guardando transferencia: ${error.message}`, 'error');
        alert(`Error: ${error.message}`);
    }
}

// 📝 Manejar envío pago
async function handlePagoSubmit(e) {
    e.preventDefault();
    
    const cajas = parseInt(document.getElementById('cajasPagadas').value) || 0;
    const valor = parseFloat(document.getElementById('valorUnitario').value) || 0;
    
    const formData = {
        cliente: document.getElementById('clientePago').value.trim(),
        producto: document.getElementById('productoPago').value,
        cajasPagadas: cajas,
        valorUnitario: valor,
        totalPago: cajas * valor,
        observaciones: document.getElementById('observacionesPago').value.trim(),
        fecha: document.getElementById('fechaPago').value,
        fechaRegistro: new Date().toISOString()
    };
    
    if (!formData.cliente || !formData.producto || !formData.cajasPagadas || !formData.fecha) {
        alert('Por favor completa los campos obligatorios');
        return;
    }
    
    try {
        if (editingId && editingType === 'pago') {
            await updatePago(editingId, formData);
        } else {
            await addPago(formData);
        }
        
        clearPagoForm();
        
    } catch (error) {
        log(`❌ Error guardando pago: ${error.message}`, 'error');
        alert(`Error: ${error.message}`);
    }
}

// ➕ Agregar transferencia
async function addTransferencia(data) {
    if (firebaseReady) {
        try {
            const collection = window.firebaseCollection(window.firebaseDB, COLLECTIONS.TRANSFERENCIAS);
            const docRef = await window.firebaseAddDoc(collection, data);
            data.id = docRef.id;
            log(`✅ Transferencia guardada en Firebase`, 'success');
        } catch (error) {
            data.id = 'local_' + Date.now();
            log(`📱 Transferencia guardada localmente: ${error.message}`, 'warning');
        }
    } else {
        data.id = 'local_' + Date.now();
        log(`📱 Transferencia guardada localmente`, 'warning');
    }
    
    transferencias.unshift(data);
    saveLocalData();
    renderData();
    updateStats();
    updateReports();
}

// ➕ Agregar pago
async function addPago(data) {
    if (firebaseReady) {
        try {
            const collection = window.firebaseCollection(window.firebaseDB, COLLECTIONS.PAGOS);
            const docRef = await window.firebaseAddDoc(collection, data);
            data.id = docRef.id;
            log(`✅ Pago guardado en Firebase`, 'success');
        } catch (error) {
            data.id = 'local_' + Date.now();
            log(`📱 Pago guardado localmente: ${error.message}`, 'warning');
        }
    } else {
        data.id = 'local_' + Date.now();
        log(`📱 Pago guardado localmente`, 'warning');
    }
    
    pagos.unshift(data);
    saveLocalData();
    renderData();
    updateStats();
    updateReports();
}

// ✏️ Actualizar transferencia
async function updateTransferencia(id, data) {
    const index = transferencias.findIndex(t => t.id === id);
    if (index === -1) return;
    
    if (firebaseReady && !id.startsWith('local_')) {
        try {
            const docRef = window.firebaseDoc(window.firebaseDB, COLLECTIONS.TRANSFERENCIAS, id);
            await window.firebaseUpdateDoc(docRef, data);
            log(`✅ Transferencia actualizada en Firebase`, 'success');
        } catch (error) {
            log(`📱 Error Firebase, actualizando localmente: ${error.message}`, 'warning');
        }
    }
    
    transferencias[index] = { ...transferencias[index], ...data };
    saveLocalData();
    renderData();
    updateStats();
    updateReports();
}

// ✏️ Actualizar pago
async function updatePago(id, data) {
    const index = pagos.findIndex(p => p.id === id);
    if (index === -1) return;
    
    if (firebaseReady && !id.startsWith('local_')) {
        try {
            const docRef = window.firebaseDoc(window.firebaseDB, COLLECTIONS.PAGOS, id);
            await window.firebaseUpdateDoc(docRef, data);
            log(`✅ Pago actualizado en Firebase`, 'success');
        } catch (error) {
            log(`📱 Error Firebase, actualizando localmente: ${error.message}`, 'warning');
        }
    }
    
    pagos[index] = { ...pagos[index], ...data };
    saveLocalData();
    renderData();
    updateStats();
    updateReports();
}

// 🗑️ Eliminar transferencia
async function deleteTransferencia(id) {
    const transferencia = transferencias.find(t => t.id === id);
    if (!transferencia) return;
    
    if (!confirm(`¿Eliminar transferencia de ${transferencia.cliente}?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    const index = transferencias.findIndex(t => t.id === id);
    
    if (firebaseReady && !id.startsWith('local_')) {
        try {
            const docRef = window.firebaseDoc(window.firebaseDB, COLLECTIONS.TRANSFERENCIAS, id);
            await window.firebaseDeleteDoc(docRef);
            log(`✅ Transferencia eliminada de Firebase`, 'success');
        } catch (error) {
            log(`📱 Error Firebase, eliminando localmente: ${error.message}`, 'warning');
        }
    }
    
    transferencias.splice(index, 1);
    saveLocalData();
    renderData();
    updateStats();
    updateReports();
    
    log(`🗑️ Transferencia eliminada`, 'info');
}

// 🗑️ Eliminar pago
async function deletePago(id) {
    const pago = pagos.find(p => p.id === id);
    if (!pago) return;
    
    if (!confirm(`¿Eliminar pago de ${pago.cliente} - ${pago.producto}?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    const index = pagos.findIndex(p => p.id === id);
    
    if (firebaseReady && !id.startsWith('local_')) {
        try {
            const docRef = window.firebaseDoc(window.firebaseDB, COLLECTIONS.PAGOS, id);
            await window.firebaseDeleteDoc(docRef);
            log(`✅ Pago eliminado de Firebase`, 'success');
        } catch (error) {
            log(`📱 Error Firebase, eliminando localmente: ${error.message}`, 'warning');
        }
    }
    
    pagos.splice(index, 1);
    saveLocalData();
    renderData();
    updateStats();
    updateReports();
    
    log(`🗑️ Pago eliminado`, 'info');
}

// 🎨 Renderizar datos
function renderData() {
    renderTransferencias();
    renderPagos();
}

// 🎨 Renderizar transferencias
function renderTransferencias(lista = transferencias) {
    const tableBody = document.getElementById('transferenciasTableBody');
    const emptyState = document.getElementById('transferenciasEmpty');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (lista.length === 0) {
        document.querySelector('#transferenciasTab .table-container').style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    document.querySelector('#transferenciasTab .table-container').style.display = 'block';
    emptyState.style.display = 'none';
    
    lista.forEach((transferencia) => {
        const row = document.createElement('tr');
        row.className = 'data-row';
        
        const fecha = new Date(transferencia.fecha).toLocaleDateString('es-CO');
        
        row.innerHTML = `
            <td>${fecha}</td>
            <td>
                <span class="distribuidora-badge ${transferencia.distribuidora.toLowerCase()}">
                    ${transferencia.distribuidora}
                </span>
            </td>
            <td>${highlightSearch(transferencia.cliente, 'searchTransferencias')}</td>
            <td>${highlightSearch(transferencia.producto || '-', 'searchTransferencias')}</td>
            <td>${transferencia.cantidad || '-'}</td>
            <td class="observaciones-cell">
                ${highlightSearch(transferencia.observaciones || '-', 'searchTransferencias')}
            </td>
            <td>
                <div class="action-buttons">
                    <button onclick="editTransferencia('${transferencia.id}')" class="btn btn-edit" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTransferencia('${transferencia.id}')" class="btn btn-delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    animateRows('#transferenciasTab .data-row');
}

// 🎨 Renderizar pagos
function renderPagos(lista = pagos) {
    const tableBody = document.getElementById('pagosTableBody');
    const emptyState = document.getElementById('pagosEmpty');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (lista.length === 0) {
        document.querySelector('#pagosTab .table-container').style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    document.querySelector('#pagosTab .table-container').style.display = 'block';
    emptyState.style.display = 'none';
    
    lista.forEach((pago) => {
        const row = document.createElement('tr');
        row.className = 'data-row';
        
        const fecha = new Date(pago.fecha).toLocaleDateString('es-CO');
        const valorUnitario = pago.valorUnitario ? 
            `$${pago.valorUnitario.toLocaleString('es-CO')}` : '-';
        const total = pago.totalPago ? 
            `$${pago.totalPago.toLocaleString('es-CO')}` : '-';
        
        row.innerHTML = `
            <td>${fecha}</td>
            <td>${highlightSearch(pago.cliente, 'searchPagos')}</td>
            <td>
                <span class="producto-badge ${pago.producto.toLowerCase().replace(/\s+/g, '-')}">
                    ${pago.producto}
                </span>
            </td>
            <td><strong>${pago.cajasPagadas}</strong></td>
            <td>${valorUnitario}</td>
            <td><strong>${total}</strong></td>
            <td class="observaciones-cell">
                ${highlightSearch(pago.observaciones || '-', 'searchPagos')}
            </td>
            <td>
                <div class="action-buttons">
                    <button onclick="editPago('${pago.id}')" class="btn btn-edit" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deletePago('${pago.id}')" class="btn btn-delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    animateRows('#pagosTab .data-row');
}

// 🔍 Filtrar transferencias
function filterTransferencias() {
    const searchTerm = document.getElementById('searchTransferencias').value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderTransferencias();
        return;
    }
    
    const filtered = transferencias.filter(t => 
        t.cliente.toLowerCase().includes(searchTerm) ||
        t.distribuidora.toLowerCase().includes(searchTerm) ||
        (t.producto && t.producto.toLowerCase().includes(searchTerm)) ||
        (t.observaciones && t.observaciones.toLowerCase().includes(searchTerm))
    );
    
    renderTransferencias(filtered);
    log(`🔍 Transferencias filtradas: ${filtered.length}/${transferencias.length}`, 'info');
}

// 🔍 Filtrar pagos
function filterPagos() {
    const searchTerm = document.getElementById('searchPagos').value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderPagos();
        return;
    }
    
    const filtered = pagos.filter(p => 
        p.cliente.toLowerCase().includes(searchTerm) ||
        p.producto.toLowerCase().includes(searchTerm) ||
        (p.observaciones && p.observaciones.toLowerCase().includes(searchTerm))
    );
    
    renderPagos(filtered);
    log(`🔍 Pagos filtrados: ${filtered.length}/${pagos.length}`, 'info');
}

// 🔍 Resaltar búsqueda
function highlightSearch(text, inputId) {
    const searchTerm = document.getElementById(inputId).value.trim();
    if (!searchTerm || !text) return text || '';
    
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// 🛡️ Escapar regex
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ✏️ Editar transferencia
function editTransferencia(id) {
    const transferencia = transferencias.find(t => t.id === id);
    if (!transferencia) return;
    
    document.getElementById('distribuidora').value = transferencia.distribuidora;
    document.getElementById('clienteTransferencia').value = transferencia.cliente;
    document.getElementById('productoTransferencia').value = transferencia.producto || '';
    document.getElementById('cantidadTransferencia').value = transferencia.cantidad || '';
    document.getElementById('observacionesTransferencia').value = transferencia.observaciones || '';
    document.getElementById('fechaTransferencia').value = transferencia.fecha;
    
    editingId = id;
    editingType = 'transferencia';
    
    // Cambiar a tab de transferencias y scroll
    showTab('transferencias');
    document.getElementById('transferenciaForm').scrollIntoView({ behavior: 'smooth' });
    
    log(`✏️ Editando transferencia: ${transferencia.cliente}`, 'info');
}

// ✏️ Editar pago
function editPago(id) {
    const pago = pagos.find(p => p.id === id);
    if (!pago) return;
    
    document.getElementById('clientePago').value = pago.cliente;
    document.getElementById('productoPago').value = pago.producto;
    document.getElementById('cajasPagadas').value = pago.cajasPagadas;
    document.getElementById('valorUnitario').value = pago.valorUnitario || '';
    document.getElementById('observacionesPago').value = pago.observaciones || '';
    document.getElementById('fechaPago').value = pago.fecha;
    
    calcularTotalPago();
    
    editingId = id;
    editingType = 'pago';
    
    // Cambiar a tab de pagos y scroll
    showTab('pagos');
    document.getElementById('pagoForm').scrollIntoView({ behavior: 'smooth' });
    
    log(`✏️ Editando pago: ${pago.cliente} - ${pago.producto}`, 'info');
}

// 🧹 Limpiar formulario transferencia
function clearTransferenciaForm() {
    document.getElementById('transferenciaForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaTransferencia').value = today;
    editingId = null;
    editingType = null;
}

// 🧹 Limpiar formulario pago
function clearPagoForm() {
    document.getElementById('pagoForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaPago').value = today;
    editingId = null;
    editingType = null;
}

// 📊 Actualizar estadísticas
function updateStats() {
    const totalTransferenciasEl = document.getElementById('totalTransferencias');
    const totalPagosEl = document.getElementById('totalPagos');
    const montoTotalEl = document.getElementById('montoTotal');
    
    if (totalTransferenciasEl) totalTransferenciasEl.textContent = transferencias.length;
    if (totalPagosEl) totalPagosEl.textContent = pagos.length;
    
    const montoTotal = pagos.reduce((sum, pago) => sum + (pago.totalPago || 0), 0);
    if (montoTotalEl) {
        montoTotalEl.textContent = `$${montoTotal.toLocaleString('es-CO')}`;
    }
}

// 📊 Actualizar reportes
function updateReports() {
    // Estadísticas generales
    document.getElementById('reporteTotalTransferencias').textContent = transferencias.length;
    document.getElementById('reporteTotalPagos').textContent = pagos.length;
    
    const totalCajas = pagos.reduce((sum, pago) => sum + (pago.cajasPagadas || 0), 0);
    document.getElementById('reporteTotalCajas').textContent = totalCajas;
    
    const montoTotal = pagos.reduce((sum, pago) => sum + (pago.totalPago || 0), 0);
    document.getElementById('reporteMontoTotal').textContent = `$${montoTotal.toLocaleString('es-CO')}`;
    
    // Por distribuidora
    const drosanTransferencias = transferencias.filter(t => t.distribuidora === 'DROSAN').length;
    const unidrogasTransferencias = transferencias.filter(t => t.distribuidora === 'UNIDROGAS').length;
    
    document.getElementById('drosanTransferencias').textContent = drosanTransferencias;
    document.getElementById('unidrogasTransferencias').textContent = unidrogasTransferencias;
    
    // Contar productos únicos por distribuidora
    const drosanProductos = new Set(
        transferencias.filter(t => t.distribuidora === 'DROSAN' && t.producto)
                     .map(t => t.producto)
    ).size;
    const unidrogasProductos = new Set(
        transferencias.filter(t => t.distribuidora === 'UNIDROGAS' && t.producto)
                     .map(t => t.producto)
    ).size;
    
    document.getElementById('drosanProductos').textContent = drosanProductos;
    document.getElementById('unidrogasProductos').textContent = unidrogasProductos;
    
    // Por productos
    const descongelPagos = pagos.filter(p => p.producto === 'DESCONGELX100');
    const multidol400Pagos = pagos.filter(p => p.producto === 'MULTIDOL X400');
    const multidol800Pagos = pagos.filter(p => p.producto === 'MULTIDOL X800');
    
    const descongelCajas = descongelPagos.reduce((sum, p) => sum + p.cajasPagadas, 0);
    const multidol400Cajas = multidol400Pagos.reduce((sum, p) => sum + p.cajasPagadas, 0);
    const multidol800Cajas = multidol800Pagos.reduce((sum, p) => sum + p.cajasPagadas, 0);
    
    const descongelTotal = descongelPagos.reduce((sum, p) => sum + (p.totalPago || 0), 0);
    const multidol400Total = multidol400Pagos.reduce((sum, p) => sum + (p.totalPago || 0), 0);
    const multidol800Total = multidol800Pagos.reduce((sum, p) => sum + (p.totalPago || 0), 0);
    
    document.getElementById('descongelCajas').textContent = descongelCajas;
    document.getElementById('multidol400Cajas').textContent = multidol400Cajas;
    document.getElementById('multidol800Cajas').textContent = multidol800Cajas;
    
    document.getElementById('descongelTotal').textContent = `$${descongelTotal.toLocaleString('es-CO')}`;
    document.getElementById('multidol400Total').textContent = `$${multidol400Total.toLocaleString('es-CO')}`;
    document.getElementById('multidol800Total').textContent = `$${multidol800Total.toLocaleString('es-CO')}`;
}

// 🎯 Gestión de tabs
function showTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Quitar clase active de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Activar botón correspondiente
    const targetBtn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // Actualizar reportes si se selecciona esa tab
    if (tabName === 'reportes') {
        updateReports();
    }
}

// 📤 Exportar transferencias
function exportTransferencias() {
    try {
        const dataToExport = transferencias.map((t, index) => ({
            'N°': index + 1,
            'FECHA': new Date(t.fecha).toLocaleDateString('es-CO'),
            'DISTRIBUIDORA': t.distribuidora,
            'CLIENTE': t.cliente,
            'PRODUCTO': t.producto || '',
            'CANTIDAD': t.cantidad || '',
            'OBSERVACIONES': t.observaciones || '',
            'FECHA_REGISTRO': new Date(t.fechaRegistro).toLocaleString('es-CO')
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transferencias');
        
        const fecha = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(workbook, `Transferencias_${fecha}.xlsx`);
        
        log(`📊 Excel transferencias exportado: ${transferencias.length} registros`, 'success');
        
    } catch (error) {
        log(`❌ Error exportando transferencias: ${error.message}`, 'error');
        alert('Error al exportar transferencias');
    }
}

// 📤 Exportar pagos
function exportPagos() {
    try {
        const dataToExport = pagos.map((p, index) => ({
            'N°': index + 1,
            'FECHA': new Date(p.fecha).toLocaleDateString('es-CO'),
            'CLIENTE': p.cliente,
            'PRODUCTO': p.producto,
            'CAJAS_PAGADAS': p.cajasPagadas,
            'VALOR_UNITARIO': p.valorUnitario || 0,
            'TOTAL_PAGO': p.totalPago || 0,
            'OBSERVACIONES': p.observaciones || '',
            'FECHA_REGISTRO': new Date(p.fechaRegistro).toLocaleString('es-CO')
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pagos_Productos');
        
        const fecha = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(workbook, `Pagos_Productos_${fecha}.xlsx`);
        
        log(`📊 Excel pagos exportado: ${pagos.length} registros`, 'success');
        
    } catch (error) {
        log(`❌ Error exportando pagos: ${error.message}`, 'error');
        alert('Error al exportar pagos');
    }
}

// ✨ Animación de filas
function animateRows(selector) {
    const rows = document.querySelectorAll(selector);
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// 📊 Actualizar estado de conexión
function updateConnectionStatus(status, title, message) {
    const statusCard = document.querySelector('.status-card');
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessage = document.getElementById('statusMessage');
    
    if (!statusCard) return;
    
    statusCard.className = 'status-card';
    
    switch (status) {
        case 'connecting':
            statusIcon.className = 'fas fa-spinner fa-spin';
            break;
        case 'connected':
            statusCard.classList.add('connected');
            statusIcon.className = 'fas fa-check-circle success';
            break;
        case 'error':
            statusCard.classList.add('error');
            statusIcon.className = 'fas fa-exclamation-triangle error';
            break;
    }
    
    statusTitle.textContent = title;
    statusMessage.textContent = message;
}

// 📝 Sistema de logging
function log(message, type = 'info') {
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
    
    logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${icons[type]} ${message}`;
    
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
    
    console.log(`[Transferencias] ${message}`);
}

// 🧹 Limpiar log
function clearLog() {
    const logContainer = document.getElementById('logContainer');
    if (logContainer) {
        logContainer.innerHTML = '';
        log('🧹 Registro limpiado', 'info');
    }
}

// ⏱️ Debounce utility
function debounce(func, wait) {
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

// 🎯 Funciones globales
window.showTab = showTab;
window.editTransferencia = editTransferencia;
window.editPago = editPago;
window.deleteTransferencia = deleteTransferencia;
window.deletePago = deletePago;
window.clearTransferenciaForm = clearTransferenciaForm;
window.clearPagoForm = clearPagoForm;
window.loadData = loadData;
window.exportTransferencias = exportTransferencias;
window.exportPagos = exportPagos;
window.clearLog = clearLog;

// 🔧 Debug utilities
window.transferenciasDebug = {
    status: () => ({
        firebaseReady,
        transferencias: transferencias.length,
        pagos: pagos.length,
        editingId,
        editingType
    }),
    getData: () => ({ transferencias, pagos }),
    clearAll: () => {
        if (confirm('¿Eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
            transferencias = [];
            pagos = [];
            localStorage.removeItem('transferencias_local');
            localStorage.removeItem('pagos_local');
            renderData();
            updateStats();
            updateReports();
            log('🧹 Todos los datos eliminados', 'warning');
        }
    }
};

log('📱 Sistema de Transferencias cargado correctamente', 'success');
