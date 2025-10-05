let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const getTransactions = () => transactions;

const addTransaction = (transaction) => {
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const updateTransaction = (updatedTransaction) => {
  transactions = transactions.map((transaction) =>
    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
  );
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const filterTransactions = (searchTerm, filterValue) => {
  return transactions.filter((transaction) => {
    const descriptionMatch = transaction.description.toLowerCase().includes(searchTerm);
    const typeMatch = (filterValue === "all") || (filterValue === "income" && transaction.amount > 0) || (filterValue === "expense" && transaction.amount < 0);
    return descriptionMatch && typeMatch;
  });
};

const exportToCsv = () => {
  const headers = ["ID", "Description", "Amount", "Category", "Date"];
  const csvContent = [
    headers.join(","),
    ...transactions.map((transaction) => {
      return [
        transaction.id,
        `"${transaction.description}"`,
        transaction.amount,
        transaction.category,
        transaction.date,
      ].join(",");
    }),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export {
  getTransactions,
  addTransaction,
  removeTransaction,
  updateTransaction,
  filterTransactions,
  exportToCsv,
};
