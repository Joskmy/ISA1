// Datos de ejemplo adaptados para Ceja-Antioquia
const sampleData = {
    recentProducts: [
        { id: 1, name: "Laptop Dell XPS 13", category: "Computadoras", stock: 15, date: "2023-11-15" },
        { id: 2, name: "Monitor LG 24\"", category: "Monitores", stock: 22, date: "2023-11-14" },
        { id: 3, name: "Teclado Mecánico", category: "Periféricos", stock: 35, date: "2023-11-14" },
        { id: 4, name: "Mouse Inalámbrico", category: "Periféricos", stock: 42, date: "2023-11-13" },
        { id: 5, name: "Router WiFi 6", category: "Redes", stock: 8, date: "2023-11-13" }
    ],
    lowStockProducts: [
        { id: 6, name: "Disco Duro SSD 500GB", category: "Almacenamiento", currentStock: 5, minRequired: 10, status: "Crítico" },
        { id: 7, name: "Memoria RAM 8GB", category: "Componentes", currentStock: 3, minRequired: 15, status: "Crítico" },
        { id: 8, name: "Adaptador USB-C", category: "Accesorios", currentStock: 7, minRequired: 10, status: "Bajo" },
        { id: 9, name: "Cargador Laptop", category: "Accesorios", currentStock: 9, minRequired: 12, status: "Bajo" },
        { id: 10, name: "Switch 8 Puertos", category: "Redes", currentStock: 4, minRequired: 8, status: "Crítico" }
    ],
    topProducts: [
        { id: 11, name: "Cable HDMI", category: "Cables", movement: 142, trend: "up" },
        { id: 12, name: "Webcam 1080p", category: "Periféricos", movement: 98, trend: "up" },
        { id: 13, name: "Tableta Gráfica", category: "Periféricos", movement: 76, trend: "stable" },
        { id: 14, name: "Impresora Láser", category: "Impresión", movement: 65, trend: "down" },
        { id: 15, name: "Silla Ergonómica", category: "Mobiliario", movement: 53, trend: "up" }
    ]
};

// Clase principal de la aplicación
class InventoryDashboard {
    constructor() {
        this.data = null;
        this.inventoryChart = null;
        this.isLoading = false;
        this.init();
    }

    // Inicializar la aplicación
    init() {
        this.setupEventListeners();
        this.loadData();
        this.initSidebarState();
        this.setupKeyboardNavigation();
        this.setupLiveRegion();
    }

    // Configurar los event listeners
    setupEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
            logoutBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleLogout();
                }
            });
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

        // Navegación por teclado en la barra lateral
        const navItems = document.querySelectorAll('.nav-item a');
        navItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextItem = navItems[Math.min(index + 1, navItems.length - 1)];
                    nextItem.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevItem = navItems[Math.max(index - 1, 0)];
                    prevItem.focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    navItems[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    navItems[navItems.length - 1].focus();
                }
            });
        });

        // Botones de acción en las tarjetas
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleActionButton(e));
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleActionButton(e);
                }
            });
        });

        // Tarjetas de estadísticas
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('click', () => this.goToInventory());
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToInventory();
                }
            });
        });
    }

    // Configurar navegación por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Atajo para ir al contenido principal
            if (e.key === 'S' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                document.getElementById('main-content').focus();
            }
            
            // Atajo para cerrar sesión
            if (e.key === 'L' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
                e.preventDefault();
                this.handleLogout();
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
            
            // Limpiar después de un tiempo para permitir nuevos anuncios
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Cargar datos (simulando una API)
    async loadData() {
        this.setLoadingState(true);
        
        try {
            // Simular una llamada a API con retraso
            await this.delay(800);
            
            // Intentar cargar datos guardados localmente primero
            const savedData = localStorage.getItem('inventoryData');
            
            if (savedData) {
                this.data = JSON.parse(savedData);
                this.announce('Datos del inventario cargados correctamente');
            } else {
                // Usar datos de ejemplo si no hay datos guardados
                this.data = sampleData;
                localStorage.setItem('inventoryData', JSON.stringify(sampleData));
                this.announce('Datos de ejemplo cargados para el sistema de inventario');
            }
            
            this.renderAll();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Error al cargar los datos. Por favor, recarga la página.');
            this.announce('Error al cargar los datos del inventario', 'assertive');
        } finally {
            this.setLoadingState(false);
        }
    }

    // Establecer estado de carga
    setLoadingState(isLoading) {
        this.isLoading = isLoading;
        const mainContent = document.getElementById('main-content');
        
        if (isLoading) {
            mainContent.setAttribute('aria-busy', 'true');
            this.announce('Cargando datos del inventario, por favor espere');
        } else {
            mainContent.removeAttribute('aria-busy');
        }
    }

    // Renderizar todos los componentes
    renderAll() {
        this.displayCurrentDate();
        this.loadRecentProducts();
        this.loadLowStockProducts();
        this.loadTopProducts();
        this.initInventoryChart();
    }

    // Mostrar la fecha actual con formato regional
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

            // Formato especial para Antioquia
            const formattedDate = today.toLocaleDateString('es-CO', options);
            dateElement.textContent = `Hoy es ${formattedDate} - Ceja, Antioquia`;
            dateElement.setAttribute('datetime', today.toISOString());

            // Actualizar también el título de la página
            document.title = `Dashboard - ${formattedDate} - Sistema de Inventario TI Ceja-Antioquia`;
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

    // Cargar productos recientes en la tabla
    loadRecentProducts() {
        const tbody = document.getElementById('recent-products-body');
        if (!tbody || !this.data) return;
        
        tbody.innerHTML = '';
        
        if (this.data.recentProducts.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="4" class="empty-state">
                    <span aria-hidden="true">📭</span>
                    No hay productos recientes
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }
        
        this.data.recentProducts.forEach(product => {
            const row = document.createElement('tr');
            row.setAttribute('data-product-id', product.id);
            row.tabIndex = 0;
            row.setAttribute('role', 'row');
            
            row.innerHTML = `
                <td role="cell">${this.escapeHtml(product.name)}</td>
                <td role="cell">${this.escapeHtml(product.category)}</td>
                <td role="cell">${product.stock} unidades</td>
                <td role="cell">${this.formatDate(product.date)}</td>
            `;
            
            // Hacer la fila interactiva
            row.addEventListener('click', () => this.viewProductDetails(product.id));
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.viewProductDetails(product.id);
                }
            });
            
            tbody.appendChild(row);
        });
    }

    // Cargar productos con stock bajo
    loadLowStockProducts() {
        const tbody = document.getElementById('low-stock-body');
        if (!tbody || !this.data) return;
        
        tbody.innerHTML = '';
        
        if (this.data.lowStockProducts.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="4" class="empty-state">
                    <span aria-hidden="true">✅</span>
                    ¡Excelente! Todo el stock está en niveles adecuados
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }
        
        this.data.lowStockProducts.forEach(product => {
            const row = document.createElement('tr');
            row.setAttribute('data-product-id', product.id);
            row.tabIndex = 0;
            row.setAttribute('role', 'row');
            
            const statusClass = product.status === 'Crítico' ? 'danger' : 'warning';
            const statusText = product.status === 'Crítico' ? 'Crítico - ¡Necesita atención inmediata!' : 'Bajo - Requiere reposición';
            
            row.innerHTML = `
                <td role="cell">${this.escapeHtml(product.name)}</td>
                <td role="cell"><span aria-label="${product.currentStock} unidades">${product.currentStock}</span></td>
                <td role="cell">${product.minRequired}</td>
                <td role="cell"><span class="badge ${statusClass}" aria-label="${statusText}">${product.status}</span></td>
            `;
            
            // Hacer la fila interactiva
            row.addEventListener('click', () => this.viewProductDetails(product.id));
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.viewProductDetails(product.id);
                }
            });
            
            tbody.appendChild(row);
        });
        
        // Anunciar alertas de stock bajo
        const criticalItems = this.data.lowStockProducts.filter(p => p.status === 'Crítico').length;
        if (criticalItems > 0) {
            this.announce(`Alerta: ${criticalItems} productos con stock crítico necesitan atención inmediata`, 'assertive');
        }
    }

    // Cargar productos más movidos
    loadTopProducts() {
        const tbody = document.getElementById('top-products-body');
        if (!tbody || !this.data) return;
        
        tbody.innerHTML = '';
        
        if (this.data.topProducts.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="3" class="empty-state">
                    <span aria-hidden="true">📊</span>
                    No hay datos de movimientos disponibles
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }
        
        this.data.topProducts.forEach(product => {
            const row = document.createElement('tr');
            row.setAttribute('data-product-id', product.id);
            row.tabIndex = 0;
            row.setAttribute('role', 'row');
            
            const trendIcon = product.trend === 'up' ? '↗' : product.trend === 'down' ? '↘' : '→';
            const trendClass = product.trend === 'up' ? 'success' : product.trend === 'down' ? 'danger' : 'neutral';
            const trendDescription = product.trend === 'up' ? 'en aumento' : product.trend === 'down' ? 'en disminución' : 'estable';
            
            row.innerHTML = `
                <td role="cell">${this.escapeHtml(product.name)}</td>
                <td role="cell">${this.escapeHtml(product.category)}</td>
                <td role="cell"><span class="trend ${trendClass}" aria-label="Tendencia ${trendDescription}">${trendIcon}</span></td>
            `;
            
            // Hacer la fila interactiva
            row.addEventListener('click', () => this.viewProductDetails(product.id));
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.viewProductDetails(product.id);
                }
            });
            
            tbody.appendChild(row);
        });
    }

    // Inicializar el gráfico de estado de inventario
    initInventoryChart() {
        const ctx = document.getElementById('inventoryStatusChart');
        if (!ctx) return;
        
        // Destruir gráfico existente si hay uno
        if (this.inventoryChart) {
            this.inventoryChart.destroy();
        }
        
        // Calcular datos reales basados en el inventario
        const sufficientStock = this.data ? this.data.recentProducts.filter(p => p.stock > 15).length : 0;
        const needsReplenishment = this.data ? this.data.recentProducts.filter(p => p.stock <= 15 && p.stock > 5).length : 0;
        const criticalStock = this.data ? this.data.recentProducts.filter(p => p.stock <= 5).length : 0;
        
        const total = sufficientStock + needsReplenishment + criticalStock;
        const sufficientPercentage = total > 0 ? Math.round((sufficientStock / total) * 100) : 0;
        const replenishmentPercentage = total > 0 ? Math.round((needsReplenishment / total) * 100) : 0;
        const criticalPercentage = total > 0 ? Math.round((criticalStock / total) * 100) : 0;
        
        const data = {
            labels: [
                `Stock suficiente (${sufficientPercentage}%)`,
                `Necesita reposición (${replenishmentPercentage}%)`,
                `Stock crítico (${criticalPercentage}%)`
            ],
            datasets: [{
                data: [sufficientPercentage, replenishmentPercentage, criticalPercentage],
                backgroundColor: [
                    'var(--primary-main)',
                    'var(--info-main)',
                    'var(--secondary-main)'
                ],
                borderWidth: 0,
                hoverOffset: 8
            }]
        };
        
        // Opciones del gráfico con mejoras de accesibilidad
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 12
                        },
                        color: 'var(--primary-main)'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            cutout: '60%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        };
        
        // Crear el gráfico
        this.inventoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });
        
        // Añadir descripción accesible para el gráfico
        const chartDescription = `Gráfico circular que muestra el estado del inventario: ${sufficientPercentage}% con stock suficiente, ${replenishmentPercentage}% necesita reposición, y ${criticalPercentage}% en estado crítico.`;
        ctx.setAttribute('aria-label', chartDescription);
    }

    // Manejar el cierre de sesión
    handleLogout() {
        if (this.isLoading) return;
        
        // Confirmación accesible de cierre de sesión
        if (confirm('¿Estás seguro de que deseas cerrar sesión?\nSerás redirigido a la página de inicio de sesión.')) {
            this.announce('Cerrando sesión, por favor espere');
            this.setLoadingState(true);
            
            // Simular proceso de cierre de sesión
            setTimeout(() => {
                alert('Sesión cerrada correctamente. Redirigiendo al login...');
                // window.location.href = 'login.html';
                this.setLoadingState(false);
            }, 1000);
        }
    }

    // Manejar botones de acción
    handleActionButton(event) {
        const button = event.currentTarget;
        const action = button.textContent.trim() || button.getAttribute('aria-label');

        switch(action) {
            case 'Ver todos los productos':
                this.goToInventory();
                break;
            case 'Gestionar alertas de stock':
                this.goToInventory();
                break;
            case 'Ver estadísticas completas':
                this.goToInventory();
                break;
            case 'Opciones del gráfico':
                this.goToInventory();
                break;
            default:
                console.log('Acción no implementada:', action);
        }
    }

    // Ir al inventario
    goToInventory() {
        this.announce('Navegando al módulo de inventario');
        window.location.href = '../inventario/inventario.html';
    }

    // Ver detalles de un producto
    viewProductDetails(productId) {
        this.announce(`Abriendo detalles del producto con ID ${productId}`);
        // Redirigir al inventario para ver detalles
        window.location.href = '/inventario/inventario.html';
    }

    // Ver todos los productos
    viewAllProducts() {
        this.goToInventory();
    }

    // Gestionar alertas de stock
    manageStockAlerts() {
        this.goToInventory();
    }

    // Ver estadísticas completas
    viewFullStatistics() {
        this.goToInventory();
    }

    // Opciones del gráfico
    chartOptions() {
        this.goToInventory();
    }

    // Utilidad: Formatear fechas
    formatDate(dateString) {
        if (!dateString) {
            return 'Fecha inválida';
        }

        // Ensure it's a string and trim it
        const trimmedString = typeof dateString === 'string' ? dateString.trim() : String(dateString).trim();

        // Check if it matches YYYY-MM-DD format
        if (trimmedString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = trimmedString.split('-');
            return `${day}/${month}/${year}`;
        }

        // Try to parse as Date object as fallback
        const directDate = new Date(trimmedString);
        if (!isNaN(directDate.getTime())) {
            const dd = String(directDate.getDate()).padStart(2, '0');
            const mm = String(directDate.getMonth() + 1).padStart(2, '0');
            const yyyy = directDate.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        }

        return 'Fecha inválida';
    }

    // Utilidad: Escapar HTML para prevenir XSS
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Utilidad: Retraso simulado
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Utilidad: Mostrar error
    showError(message) {
        // Podría implementarse un sistema de notificaciones más elaborado
        console.error(message);
        
        // Mostrar un mensaje de error en la interfaz
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <span aria-hidden="true">⚠️</span>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">Cerrar</button>
        `;
        errorDiv.setAttribute('role', 'alert');
        
        document.querySelector('.main-content').prepend(errorDiv);
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia de la aplicación
    window.inventoryApp = new InventoryDashboard();
    
    // Establecer foco en el contenido principal para accesibilidad
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.focus();
    }
    
    // Añadir estilos dinámicos para mejorar la usabilidad
    const dynamicStyles = `
        /* Mejoras de usabilidad */
        .empty-state {
            text-align: center;
            padding: 2rem;
            color: var(--neutral-60);
            font-style: italic;
        }
        
        .error-message {
            background-color: var(--danger-bg);
            color: var(--danger-main);
            padding: 1rem;
            border-radius: var(--radius-sm);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border-left: 4px solid var(--danger-main);
        }
        
        .error-message button {
            margin-left: auto;
            background: none;
            border: 1px solid var(--danger-main);
            color: var(--danger-main);
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
        }
        
        .error-message button:hover {
            background-color: var(--danger-main);
            color: white;
        }
        
        /* Mejoras de focus para accesibilidad */
        .nav-item a:focus,
        .logout-btn:focus,
        .action-btn:focus,
        .data-table tr:focus,
        .stat-card:focus {
            outline: 2px solid var(--primary-main);
            outline-offset: 2px;
        }
        
        /* Estados de carga */
        [aria-busy="true"] {
            opacity: 0.7;
            pointer-events: none;
        }
        
        /* Badges y tendencias */
        .badge {
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: var(--font-body-sm);
            font-weight: var(--font-medium);
        }
        
        .badge.danger {
            background-color: var(--danger-bg);
            color: var(--danger-main);
        }
        
        .badge.warning {
            background-color: var(--warning-bg);
            color: var(--warning-main);
        }
        
        .trend {
            font-weight: bold;
        }
        
        .trend.success {
            color: var(--success-main);
        }
        
        .trend.danger {
            color: var(--danger-main);
        }
        
        .trend.neutral {
            color: var(--neutral-70);
        }
        
        .stat-value.danger {
            color: var(--danger-main);
            font-weight: var(--font-semibold);
        }
        
        .stat-value.warning {
            color: var(--warning-main);
            font-weight: var(--font-semibold);
        }
        
        /* Filas de tabla interactivas */
        .data-table tr[role="row"] {
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .data-table tr[role="row"]:hover {
            background-color: var(--primary-bg);
        }
        
        .data-table tr[role="row"]:focus {
            background-color: var(--primary-focus);
        }
    `;

    // Añadir estilos dinámicos al documento
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
});