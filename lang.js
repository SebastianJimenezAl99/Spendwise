// lang.js

const LANG_KEY = "spendwise_lang";

// idioma por defecto = inglés
function getLang(){
  return localStorage.getItem(LANG_KEY) || "en";
}

function setLang(l){
  localStorage.setItem(LANG_KEY, l);
  applyLanguage();
}

const translations = {
  en: {
    // index.html
    start: "Get Started",
    
    // botón register en navbar
    registerBtn: "Register",
    
    // hero
    hero_subtitle: "Take Control of Your Finances",

    // feature cards
    feature_track_title: "Track Spending",
    feature_track_text: "Monitor your expenses in real-time with detailed analytics",
    feature_budget_title: "Smart Budget",
    feature_budget_text: "Set budgets and receive alerts to stay on track",
    feature_secure_title: "Secure & Safe",
    feature_secure_text: "Your financial data is encrypted and protected",

    // botones nuevos
    home: "Home",
    welcome: "Welcome back! Please login to your account",
    // login.html
    login: "Login",
    username: "Username",
    password: "Password",
    createAccount: "Create Account",
    backLogin: "Back to Login",
    email: "Email",
    firstName: "First Name",
    lastName: "Last Name",
    register: "Register",
    whychoose: "Why Choose Spendwise?",
    manage_money: "Manage your money with ease and confidence",
    amount_ph: "Amount",
    description_ph: "Description",
    donthave: "Don't have an account?",
    home : "Home",

    // dashboard.html
    logout: "Logout",
    welcome: "Welcome",
    balance: "Balance",
    addTx: "Add Transaction",
    income: "Income",
    expense: "Expense",
    amount: "Amount",
    description: "Description",
    history: "History",
    date: "Date",
    type: "Type",
    add: "Add"
  },

  es: {
    start: "Comenzar",

    // botones nuevos
    home: "Inicio",
    
    // botón register en navbar
    registerBtn: "Registrarse",
    
    // hero
    hero_subtitle: "Toma el control de tus finanzas",

    // feature cards
    feature_track_title: "Controla tus gastos",
    feature_track_text: "Monitorea tus gastos en tiempo real con análisis detallados",
    feature_budget_title: "Presupuesto inteligente",
    feature_budget_text: "Establece presupuestos y recibe alertas para mantenerte en línea",
    feature_secure_title: "Seguro y protegido",
    feature_secure_text: "Tus datos financieros están encriptados y protegidos",

    login: "Iniciar sesión",
    username: "Usuario",
    password: "Contraseña",
    createAccount: "Crear cuenta",
    backLogin: "Volver al inicio",
    email: "Correo",
    firstName: "Nombre",
    lastName: "Apellido",
    register: "Registrarse",
    whychoose: "¿Por qué elegir Spendwise?",
    manage_money: "Administra tu dinero con facilidad y confianza",
    donthave: "¿No tienes una cuenta?",
    welcome: "¡Bienvenido de nuevo! Por favor, inicia sesión en tu cuenta",
    amount_ph: "Monto",
    description_ph: "Descripción",
    home : "Inicio",
    logout: "Cerrar sesión",
    welcome: "Bienvenido",
    balance: "Saldo",
    addTx: "Agregar Transacción",
    income: "Ingreso",
    expense: "Gasto",
    amount: "Monto",
    description: "Descripción",
    history: "Historial",
    date: "Fecha",
    type: "Tipo",
    add: "Agregar"
  }
};

function applyLanguage(){
  const lang = getLang();

  // Textos normales
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if(translations[lang][key]){
      el.textContent = translations[lang][key];
    }
  });

  // Placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if(translations[lang][key]){
      el.placeholder = translations[lang][key];
    }
  });
}

window.SpendwiseLang = { setLang, getLang, applyLanguage };
