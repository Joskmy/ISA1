// Referencias a elementos del DOM
const form = document.getElementById("loginForm");
const alertContainer = document.getElementById("alert-container");

/**
 * Muestra una alerta con el tipo, título y mensaje especificados
 * @param {string} type - Tipo de alerta: 'success', 'danger', 'warning', 'info'
 * @param {string} title - Título de la alerta
 * @param {string} message - Mensaje de la alerta
 * @param {boolean} persistent - Si es true, la alerta no se cierra automáticamente
 * @param {number} duration - Duración en milisegundos antes de auto-cerrar (por defecto 4000ms)
 */
function showAlert(type, title, message, persistent = false, duration = 4000) {
  // Crear elemento de alerta
  const alert = document.createElement("div");
  alert.classList.add("alert", type);
  
  // Estructura HTML de la alerta
  alert.innerHTML = `
    <span class="icon" aria-hidden="true"></span>
    <div class="content">
      <div class="title">${title}</div>
      <div class="message">${message}</div>
    </div>
    <button class="close-btn" type="button" aria-label="Cerrar alerta">×</button>
  `;

  // FORZAR ESTILOS NEGRO DESPUÉS DE CREAR LA ALERTA
  setTimeout(() => {
    const titleEl = alert.querySelector('.title');
    const messageEl = alert.querySelector('.message');
    const closeBtnEl = alert.querySelector('.close-btn');
    
    if (titleEl) titleEl.style.color = '#0A0A0A';
    if (messageEl) messageEl.style.color = '#0A0A0A';
    if (closeBtnEl) closeBtnEl.style.color = '#0A0A0A';
  }, 0);

  // Agregar evento de cierre
  const closeBtn = alert.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    removeAlert(alert);
  });

  // Agregar la alerta al contenedor
  alertContainer.appendChild(alert);

  // Auto-cerrar si no es persistente
  if (!persistent) {
    setTimeout(() => {
      if (alert.parentNode) {
        removeAlert(alert);
      }
    }, duration);
  }

  return alert;
}

/**
 * Remueve una alerta con animación
 * @param {HTMLElement} alert - Elemento de alerta a remover
 */
function removeAlert(alert) {
  alert.style.animation = "slideOut 0.3s ease-in forwards";
  
  // Agregar estilos de animación de salida si no existen
  if (!document.querySelector('#alert-animations')) {
    const style = document.createElement('style');
    style.id = 'alert-animations';
    style.textContent = `
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 300);
}

/**
 * Limpia todas las alertas del contenedor
 */
function clearAllAlerts() {
  const alerts = alertContainer.querySelectorAll('.alert');
  alerts.forEach(alert => removeAlert(alert));
}

/**
 * Valida el formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida la fortaleza de la contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} - Objeto con isValid y message
 */
function validatePassword(password) {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "La contraseña debe tener al menos 6 caracteres"
    };
  }
  return { isValid: true };
}

/**
 * Simula una petición de login al servidor
 * @param {object} credentials - Credenciales del usuario
 * @returns {Promise} - Promise que resuelve con el resultado del login
 */
function attemptLogin(credentials) {
  return new Promise((resolve, reject) => {
    // Simular tiempo de respuesta del servidor
    setTimeout(() => {
      // Credenciales de prueba
      const validCredentials = {
        username: "admin@gmail.com",
        password: "admin123"
      };

      if (credentials.username === validCredentials.username && 
          credentials.password === validCredentials.password) {
        resolve({ success: true, message: "Login exitoso" });
      } else {
        reject({ success: false, message: "Credenciales incorrectas" });
      }
    }, 1000); // Simular 1 segundo de latencia
  });
}

/**
 * Maneja el estado de carga del formulario
 * @param {boolean} loading - Estado de carga
 */
function setFormLoading(loading) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('input, select');

  if (loading) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Iniciando sesión...";
    inputs.forEach(input => input.disabled = true);
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Iniciar sesión";
    inputs.forEach(input => input.disabled = false);
  }
}

// Event listener para el envío del formulario
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Limpiar alertas previas
  clearAllAlerts();

  // Obtener valores del formulario
  const formData = new FormData(form);
  const username = formData.get("username").trim();
  const password = formData.get("password").trim();
  const equipo = formData.get("equipo");

  // Validaciones del lado del cliente
  if (!username || !password) {
    showAlert(
      "warning", 
      "Campos requeridos", 
      "Por favor, completa todos los campos obligatorios.", 
      true
    );
    return;
  }

  if (!isValidEmail(username)) {
    showAlert(
      "warning", 
      "Formato inválido", 
      "Por favor, ingresa un correo electrónico válido.", 
      true
    );
    return;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    showAlert(
      "warning", 
      "Contraseña inválida", 
      passwordValidation.message, 
      true
    );
    return;
  }

  // Mostrar estado de carga
  setFormLoading(true);

  try {
    // Intentar login
    const result = await attemptLogin({ username, password });
    
    // Login exitoso
    showAlert(
      "success", 
      "¡Bienvenido!", 
      `Inicio de sesión exitoso. Redirigiendo al sistema...`
    );

    // Simular redirección después de 2 segundos
    setTimeout(() => {
      window.location.href = "/dasboard/dashboard.html";
    }, 2000);


  } catch (error) {
    // Error de autenticación específico
    let errorTitle = "Error de autenticación";
    let errorMessage = error.message;
    
    // Marcar visualmente el campo con error
    if (error.field) {
      addFieldError(error.field);
      
      // Personalizar título según el campo
      if (error.field === "username") {
        errorTitle = "Usuario incorrecto";
      } else if (error.field === "password") {
        errorTitle = "Contraseña incorrecta";
      }
    }
    
    showAlert(
      "danger", 
      errorTitle, 
      errorMessage, 
      true
    );
  } finally {
    // Restaurar estado del formulario
    setFormLoading(false);
  }
});

// Event listeners adicionales para mejorar UX
document.addEventListener("DOMContentLoaded", function() {
  // Enfocar el primer campo al cargar la página
  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    usernameInput.focus();
  }

  // Limpiar alertas al hacer clic en cualquier input
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      // Solo limpiar alertas de warning persistentes al enfocar campos
      const warningAlerts = alertContainer.querySelectorAll('.alert.warning');
      warningAlerts.forEach(alert => removeAlert(alert));
    });
  });
});

/**
 * Añade estilos de error visual a un campo específico
 * @param {string} fieldId - ID del campo a marcar con error
 */
function addFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.style.borderColor = "var(--danger-main)";
    field.style.boxShadow = "0 0 0 3px var(--danger-focus)";
  }
}

/**
 * Remueve estilos de error visual de un campo específico
 * @param {string} fieldId - ID del campo a limpiar
 */
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.style.borderColor = "";
    field.style.boxShadow = "";
  }
}

/**
 * Limpia todos los errores visuales de campos
 */
function clearAllFieldErrors() {
  const fields = ['username', 'password'];
  fields.forEach(fieldId => clearFieldError(fieldId));
}

// Función de utilidad para mostrar alertas de ejemplo (solo para testing)
function showExampleAlerts() {
  setTimeout(() => showAlert("info", "Información", "Esta es una alerta informativa"), 500);
  setTimeout(() => showAlert("success", "Éxito", "Operación completada correctamente"), 1000);
  setTimeout(() => showAlert("warning", "Advertencia", "Revisa los datos ingresados"), 1500);
  setTimeout(() => showAlert("danger", "Error", "Ha ocurrido un error inesperado"), 2000);
}

// Descomentar la siguiente línea para ver alertas de ejemplo al cargar la página
// showExampleAlerts();