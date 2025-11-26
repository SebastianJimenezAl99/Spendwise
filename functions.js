/* functions.js
   Funciones puras para Spendwise (manejo de localStorage, cálculos, recomendaciones)
*/

const LS_USERS = 'spendwise_users_v1';
const LS_CURRENT = 'spendwise_current_v1';

const defaultUsers = [
  { username: 'user1', password: 'pass1', email: 'user1@example.com', firstName: 'Ana', lastName: 'Perez' },
  { username: 'user2', password: 'pass2', email: 'user2@example.com', firstName: 'Juan', lastName: 'Lopez' },
  { username: 'demo',  password: 'demo',  email: 'demo@example.com',  firstName: 'Demo', lastName: 'Account' }
];

function loadUsers(){
  const raw = localStorage.getItem(LS_USERS);
  if(!raw){
    localStorage.setItem(LS_USERS, JSON.stringify(defaultUsers));
    return [...defaultUsers];
  }
  try { return JSON.parse(raw) || []; } catch(e){ localStorage.setItem(LS_USERS, JSON.stringify(defaultUsers)); return [...defaultUsers]; }
}

function saveUsers(users){
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

/* Create user — returns {ok:true,user} or {ok:false,message} */
function createUser({username,password,email,firstName,lastName}){
  if(!username || !password || !email) return {ok:false, message:'Missing fields'};
  const users = loadUsers();
  if(users.some(u=>u.username===username || u.email===email)) return {ok:false, message:'Username or email exists'};
  const user = {username,password,email,firstName,lastName};
  users.push(user);
  saveUsers(users);
  // initialize transactions array
  saveTransactionsFor(user.username, []);
  return {ok:true,user};
}

function authenticate(username, password){
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if(user) {
    localStorage.setItem(LS_CURRENT, JSON.stringify(user));
    return {ok:true,user};
  }
  return {ok:false, message:'Invalid credentials'};
}

function getCurrentUser(){
  const raw = localStorage.getItem(LS_CURRENT);
  if(!raw) return null;
  try { return JSON.parse(raw); } catch(e){ return null; }
}

function logout(){
  localStorage.removeItem(LS_CURRENT);
}

/* Transactions store per username */
function txKey(username){ return `spendwise_tx_${username}_v1`; }

function saveTransactionsFor(username, tx){
  localStorage.setItem(txKey(username), JSON.stringify(tx || []));
}

function loadTransactionsFor(username){
  const raw = localStorage.getItem(txKey(username));
  if(!raw) return [];
  try { return JSON.parse(raw) || []; } catch(e){ return []; }
}

/* Add transaction object:
   {id, date, type: 'income'|'expense', amount, category, description}
*/
function addTransaction(username, txObj){
  const tx = loadTransactionsFor(username);
  tx.unshift(txObj); // newest first
  saveTransactionsFor(username, tx);
}

/* Remove transaction by id */
function removeTransaction(username, id){
  let tx = loadTransactionsFor(username);
  tx = tx.filter(t=>t.id !== id);
  saveTransactionsFor(username, tx);
}

/* Calculations */
function calculateTotals(transactions){
  // totals computed digit-by-digit via numbers
  let totalIncome = 0;
  let totalExpense = 0;
  for(const t of transactions){
    const amt = Number(parseFloat(t.amount) || 0);
    if(t.type === 'income') totalIncome += amt;
    else totalExpense += amt;
  }
  const balance = totalIncome - totalExpense;
  return {
    totalIncome: round2(totalIncome),
    totalExpense: round2(totalExpense),
    balance: round2(balance)
  };
}

function round2(n){ return Math.round((n + Number.EPSILON) * 100) / 100; }

/* Highest income / expense */
function findHighest(transactions){
  const incomes = transactions.filter(t=>t.type==='income');
  const expenses = transactions.filter(t=>t.type==='expense');

  const maxIncome = incomes.length ? incomes.reduce((a,b)=> a.amount*1 >= b.amount*1 ? a : b) : null;
  const maxExpense = expenses.length ? expenses.reduce((a,b)=> a.amount*1 >= b.amount*1 ? a : b) : null;

  return {
    maxIncome,
    maxExpense
  };
}

/* Recommendations: basic rules, influenced by ratios */
function generateRecommendations(transactions){
  const { totalIncome, totalExpense } = calculateTotals(transactions);
  const tips = [];

  if(totalIncome === 0 && totalExpense === 0){
    tips.push("Record your first income and expense to start tracking your finance.");
    return tips;
  }

  if(totalIncome === 0){
    tips.push("You have no recorded income. Add an income source to create a budget.");
  } else {
    const ratio = totalExpense / totalIncome;
    if(ratio >= 1){
      tips.push("Your expenses are equal or greater than your income. Consider reducing variable expenses.");
      tips.push("Avoid non-essential purchases and postpone large expenses.");
    } else if(ratio >= 0.7){
      tips.push("Expenses are high compared to income. Aim to reduce monthly variable spending by 10%.");
    } else {
      tips.push("Good — expenses are under control. Try to save at least 10% of your income.");
    }
  }

  // common tips
  tips.push("Make a shopping list before buying and avoid impulse purchases.");
  tips.push("Automate savings: transfer a small amount each payday to savings.");
  return tips;
}

/* Utility: formatted currency */
function formatCurrency(n){
  return `$${(Number(n) || 0).toFixed(2)}`;
}

/* Simple id generator */
function makeId(){
  return 'tx_' + Math.random().toString(36).slice(2,9);
}

/* Export functions for controller */
window.SpendwiseFns = {
  loadUsers, saveUsers, createUser, authenticate, getCurrentUser, logout,
  addTransaction, loadTransactionsFor, saveTransactionsFor, removeTransaction,
  calculateTotals, findHighest, generateRecommendations, formatCurrency, makeId
};
