// 💾 Gestión de datos y estado
class FarmaciaManager {
    constructor() {
        this.farmacias = [];
        this.editingIndex = -1;
        this.loadInitialData();
        this.init();
    }

    // 🚀 Inicialización
    init() {
        this.loadFromCache();
        this.bindEvents();
        this.renderTable();
        this.updateStats();
    }

    // 📊 Datos iniciales desde el Excel
    loadInitialData() {
        const initialData = [
            { nombre: "Doralba Gomez pedidos (supervida)", telefono: "3112629258", observaciones: "pedidos con la Sra Doralba en horas AM" },
            { nombre: "Paola (galeno)", telefono: "3005503883", observaciones: "pedidos con Paola" },
            { nombre: "Maria Castellanos(farmavida)", telefono: "3044919278", observaciones: "pide por drosan (tiene vencida estermax tab) Fabio" },
            { nombre: "Antonio (nuevo sol)", telefono: "3178180817", observaciones: "pidio ayer descongelx100 (3 descongel mas 1 cj multi x400)" },
            { nombre: "bibiana, esmeralda (M y D)", telefono: "3213712473", observaciones: "pide por drosan (deysi drosan)" },
            { nombre: "Danilo(cler recreo)", telefono: "3157105112", observaciones: "pedidos Danilo" },
            { nombre: "JORDAN (drog florida)", telefono: "", observaciones: "pedidos drosan wolfarma" },
            { nombre: "martha(unica pcta)", telefono: "3114990014", observaciones: "pedidos drosan (yolanda) pendientes pagos descongel multidol 400" },
            { nombre: "Nayara,Javier(mediexpress)", telefono: "3107622018", observaciones: "pedidos drosan(xxx)Nayara" },
            { nombre: "marcela(superdrogas)", telefono: "3128945193", observaciones: "cra 15#3-124 cambiar direccion" },
            { nombre: "yina(vital salud)", telefono: "3178418227", observaciones: "unidrogas" },
            { nombre: "Margy(jerez)", telefono: "3187787283", observaciones: "drosan ( )Luz Mary Jerez - modificar dir cra 15#6-90" },
            { nombre: "alix (san rafael)", telefono: "3174043516", observaciones: "pedidos con la Sra Alix" },
            { nombre: "Lilia Corzo(lico)", telefono: "3158862134", observaciones: "Pedidos con la sra Lidia" },
            { nombre: "Yadira(la 7ma Pcta)", telefono: "3232060182", observaciones: "drosan (yolanda) -- fluzetrin cbg + multi 400(sabado) 3132018154" },
            { nombre: "Daniela, Eliecer(ecovida)", telefono: "3168052998", observaciones: "pedidos con Andrea(ecovida 2)" },
            { nombre: "jessica(granados amiga)", telefono: "3176678147", observaciones: "pedidos jessica" },
            { nombre: "Miguel(lorena)", telefono: "3004860613", observaciones: "pedidos (drosan) isabel pedido mañana 8 mayo descongel x100" },
            { nombre: "Harvey (unifarma)", telefono: "3212506845", observaciones: "pedidos con el Sr Harvey(pedidos)" },
            { nombre: "Fernando(la 16 san carlos),Laura", telefono: "3232968472", observaciones: "pedidos con el Sr Fernando" }
        ];

        // Solo cargar datos iniciales si no hay datos guardados
        if (!localStorage.getItem('farmaciasZona1561')) {
            this.farmacias = initialData;
            this.saveToCache();
        }
    }

    // 🎯 Event Listeners
    bindEvents() {
        // Búsqueda en tiempo real
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterTable(e.target.value);
        });

        // Formulario
        document.getElementById('farmaciaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFarmacia();
        });

        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Cerrar modal al hacer clic fuera
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.closeModal();
            }
        });
    }

    // 💾 Gestión de caché
    saveToCache() {
        localStorage.setItem('farmaciasZona1561', JSON.stringify(this.farmacias));
        console.log('✅ Datos guardados en caché');
    }

    loadFromCache() {
        const cached = localStorage.getItem('farmaciasZona1561');
        if (cached) {
            this.farmacias = JSON.parse(cached);
            console.log('📥 Datos cargados desde caché');
        }
    }

    // 📊 Renderizar tabla
    renderTable(data = this.farmacias) {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px; color: #6b7280;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                        <br>No se encontraron resultados
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach((farmacia, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong style="color: ${this.getRandomColor()};">${farmacia.nombre}</strong>
                </td>
                <td>
                    ${farmacia.telefono ? 
                        `<a href="tel:${farmacia.telefono}" class="btn btn-sm" style="background-color: #10b981; color: white;">
                            <i class="fas fa-phone"></i> ${farmacia.telefono}
                        </a>` : 
                        '<span style="color: #6b7280;">Sin teléfono</span>'
                    }
                </td>
                <td style="max-width: 300px;">
                    <div style="max-height: 60px; overflow-y: auto;">
                        ${farmacia.observaciones || '<span style="color: #6b7280;">Sin observaciones</span>'}
                    </div>
                </td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn btn-warning btn-sm" onclick="farmaciaManager.editFarmacia(${this.getOriginalIndex(farmacia)})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="farmaciaManager.deleteFarmacia(${this.getOriginalIndex(farmacia)})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // 🎨 Colores aleatorios para mejor visualización
    getRandomColor() {
        const colors = ['#2563eb', '#059669', '#dc2626', '#d97706', '#0891b2', '#7c3aed', '#be185d'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 🔍 Obtener índice original
    getOriginalIndex(farmacia) {
        return this.farmacias.findIndex(f => 
            f.nombre === farmacia.nombre && 
            f.telefono === farmacia.telefono && 
            f.observaciones === farmacia.observaciones
        );
    }

    // 📈 Actualizar estadísticas
    updateStats() {
        document.getElementById('totalFarmacias').textContent = this.farmacias.length;
    }

    // 🔍 Filtrar tabla
    filterTable(searchTerm) {
        const filtered = this.farmacias.filter(farmacia => 
            farmacia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmacia.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmacia.observaciones.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderTable(filtered);
    }

    // ➕ Mostrar modal
    showModal() {
        document.getElementById('modal').style.display = 'block';
        document.getElementById('modalTitle').textContent = 'Agregar Farmacia';
        document.getElementById('farmaciaForm').reset();
        this.editingIndex = -1;
        document.getElementById('nombre').focus();
    }

    // ❌ Cerrar modal
    closeModal() {
        document.getElementById('modal').style.display = 'none';
        this.editingIndex = -1;
    }

    // 💾 Guardar farmacia
    saveFarmacia() {
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const observaciones = document.getElementById('observaciones').value.trim();

        if (!nombre) {
            this.showAlert('El nombre es obligatorio', 'error');
            return;
        }

        const farmacia = { nombre, telefono, observaciones };

        if (this.editingIndex >= 0) {
            // Editar existente
            this.farmacias[this.editingIndex] = farmacia;
            this.showAlert('✅ Farmacia actualizada correctamente', 'success');
        } else {
            // Agregar nueva
            this.farmacias.push(farmacia);
            this.showAlert('✅ Farmacia agregada correctamente', 'success');
        }

        this.saveToCache();
        this.renderTable();
        this.updateStats();
        this.closeModal();
    }

    // ✏️ Editar farmacia
    editFarmacia(index) {
        const farmacia = this.farmacias[index];
        
        document.getElementById('nombre').value = farmacia.nombre;
        document.getElementById('telefono').value = farmacia.telefono;
        document.getElementById('observaciones').value = farmacia.observaciones;
        
        document.getElementById('modalTitle').textContent = 'Editar Farmacia';
        document.getElementById('modal').style.display = 'block';
        this.editingIndex = index;
    }

    // 🗑️ Eliminar farmacia
    deleteFarmacia(index) {
        const farmacia = this.farmacias[index];
        
        if (confirm(`¿Estás seguro de que deseas eliminar "${farmacia.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
            this.farmacias.splice(index, 1);
            this.saveToCache();
            this.renderTable();
            this.updateStats();
            this.showAlert('🗑️ Farmacia eliminada correctamente', 'success');
        }
    }

    // 📤 Exportar a Excel
    exportToExcel() {
        try {
            const worksheet = XLSX.utils.json_to_sheet(this.farmacias.map(f => ({
                'NOMBRE': f.nombre,
                'TELEFONO': f.telefono,
                'OBSERVACIONES': f.observaciones
            })));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'DATOS_ZONA');

            const fecha = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `ZONA_1561_${fecha}.xlsx`);

            this.showAlert('📊 Archivo Excel exportado correctamente', 'success');
        } catch (error) {
            console.error('Error al exportar:', error);
            this.showAlert('❌ Error al exportar el archivo', 'error');
        }
    }

    // 📥 Importar datos (función básica)
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const workbook = XLSX.read(event.target.result, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(worksheet);

                    // Procesar datos importados
                    const importedFarmacias = data.map(row => ({
                        nombre: row.NOMBRE || row.nombre || '',
                        telefono: row.TELEFONO || row.telefono || '',
                        observaciones: row.OBSERVACIONES || row.observaciones || ''
                    })).filter(f => f.nombre.trim());

                    if (importedFarmacias.length > 0) {
                        this.farmacias = [...this.farmacias, ...importedFarmacias];
                        this.saveToCache();
                        this.renderTable();
                        this.updateStats();
                        this.showAlert(`✅ Se importaron ${importedFarmacias.length} registros correctamente`, 'success');
                    } else {
                        this.showAlert('❌ No se encontraron datos válidos en el archivo', 'error');
                    }
                } catch (error) {
                    console.error('Error al importar:', error);
                    this.showAlert('❌ Error al procesar el archivo', 'error');
                }
            };
            reader.readAsBinaryString(file);
        };

        input.click();
    }

    // 📢 Mostrar alertas
    showAlert(message, type) {
        // Remover alertas existentes
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = message;

        const container = document.querySelector('.container');
        container.insertBefore(alert, container.firstChild);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// 🚀 Funciones globales para acceso desde HTML
let farmaciaManager;

function showModal() {
    farmaciaManager.showModal();
}

function closeModal() {
    farmaciaManager.closeModal();
}

function exportToExcel() {
    farmaciaManager.exportToExcel();
}

function importData() {
    farmaciaManager.importData();
}

// 🎯 Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    farmaciaManager = new FarmaciaManager();
    console.log('🚀 Sistema de gestión inicializado correctamente');
});
