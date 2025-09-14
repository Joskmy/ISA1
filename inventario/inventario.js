// Datos de ejemplo para productos
const sampleProducts = [
    { id: 1, name: "Laptop Dell XPS 13", category: "Computadoras", stock: 15, price: 2500000, status: "Disponible", dateAdded: "2023-09-01" },
    { id: 2, name: "Monitor LG 24\"", category: "Monitores", stock: 22, price: 800000, status: "Disponible", dateAdded: "2023-09-02" },
    { id: 3, name: "Teclado Mecánico", category: "Periféricos", stock: 35, price: 300000, status: "Disponible", dateAdded: "2023-09-03" },
    { id: 4, name: "Mouse Inalámbrico", category: "Periféricos", stock: 42, price: 150000, status: "Disponible", dateAdded: "2023-09-04" },
    { id: 5, name: "Router WiFi 6", category: "Redes", stock: 8, price: 500000, status: "Bajo", dateAdded: "2023-09-05" },
    { id: 6, name: "Disco Duro SSD 500GB", category: "Almacenamiento", stock: 5, price: 400000, status: "Crítico", dateAdded: "2023-09-06" },
    { id: 7, name: "Memoria RAM 8GB", category: "Componentes", stock: 3, price: 200000, status: "Crítico", dateAdded: "2023-09-07" },
    { id: 8, name: "Adaptador USB-C", category: "Accesorios", stock: 7, price: 100000, status: "Bajo", dateAdded: "2023-09-08" },
    { id: 9, name: "Cargador Laptop", category: "Accesorios", stock: 9, price: 120000, status: "Bajo", dateAdded: "2023-09-09" },
    { id: 10, name: "Switch 8 Puertos", category: "Redes", stock: 4, price: 350000, status: "Crítico", dateAdded: "2023-09-10" },
    { id: 11, name: "Cable HDMI", category: "Cables", stock: 50, price: 50000, status: "Disponible", dateAdded: "2023-09-11" },
    { id: 12, name: "Webcam 1080p", category: "Periféricos", stock: 18, price: 250000, status: "Disponible", dateAdded: "2023-09-12" },
    { id: 13, name: "Tableta Gráfica", category: "Periféricos", stock: 12, price: 800000, status: "Disponible", dateAdded: "2023-09-13" },
    { id: 14, name: "Impresora Láser", category: "Impresión", stock: 6, price: 1200000, status: "Bajo", dateAdded: "2023-09-14" },
    { id: 15, name: "Silla Ergonómica", category: "Mobiliario", stock: 8, price: 1500000, status: "Bajo", dateAdded: "2023-09-15" }
];




// Clase principal de la aplicación de inventario
class InventoryApp {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.categoryChart = null;
        this.valueChart = null;
        this.isEditing = false;
        this.editingId = null;
        this.categoryColors = [
            '#4CAF50',
            '#FFC107',
            '#8BC34A',
            '#9E9E9E',
            '#1F8EFA',
            '#03A9F4',
            '#9C27B0',
            '#FF5722',
            '#795548',
            '#607D8B'
        ];
        this.init();
    }

    // Inicializar la aplicación
    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.initSidebarState();
        this.displayCurrentDate();
        this.setupKeyboardNavigation();
        this.setupLiveRegion();
    }

    // Configurar los event listeners
    setupEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Profile avatar
        const profileAvatarBtn = document.getElementById('profile-avatar-btn');
        if (profileAvatarBtn) {
            profileAvatarBtn.addEventListener('click', () => this.goToProfile());
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Agregar producto
        const addBtn = document.getElementById('add-product-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal());
        }

        // Formulario
        const form = document.getElementById('product-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Cancelar
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        // Cerrar modal
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Búsqueda
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterProducts());
        }

        // Filtro de categoría
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProducts());
        }

        // Filtro de estado
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterProducts());
        }

        // Filtros de fecha
        const dateFrom = document.getElementById('date-from');
        if (dateFrom) {
            dateFrom.addEventListener('change', () => this.filterProducts());
        }

        const dateTo = document.getElementById('date-to');
        if (dateTo) {
            dateTo.addEventListener('change', () => this.filterProducts());
        }

        // Generar reporte
        const generateReportBtn = document.getElementById('generate-report-btn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => this.openReportModal());
        }

        // Importar productos
        const importBtn = document.getElementById('import-products-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.openImportModal());
        }

        // Formulario de reporte
        const reportForm = document.getElementById('report-form');
        if (reportForm) {
            reportForm.addEventListener('submit', (e) => this.handleReportSubmit(e));
        }

        // Cancelar reporte
        const cancelReportBtn = document.getElementById('cancel-report-btn');
        if (cancelReportBtn) {
            cancelReportBtn.addEventListener('click', () => this.closeReportModal());
        }

        // Archivo de importación
        const importFile = document.getElementById('import-file');
        if (importFile) {
            importFile.addEventListener('change', (e) => this.handleImportFile(e));
        }

        // Limpiar filtros
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        // Seleccionar archivo para importar
        const selectFileBtn = document.getElementById('select-file-btn');
        if (selectFileBtn) {
            selectFileBtn.addEventListener('click', () => this.triggerImport());
        }

        // Cerrar modal al hacer clic fuera
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Cerrar modal de producto con X
        const productCloseBtn = document.querySelector('#product-modal .close-modal');
        if (productCloseBtn) {
            productCloseBtn.addEventListener('click', () => this.closeModal());
        }

        // Cerrar modal de reporte con X
        const reportCloseBtn = document.querySelector('#report-modal .close-modal');
        if (reportCloseBtn) {
            reportCloseBtn.addEventListener('click', () => this.closeReportModal());
        }

        // Cerrar modal de importación con X
        const importCloseBtn = document.querySelector('#import-modal .close-modal');
        if (importCloseBtn) {
            importCloseBtn.addEventListener('click', () => this.closeImportModal());
        }

        // Cerrar modal de reporte al hacer clic fuera
        const reportModal = document.getElementById('report-modal');
        if (reportModal) {
            reportModal.addEventListener('click', (e) => {
                if (e.target === reportModal) {
                    this.closeReportModal();
                }
            });
        }

        // Cerrar modal de importación al hacer clic fuera
        const importModal = document.getElementById('import-modal');
        if (importModal) {
            importModal.addEventListener('click', (e) => {
                if (e.target === importModal) {
                    this.closeImportModal();
                }
            });
        }

        // Cerrar modales con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeReportModal();
                this.closeImportModal();
            }
        });
    }

    // Configurar navegación por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // Configurar región live para anuncios de accesibilidad
    setupLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'visually-hidden';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    // Anunciar cambios para usuarios de lectores de pantalla
    announce(message, priority = 'polite') {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.textContent = message;

            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Cargar productos
    loadProducts() {
        // Intentar cargar datos guardados localmente
        const savedProducts = localStorage.getItem('inventoryProducts');

        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
            // Asegurar que todos los productos tengan dateAdded y actualizar status antiguos
            this.products = this.products.map(product => {
                if (!product.dateAdded) {
                    // Asignar una fecha aleatoria en los últimos 30 días para variedad
                    const randomDays = Math.floor(Math.random() * 30);
                    const date = new Date();
                    date.setDate(date.getDate() - randomDays);
                    product.dateAdded = date.toISOString().split('T')[0];
                }
                // Actualizar status antiguos
                if (product.status === 'Bajo stock') {
                    product.status = 'Bajo';
                }
                return product;
            });
            // Guardar los productos actualizados
            localStorage.setItem('inventoryProducts', JSON.stringify(this.products));
        } else {
            // Usar datos de ejemplo
            this.products = sampleProducts;
            localStorage.setItem('inventoryProducts', JSON.stringify(sampleProducts));
        }

        this.filteredProducts = [...this.products];
        this.renderProducts();
        this.initCharts();
        this.announce(`${this.products.length} productos cargados`);
    }

    // Renderizar productos en la tabla
    renderProducts() {
        const tbody = document.getElementById('products-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.filteredProducts.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="7" class="empty-state">
                    <span aria-hidden="true">📭</span>
                    No se encontraron productos
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }

        this.filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            row.setAttribute('data-product-id', product.id);

            const statusClass = product.status === 'Crítico' ? 'danger' :
                                product.status === 'Bajo' ? 'warning' : 'success';

            row.innerHTML = `
                <td>${this.escapeHtml(product.name)}</td>
                <td>${this.escapeHtml(product.category)}</td>
                <td>${product.stock}</td>
                <td>$${product.price.toLocaleString('es-CO')}</td>
                <td><span class="badge ${statusClass}">${product.status}</span></td>
                <td>${this.formatDate(product.dateAdded)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="inventoryApp.editProduct(${product.id})" aria-label="Editar ${product.name}">Editar</button>
                        <button class="btn-delete" onclick="inventoryApp.deleteProduct(${product.id})" aria-label="Eliminar ${product.name}">Eliminar</button>
                    </div>
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    // Filtrar productos
    filterProducts() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        const dateFrom = document.getElementById('date-from').value;
        const dateTo = document.getElementById('date-to').value;

        this.filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                  product.category.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || product.category === categoryFilter;
            const matchesStatus = !statusFilter || product.status === statusFilter;
            const matchesDate = (!dateFrom || product.dateAdded >= dateFrom) &&
                                (!dateTo || product.dateAdded <= dateTo);

            return matchesSearch && matchesCategory && matchesStatus && matchesDate;
        });

        this.renderProducts();
        this.announce(`${this.filteredProducts.length} productos encontrados`);
    }

    // Abrir modal
    openModal(productId = null) {
        const modal = document.getElementById('product-modal');
        const form = document.getElementById('product-form');
        const title = document.getElementById('modal-title');

        if (productId) {
            this.isEditing = true;
            this.editingId = productId;
            const product = this.products.find(p => p.id === productId);
            if (product) {
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-category').value = product.category;
                document.getElementById('product-stock').value = product.stock;
                document.getElementById('product-price').value = product.price;
                title.textContent = 'Editar Producto';
            }
        } else {
            this.isEditing = false;
            this.editingId = null;
            form.reset();
            title.textContent = 'Agregar Producto';
        }

        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('product-name').focus();
    }

    // Cerrar modal
    closeModal() {
        const modal = document.getElementById('product-modal');
        modal.setAttribute('aria-hidden', 'true');
        this.isEditing = false;
        this.editingId = null;
    }

    // Manejar envío del formulario
    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name').trim(),
            category: formData.get('category'),
            stock: parseInt(formData.get('stock')),
            price: parseFloat(formData.get('price'))
        };

        // Determinar estado basado en stock
                if (productData.stock <= 5) {
                    productData.status = 'Crítico';
                } else if (productData.stock <= 10) {
                    productData.status = 'Bajo';
                } else {
                    productData.status = 'Disponible';
                }

        if (this.isEditing) {
            this.updateProduct(this.editingId, productData);
        } else {
            this.addProduct(productData);
        }

        this.closeModal();
    }

    // Agregar producto
    addProduct(productData) {
        const newId = Math.max(...this.products.map(p => p.id), 0) + 1;
        const newProduct = { id: newId, ...productData, dateAdded: new Date().toISOString().split('T')[0] };
    
        this.products.push(newProduct);
        this.saveProducts();
        this.filterProducts();
        this.initCharts();
        this.announce(`Producto "${newProduct.name}" agregado correctamente`);
    }

    // Actualizar producto
    updateProduct(id, productData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...productData };
            this.saveProducts();
            this.filterProducts();
            this.initCharts();
            this.announce(`Producto "${productData.name}" actualizado correctamente`);
        }
    }

    // Editar producto
    editProduct(id) {
        this.openModal(id);
    }

    // Eliminar producto
    deleteProduct(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            const product = this.products.find(p => p.id === id);
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts();
            this.filterProducts();
            this.initCharts();
            if (product) {
                this.announce(`Producto "${product.name}" eliminado`);
            }
        }
    }

    // Guardar productos en localStorage
    saveProducts() {
        localStorage.setItem('inventoryProducts', JSON.stringify(this.products));
    }

    // Inicializar gráficos
    initCharts() {
        this.initCategoryChart();
        this.initValueChart();
    }

    // Gráfico de distribución por categoría
    initCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        const categoryData = {};
        this.products.forEach(product => {
            categoryData[product.category] = (categoryData[product.category] || 0) + product.stock;
        });

        const data = {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: this.categoryColors.slice(0, Object.keys(categoryData).length),
                borderWidth: 0
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        },
                        color: 'var(--neutral-100)'
                    }
                }
            }
        };

        this.categoryChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options
        });
    }

    // Gráfico de valor del inventario
initValueChart() {
    const ctx = document.getElementById('valueChart');
    if (!ctx) return;

    if (this.valueChart) {
        this.valueChart.destroy();
    }

    const categoryValue = {};
    this.products.forEach(product => {
        const value = product.stock * product.price;
        categoryValue[product.category] = (categoryValue[product.category] || 0) + value;
    });

    const labels = Object.keys(categoryValue);
    const data = {
        labels: labels,
        datasets: [{
            label: '', // sin texto
            data: Object.values(categoryValue),
            backgroundColor: this.categoryColors.slice(0, labels.length),
            borderColor: this.categoryColors.slice(0, labels.length),
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString('es-CO');
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false // 🔥 oculta la leyenda completa
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return '$' + context.parsed.y.toLocaleString('es-CO');
                    }
                }
            }
        }
    };

    this.valueChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
        });
    }


    // Mostrar la fecha actual
    displayCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const today = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'America/Bogota'
            };

            const formattedDate = today.toLocaleDateString('es-CO', options);
            dateElement.textContent = `Hoy es ${formattedDate} - Ceja, Antioquia`;
        }
    }

    // Ir a la página de perfil
    goToProfile() {
        this.announce('Navegando a la página de perfil');
        window.location.href = '../perfil/perfil.html';
    }

    // Alternar barra lateral
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const toggleIcon = document.querySelector('.toggle-icon');
        const isCollapsed = sidebar.classList.contains('collapsed');

        if (isCollapsed) {
            sidebar.classList.remove('collapsed');
            localStorage.setItem('sidebarCollapsed', 'false');
            toggleIcon.className = 'bi bi-chevron-left toggle-icon';
            this.announce('Barra lateral expandida');
        } else {
            sidebar.classList.add('collapsed');
            localStorage.setItem('sidebarCollapsed', 'true');
            toggleIcon.className = 'bi bi-list toggle-icon';
            this.announce('Barra lateral contraída');
        }
    }

    // Inicializar estado de la barra lateral
    initSidebarState() {
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        const sidebar = document.querySelector('.sidebar');
        const toggleIcon = document.querySelector('.toggle-icon');

        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            toggleIcon.className = 'bi bi-list toggle-icon';
        } else {
            toggleIcon.className = 'bi bi-chevron-left toggle-icon';
        }
    }

    // Manejar cierre de sesión
    handleLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?\nSerás redirigido a la página de inicio de sesión.')) {
            this.announce('Cerrando sesión');
            setTimeout(() => {
                window.location.href = '../inicio/index.html';
            }, 1000);
        }
    }

    // Abrir modal de reporte
    openReportModal() {
        const modal = document.getElementById('report-modal');
        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('report-date-from').focus();
    }

    // Cerrar modal de reporte
    closeReportModal() {
        const modal = document.getElementById('report-modal');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Abrir modal de importación
    openImportModal() {
        const modal = document.getElementById('import-modal');
        modal.setAttribute('aria-hidden', 'false');
    }

    // Cerrar modal de importación
    closeImportModal() {
        const modal = document.getElementById('import-modal');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Limpiar filtros
    clearFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('category-filter').value = '';
        document.getElementById('status-filter').value = '';
        document.getElementById('date-from').value = '';
        document.getElementById('date-to').value = '';
        this.filterProducts();
        this.announce('Filtros limpiados');
    }

    // Formatear fecha para display
    formatDate(dateInput) {
    let date;
    if (typeof dateInput === "string") {
        const parts = dateInput.split("-");
        if (parts.length !== 3) return "Fecha inválida";
        date = new Date(parts[0], parts[1] - 1, parts[2]);
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        return "Fecha inválida";
    }

    if (isNaN(date.getTime())) return "Fecha inválida";

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

    // Manejar envío del formulario de reporte
    handleReportSubmit(e) {
        e.preventDefault();
        const dateFrom = document.getElementById('report-date-from').value;
        const dateTo = document.getElementById('report-date-to').value;
        this.generateReport(dateFrom, dateTo);
        this.closeReportModal();
    }

    // Generar reporte Excel
    generateReport(dateFrom, dateTo) {
        const filteredProducts = this.products.filter(product =>
            product.dateAdded >= dateFrom && product.dateAdded <= dateTo
        );

        if (filteredProducts.length === 0) {
            alert('No hay productos en el rango de fechas seleccionado.');
            return;
        }

        const data = filteredProducts.map(product => ({
            ID: product.id,
            Nombre: product.name,
            Categoría: product.category,
            Stock: product.stock,
            Precio: product.price,
            Estado: product.status,
            'Fecha Agregado': product.dateAdded
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
        XLSX.writeFile(wb, `inventario_${dateFrom}_a_${dateTo}.xlsx`);
        this.announce('Reporte generado exitosamente');
    }

    // Trigger import
    triggerImport() {
        document.getElementById('import-file').click();
    }

    // Manejar archivo de importación
    handleImportFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                this.validateAndImport(jsonData);
                this.closeImportModal();
            } catch (error) {
                alert('Error al leer el archivo Excel. Asegúrese de que sea un archivo válido.');
                this.closeImportModal();
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // Validar y importar datos
    validateAndImport(data) {
        if (data.length < 2) {
            alert('El archivo debe contener al menos una fila de encabezados y una fila de datos.');
            return;
        }

        const headers = data[0].map(h => h.toLowerCase().trim());
        const expectedHeaders = ['nombre', 'categoria', 'stock', 'precio'];

        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            alert(`Faltan las siguientes columnas: ${missingHeaders.join(', ')}`);
            return;
        }

        const nameIndex = headers.indexOf('nombre');
        const categoryIndex = headers.indexOf('categoria');
        const stockIndex = headers.indexOf('stock');
        const priceIndex = headers.indexOf('precio');

        const errors = [];
        const validProducts = [];

        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const name = row[nameIndex]?.toString().trim();
            const category = row[categoryIndex]?.toString().trim();
            const stockStr = row[stockIndex]?.toString().trim();
            const priceStr = row[priceIndex]?.toString().trim();

            if (!name || !category || !stockStr || !priceStr) {
                errors.push(`Fila ${i + 1}: Datos incompletos`);
                continue;
            }

            const stock = parseInt(stockStr);
            const price = parseFloat(priceStr);

            if (isNaN(stock) || stock < 0) {
                errors.push(`Fila ${i + 1}: Stock debe ser un número entero positivo`);
                continue;
            }

            if (isNaN(price) || price < 0) {
                errors.push(`Fila ${i + 1}: Precio debe ser un número positivo`);
                continue;
            }

            // Determinar estado
                        let status;
                        if (stock <= 5) {
                            status = 'Crítico';
                        } else if (stock <= 10) {
                            status = 'Bajo';
                        } else {
                            status = 'Disponible';
                        }

            validProducts.push({
                name,
                category,
                stock,
                price,
                status,
                dateAdded: new Date().toISOString().split('T')[0]
            });
        }

        if (errors.length > 0) {
            alert(`Errores encontrados:\n${errors.join('\n')}\n\nSolo se importarán los productos válidos.`);
        }

        if (validProducts.length === 0) {
            alert('No se encontraron productos válidos para importar.');
            return;
        }

        // Agregar productos válidos
        validProducts.forEach(productData => {
            this.addProduct(productData);
        });

        alert(`${validProducts.length} productos importados exitosamente.`);
    }

    // Utilidad: Escapar HTML
    escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    window.inventoryApp = new InventoryApp();

    // Establecer foco en el contenido principal
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.focus();
    }
});

