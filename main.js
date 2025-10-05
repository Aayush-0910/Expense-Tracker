import { addTransaction, filterTransactions, exportToCsv } from "./transactions.js";
import { init, updateTransactionList } from "./ui.js";

const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const dateEl = document.getElementById("date");
const searchEl = document.getElementById("search");
const filterEl = document.getElementById("filter");
const exportCsvEl = document.getElementById("export-csv");
const modalEl = document.getElementById("edit-modal");
const closeBtn = document.querySelector(".close-btn");

flatpickr(dateEl, {
  dateFormat: "Y-m-d",
  defaultDate: "today",
});

flatpickr(document.getElementById("edit-date"), {
  dateFormat: "Y-m-d",
});

transactionFormEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);
  const category = categoryEl.value;
  const date = dateEl.value;

  addTransaction({
    id: Date.now(),
    description,
    amount,
    category,
    date,
  });

  init();

  transactionFormEl.reset();
  dateEl._flatpickr.setDate("today");
});

searchEl.addEventListener("input", () => {
  const searchTerm = searchEl.value.toLowerCase();
  const filterValue = filterEl.value;
  const filteredTransactions = filterTransactions(searchTerm, filterValue);
  updateTransactionList(filteredTransactions);
});

filterEl.addEventListener("change", () => {
  const searchTerm = searchEl.value.toLowerCase();
  const filterValue = filterEl.value;
  const filteredTransactions = filterTransactions(searchTerm, filterValue);
  updateTransactionList(filteredTransactions);
});

exportCsvEl.addEventListener("click", exportToCsv);

closeBtn.addEventListener("click", () => (modalEl.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target == modalEl) {
    modalEl.style.display = "none";
  }
});

init();
