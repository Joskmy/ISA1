/**
 * Muestra una alerta con el tipo, título y mensaje especificados
 * @param {string} type - Tipo de alerta: 'success', 'danger', 'warning', 'info'
 * @param {string} title - Título de la alerta
 * @param {string} message - Mensaje de la alerta
 * @param {boolean} persistent - Si es true, la alerta no se cierra automáticamente
 * @param {number} duration - Duración en milisegundos antes de auto-cerrar (por defecto 4000ms)
 */
function showAlert(type, title, message, duration = 3000) {
  const container = document.getElementById("alert-container");

  // Crear alerta
  const alert = document.createElement("div");
  alert.className = `alert ${type}`;
  alert.innerHTML = `
    <div class="icon"></div>
    <div class="content">
      <p class="title">${title}</p>
      <p class="message">${message}</p>
    </div>
    <button class="close-btn" aria-label="Cerrar alerta">&times;</button>
  `;

  // Botón de cerrar manual
  alert.querySelector(".close-btn").addEventListener("click", () => {
    alert.remove();
  });

  // Insertar en el contenedor
  container.appendChild(alert);

  // Autocierre después del tiempo indicado
  if (duration > 0) {
    setTimeout(() => {
      alert.remove();
    }, duration);
  }
}


// Clase principal de la aplicación de perfil
class ProfileApp {
    constructor() {
        this.init();
    }

    // Inicializar la aplicación
    init() {
        this.setupEventListeners();
        this.loadProfile();
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

        // Edit profile
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.openProfileModal());
        }

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        }

        // Cancel profile editing
        const cancelProfileBtn = document.getElementById('cancel-profile-btn');
        if (cancelProfileBtn) {
            cancelProfileBtn.addEventListener('click', () => this.closeProfileModal());
        }

        // Close profile modal
        const profileModal = document.getElementById('profile-modal');
        if (profileModal) {
            const closeBtn = profileModal.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeProfileModal());
            }

            // Close on outside click
            profileModal.addEventListener('click', (e) => {
                if (e.target === profileModal) {
                    this.closeProfileModal();
                }
            });
        }
    }

    // Configurar navegación por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProfileModal();
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

    // Cargar información del perfil
    loadProfile() {
        const profileData = this.getProfileData();
        this.displayProfile(profileData);
        this.updateGreeting(profileData.name);
    }

    // Obtener datos del perfil
    getProfileData() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            return JSON.parse(savedProfile);
        }

        // Datos por defecto
        return {
            name: 'Admin',
            email: 'admin@gmail.com',
            role: 'Administrador',
            team: 'EQUIPO-001 - Producción'
        };
    }

    // Mostrar información del perfil
    displayProfile(profileData) {
        const nameElement = document.getElementById('profile-name-display');
        const emailElement = document.getElementById('profile-email-display');
        const roleElement = document.getElementById('profile-role-display');
        const teamElement = document.getElementById('profile-team-display');

        if (nameElement) nameElement.textContent = profileData.name;
        if (emailElement) emailElement.textContent = profileData.email;
        if (roleElement) roleElement.textContent = profileData.role;
        if (teamElement) teamElement.textContent = profileData.team;
    }

    // Actualizar saludo
    updateGreeting(name) {
        const greetingElement = document.getElementById('user-greeting');
        if (greetingElement) {
            greetingElement.textContent = name;
        }
    }

    // Abrir modal de edición de perfil
    openProfileModal() {
        const modal = document.getElementById('profile-modal');
        const profileData = this.getProfileData();

        // Llenar el formulario con datos actuales
        document.getElementById('profile-name').value = profileData.name;
        document.getElementById('profile-email').value = profileData.email;
        document.getElementById('profile-role').value = profileData.role;
        document.getElementById('profile-team').value = profileData.team;

        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('profile-name').focus();
    }

    // Cerrar modal de edición de perfil
    closeProfileModal() {
        const modal = document.getElementById('profile-modal');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Manejar envío del formulario de perfil
    handleProfileSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const profileData = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            role: formData.get('role'),
            team: formData.get('team')
        };

        // Validaciones básicas
        if (!profileData.name || !profileData.email) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileData.email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        // Guardar en localStorage
        localStorage.setItem('userProfile', JSON.stringify(profileData));

        // Actualizar la interfaz
        this.displayProfile(profileData);
        this.updateGreeting(profileData.name);
        this.closeProfileModal();

        this.announce();

        showAlert(
            "info", 
            "¡Perfil actualizado!", 
            `Perfil actualizado correctamente`,
            3000
        );
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
            dateElement.setAttribute('datetime', today.toISOString());
        }
    }

    // Ir a la página de perfil
    goToProfile() {
        // Already on profile page, maybe refresh or do nothing
        this.announce('Ya estás en la página de perfil');
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
                window.location.href = '../index.html';
            }, 1000);
        }
    }
}
    // Inicializar la aplicación cuando el DOM esté cargado
    document.addEventListener('DOMContentLoaded', function() {
        // Crear instancia de la aplicación
        window.profileApp = new ProfileApp();

        // Establecer foco en el contenido principal
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
        }
    });