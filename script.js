import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

let count = 1;

document.getElementById("addBtn").addEventListener("click", async () => {
  const date = document.getElementById("date").value;
  const place = document.getElementById("place").value;
  const income = parseFloat(document.getElementById("income").value) || 0;
  const expense = parseFloat(document.getElementById("expense").value) || 0;
  const total = income + expense;
  const saving = income - expense;

  const entry = { date, place, income, expense, total, saving };

  try {
    await addDoc(collection(db, "entries"), entry);
    addToTable(entry);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

function addToTable(data) {
  const table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
  const row = table.insertRow();

  row.insertCell(0).innerText = count++;
  row.insertCell(1).innerText = data.date;
  row.insertCell(2).innerText = data.place;
  row.insertCell(3).innerText = data.income;
  row.insertCell(4).innerText = data.expense;
  row.insertCell(5).innerText = data.total;
  row.insertCell(6).innerText = data.saving;

  const actionsCell = row.insertCell(7);
  actionsCell.innerHTML = `
    <button onclick='editEntry("${data.id}")'>✏️</button>
    <button onclick='deleteEntry("${data.id}", this)'>🗑️</button>
  `;

  // UPDATE TOTALS
  totalIncome += data.income;
  totalExpense += data.expense;
  totalOverall += data.total;
  totalSaving += data.saving;

  updateTotalsFooter();
}

  
  // Actions (Edit/Delete)
  const actionsCell = row.insertCell(7);
  actionsCell.innerHTML = `
    <button onclick='editEntry("${data.id}")'>✏️</button>
    <button onclick='deleteEntry("${data.id}", this)'>🗑️</button>
  `;

function exportToExcel() {
  const table = document.getElementById("dataTable");
  const wb = XLSX.utils.table_to_book(table, {sheet:"આવક-જાવક"});
  XLSX.writeFile(wb, "income-expense.xlsx");
}

function drawMonthlyChart(dataArray) {
  const monthlyData = {};

  dataArray.forEach(data => {
    const month = data.date.slice(0, 7); // yyyy-mm
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    monthlyData[month].income += data.income;
    monthlyData[month].expense += data.expense;
  });

  const labels = Object.keys(monthlyData);
  const incomeData = labels.map(m => monthlyData[m].income);
  const expenseData = labels.map(m => monthlyData[m].expense);

  new Chart(document.getElementById("monthlyChart"), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'આવક ₹', data: incomeData, backgroundColor: '#4caf50' },
        { label: 'જાવક ₹', data: expenseData, backgroundColor: '#f44336' }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'માસિક આવક-જાવક રીપોર્ટ'
        }
      }
    }
  });
}
async function deleteEntry(id, btn) {
  if (confirm("શુ તમારે આ એન્ટ્રી કાઢવી છે?")) {
    await deleteDoc(doc(db, "entries", id));
    btn.parentElement.parentElement.remove();
  }
}

function editEntry(id) {
  const row = event.target.closest("tr");
  const cells = row.querySelectorAll("td");

  const newPlace = prompt("સ્થળ નામ:", cells[2].innerText);
  const newIncome = parseFloat(prompt("આવક ₹:", cells[3].innerText)) || 0;
  const newExpense = parseFloat(prompt("જાવક ₹:", cells[4].innerText)) || 0;

  const total = newIncome + newExpense;
  const saving = newIncome - newExpense;

  updateDoc(doc(db, "entries", id), {
    place: newPlace,
    income: newIncome,
    expense: newExpense,
    total,
    saving
  }).then(() => location.reload());
}

function updateTotalsFooter() {
  document.getElementById("totalIncome").innerText = "₹" + totalIncome;
  document.getElementById("totalExpense").innerText = "₹" + totalExpense;
  document.getElementById("totalOverall").innerText = "₹" + totalOverall;
  document.getElementById("totalSaving").innerText = "₹" + totalSaving;
}


let totalIncome = 0;
let totalExpense = 0;
let totalOverall = 0;
let totalSaving = 0;


window.onload = loadEntries;
