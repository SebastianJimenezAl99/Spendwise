// controller_login.js

document.addEventListener("DOMContentLoaded", () => {

  // Detectar si viene desde index con ?mode=register
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");

  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");

  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const backToLoginBtn = document.getElementById("backToLoginBtn");

  // Si viene desde index con ?mode=register → mostrar formulario de registro
  if (mode === "register") {
    loginSection.classList.add("d-none");
    registerSection.classList.remove("d-none");
  }

  // Aplicar idioma al cargar la página
  SpendwiseLang.applyLanguage();
  updatePlaceholders();

  // Mostrar registro desde el botón dentro del login.html
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", () => {
      loginSection.classList.add("d-none");
      registerSection.classList.remove("d-none");

      SpendwiseLang.applyLanguage();
      updatePlaceholders();
    });
  }

  // Volver al login
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", () => {
      registerSection.classList.add("d-none");
      loginSection.classList.remove("d-none");

      SpendwiseLang.applyLanguage();
      updatePlaceholders();
    });
  }

  // Evento del select de idioma
  const langSelect = document.getElementById("langSelectLogin");
  if (langSelect) {
    langSelect.value = SpendwiseLang.getLang();
    langSelect.addEventListener("change", e => {
      SpendwiseLang.setLang(e.target.value);
      updatePlaceholders();
    });
  }

  // ---------------------------
  // 🔥 LOGIN REAL (ESTO FALTABA)
  // ---------------------------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUser").value.trim();
      const password = document.getElementById("loginPass").value.trim();

      const result = SpendwiseFns.authenticate(username, password);

      if (result.ok) {
        window.location.href = "dashboard.html";
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    });
  }

  // -----------------------------
  // 🔥 REGISTRO REAL (SÍ EXISTÍA)
  // -----------------------------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = {
        username: document.getElementById("regEmail").value.trim(), // puedes cambiar si quieres username separado
        password: document.getElementById("regPass").value.trim(),
        email: document.getElementById("regEmail").value.trim(),
        firstName: document.getElementById("regFirst").value.trim(),
        lastName: document.getElementById("regLast").value.trim()
      };

      const result = SpendwiseFns.createUser(data);

      if (result.ok) {
        alert("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
        registerSection.classList.add("d-none");
        loginSection.classList.remove("d-none");
      } else {
        alert(result.message);
      }
    });
  }

});


// ---- FUNCIONES AUXILIARES ---- //
function updatePlaceholders() {
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = translations[SpendwiseLang.getLang()][key];
  });
}

