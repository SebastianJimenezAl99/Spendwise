//controller_dashboard.js
const F = window.SpendwiseFns;

let user = F.getCurrentUser();
if(!user){
  window.location.href = "login.html";
}

document.getElementById("btnLogout").addEventListener("click", () => {
  F.logout();
  window.location.href = "login.html";
});

const tableBody = document.querySelector("#txTable tbody");

// Ensure language selector on dashboard re-renders dashboard when changed
const langSelectDash = document.getElementById('langSelectDashboard');
if(langSelectDash){
  // set initial value
  try{ langSelectDash.value = SpendwiseLang.getLang(); }catch(e){}
  langSelectDash.addEventListener('change', e => {
    SpendwiseLang.setLang(e.target.value);
    renderDashboard();
  });
}

// Load
renderDashboard();

function renderDashboard(){
  const tx = F.loadTransactionsFor(user.username);

  const totals = F.calculateTotals(tx);
  document.getElementById("balanceValue").textContent = F.formatCurrency(totals.balance);

  // Fill table
  tableBody.innerHTML = "";

  tx.forEach(item => {
    const tr = document.createElement("tr");
    // translate the type label using translations from lang.js
    const lang = SpendwiseLang.getLang();
    const typeLabel = (typeof translations !== 'undefined' && translations[lang] && translations[lang][item.type]) ? translations[lang][item.type] : item.type;
    tr.innerHTML = `
      <td>${new Date(item.date).toLocaleString()}</td>
      <td data-i18n="${item.type}">${typeLabel}</td>
      <td>${F.formatCurrency(item.amount)}</td>
      <td>${item.description}</td>
    `;
    tableBody.appendChild(tr);
  });

  drawChart(tx);
}

function drawChart(tx){
  const incomes = tx.filter(t=>t.type==="income").reduce((a,b)=>a + Number(b.amount), 0);
  const expenses = tx.filter(t=>t.type==="expense").reduce((a,b)=>a + Number(b.amount), 0);

  const lang = SpendwiseLang.getLang();
  const incomeLabel = (typeof translations !== 'undefined' && translations[lang] && translations[lang].income) ? translations[lang].income : 'Income';
  const expenseLabel = (typeof translations !== 'undefined' && translations[lang] && translations[lang].expense) ? translations[lang].expense : 'Expense';

  // destroy existing chart if present to avoid duplicates
  const canvas = document.getElementById("chart");
  if(canvas._chartInstance){
    try{ canvas._chartInstance.destroy(); }catch(e){}
  }

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: [incomeLabel, expenseLabel],
      datasets: [{
        label: (typeof translations !== 'undefined' && translations[lang] && translations[lang].amount) ? translations[lang].amount : 'Amount',
        data: [incomes, expenses],
        backgroundColor: [ 'rgba(15,160,99,0.6)', 'rgba(220,53,69,0.6)' ]
      }]
    },
    options: { responsive: true }
  });

  // store reference for later destroy
  canvas._chartInstance = chart;
}

// Add transaction
document.getElementById("transForm").addEventListener("submit", e => {
  e.preventDefault();

  const tx = {
    id: F.makeId(),
    date: new Date().toISOString(),
    type: transType.value,
    amount: Number(transAmount.value),
    description: transDesc.value
  };

  F.addTransaction(user.username, tx);

  renderDashboard();
});
