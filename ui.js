import { getTransactions, removeTransaction, updateTransaction } from "./transactions.js";

const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const modalEl = document.getElementById("edit-modal");
const editFormEl = document.getElementById("edit-form");
const editIdEl = document.getElementById("edit-id");
const editDescriptionEl = document.getElementById("edit-description");
const editAmountEl = document.getElementById("edit-amount");
const editCategoryEl = document.getElementById("edit-category");
const editDateEl = document.getElementById("edit-date");
const expenseChartEl = document.getElementById("expense-chart");

let expenseChart = null;

const formatCurrency = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

const createTransactionElement = (transaction) => {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");

  li.innerHTML = `
    <div class="transaction-details">
      <span class="category">${transaction.category}</span>
      <span>${transaction.description}</span>
      <span class="date">${transaction.date}</span>
    </div>
    <div class="transaction-actions">
      <span>${formatCurrency(transaction.amount)}</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">x</button>
    </div>
  `;

  li.querySelector(".edit-btn").addEventListener("click", () => {
    editIdEl.value = transaction.id;
    editDescriptionEl.value = transaction.description;
    editAmountEl.value = transaction.amount;
    editCategoryEl.value = transaction.category;
    editDateEl._flatpickr.setDate(transaction.date);
    modalEl.style.display = "block";
  });

  li.querySelector(".delete-btn").addEventListener("click", () => {
    removeTransaction(transaction.id);
    init();
  });

  return li;
};

const updateTransactionList = (transactions) => {
  transactionListEl.innerHTML = "";
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
};

const updateSummary = () => {
  const transactions = getTransactions();
  const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
};

const updateChart = () => {
  const transactions = getTransactions();
  const expenseTransactions = transactions.filter((transaction) => transaction.amount < 0);
  const expenseCategories = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  if (expenseChart) {
    expenseChart.data = chartData;
    expenseChart.update();
  } else {
    expenseChart = new Chart(expenseChartEl, {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
};

const init = () => {
  updateTransactionList(getTransactions());
  updateSummary();
  updateChart();
};

editFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = parseInt(editIdEl.value);
  const description = editDescriptionEl.value.trim();
  const amount = parseFloat(editAmountEl.value);
  const category = editCategoryEl.value;
  const date = editDateEl.value;

  updateTransaction({ id, description, amount, category, date });

  modalEl.style.display = "none";
  init();
});

export { init, updateTransactionList };
