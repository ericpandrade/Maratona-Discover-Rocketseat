function toggle() {
  document.querySelector(".modal-overlay").classList.toggle("active");
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },

  set(transactions) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    );
  },
};

const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(
      transaction
    ); /* Está puxando todas as transações, o push funciona para Array, e como ele está puxando o transaction, está puxando todos os objetos. */

    App.reload();
  },
  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },
  incomes() {
    let income = 0;
    Transaction.all.forEach((value) => {
      if (value.amount > 0) {
        income += value.amount;
      }
    });
    return income;
  },
  expenses() {
    let expense = 0;
    Transaction.all.forEach((value) => {
      if (value.amount < 0) {
        expense += value.amount;
      }
    });
    return expense;
  },
  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLtransaction(transaction);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLtransaction(transaction, index) {
    const amount = Util.formatCurrency(transaction.amount);
    const CSSclass = transaction.amount > 0 ? "income" : "expense";
    const html = `
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover Orçamento" id="remove"/>
                </td>
            `;
    return html;
  },
  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Util.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Util.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Util.formatCurrency(
      Transaction.total()
    );
  },
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Util = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(
      /\D/g,
      ""
    ); /* Ache tudo que é só número >  (/\D/g, "")*/

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return signal + value;
  },

  formatAmount(value) {
    value = Number(value) * 100;

    return Math.round(value);
  },

  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateField() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preecha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();
    amount = Util.formatAmount(amount);
    date = Util.formatDate(date);
    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();
    try {
      Form.validateField();
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.clearFields();
      toggle();
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction);

    DOM.updateBalance();

    Storage.set(Transaction.all);
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();
