document.addEventListener("DOMContentLoaded", initialize);
let leaderBoardView = false;
const token = localStorage.getItem("token");
const body = document.querySelector("body");
let pageNo = 1;
let startIndex = 0;
let totalListCount = 0;
const downloadButton = document.querySelector("#download_btn");
const expenseFormDialog = document.querySelector("#expenseDialog");
const expenseFormDiv = document.querySelector("#expenseFormDiv");
const expenseListDiv = document.querySelector("#userexpenselist");
const premiumButton = document.querySelector("#premiumbutton");
const leaderBoardButton = document.querySelector("#leader_board_btn");
const tipButton = document.querySelector("#ai_tip_btn");
const leaderBoardDiv = document.querySelector("#leaderboardlist");
const prevButton = document.querySelector("#prevPage");
const nextButton = document.querySelector("#nextPage");
const pageInfo = document.querySelector("#pageInfo");
const pageLimit = document.querySelector("#pageLimit");
const investmentTipDialog = document.querySelector("#investment_tip_dialog");
const tipDiv = document.querySelector("#tip_div");
let limit = Number(pageLimit.value);
const backEndUrl = "http://localhost:4000/api/expenses";

expenseFormDialog.addEventListener("click", event => {
  if (!expenseFormDiv.contains(event.target)) {
    expenseFormDialog.close();
  }
});

function openExpenseForm() {
  expenseFormDialog.showModal();
}

function closeExpenseForm() {
  expenseFormDialog.close();
}

function openInvestmentTip() {
  investmentTipDialog.showModal();
}

function closeInvestmentTip() {
  investmentTipDialog.close();
}

const getExpenseCount = userToken => {
  return axios
    .get(`${backEndUrl}/count`, { headers: { Autherization: userToken } })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return null;
    });
};

const getUserExpense = (startIndex, limit, userToken) => {
  return axios
    .get(`${backEndUrl}/pagination/${startIndex}/${limit}`, {
      headers: { Autherization: userToken }
    })
    .then(res => {
      if (res.data !== null) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(err => {
      return null;
    });
};

const getAllExpenses = userToken => {
  return axios
    .get(`${backEndUrl}/allexpenses`, { headers: { Autherization: userToken } })
    .then(res => {
      if (res.data !== null) {
        return res.data;
      }
      return null;
    })
    .catch(err => {
      return null;
    });
};

const addExpense = (userToken, expenseDetails) => {
  return axios
    .post(`${backEndUrl}/add`, expenseDetails, {
      headers: { autherization: userToken }
    })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error;
    });
};

const deleteExpenseById = (id, userToken) => {
  return axios
    .delete(`${backEndUrl}/delete/${id}`, {
      headers: { autherization: userToken }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

const getInvestmentTip = userToken => {
  return axios
    .get(`${backEndUrl}/investmentTip`, {
      headers: { Autherization: userToken }
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return null;
    });
};

async function initialize() {
  if (token == null) {
    body.innerHTML = `<h1>Not Autherized!</h1>`;
    return;
  }
  localStorage.setItem("pageNo", 1);
  renderPage("initialize");
  const userExpenseList = await getUserExpense(startIndex, limit, token);

  if (userExpenseList.premiumuser) {
    premiumButton.textContent = "Premium User";
    premiumButton.disabled = true;
    leaderBoardButton.disabled = false;
    leaderBoardButton.addEventListener("click", () => {
      handleLeaderBoardButton(token);
    });
    downloadButton.disabled = false;
    tipButton.textContent = "Loading...";
    const tip = await getInvestmentTip(token);
    tipDiv.innerHTML = `<h3>Powered By AI</h3><p>Stocks to be considered:<br>${tip.investmentTip}</P>`;
    tipButton.textContent = "Investment Tip";
    tipButton.disabled = false;
  } else if (userExpenseList.premiumuser == false) {
    leaderBoardButton.disabled = true;
    tipButton.disabled = true;
    downloadButton.disabled = true;
  }
}

async function handleExpenseSubmit(event) {
  event.preventDefault();

  const expenseamount = document.querySelector("#expenseamount");
  const category = document.querySelector("#category");
  const description = document.querySelector("#description");
  const expenseDetails = {
    expenseamount: expenseamount.value,
    category: category.value,
    description: description.value
  };

  const addResult = await addExpense(token, expenseDetails);
  if (addResult.success === false) {
    alert(addResult.message);
    return;
  }
  renderPage("add");
  expenseamount.value = "";
  category.value = "";
  description.value = "";
  if (leaderBoardView === true) {
    const allExpenseList = await getAllExpenses(token);
    if (allExpenseList.allExpenses !== null) {
      leaderBoardDiv.innerHTML = "";
      for (let i = 0; i < allExpenseList.allExpenses.length; i++) {
        displayLeaderBoard(allExpenseList.allExpenses[i]);
      }
    }
  }
}

async function handleLeaderBoardButton(token) {
  leaderBoardDiv.classList.toggle("show");
  if (leaderBoardDiv.classList.contains("show")) {
    leaderBoardView = true;
    leaderBoardButton.textContent = "Hide Leaderboard";
    const allExpenseList = await getAllExpenses(token);
    if (allExpenseList.allExpenses !== null) {
      leaderBoardDiv.innerHTML = "";
      for (let i = 0; i < allExpenseList.allExpenses.length; i++) {
        displayLeaderBoard(allExpenseList.allExpenses[i]);
      }
    } else {
      leaderBoardDiv.innerHTML = "";
    }
  } else {
    leaderBoardView = false;
    leaderBoardDiv.innerHTML = "";
    leaderBoardButton.textContent = "Show Leaderboard";
  }
}

function navToReportPage() {
  window.location.href = "./expenseReport.html";
}

function displayExpense(expenseDetails) {
  const div = document.createElement("div");
  div.id = expenseDetails.id;
  div.classList.add("expense-item");
  div.innerHTML = `
    <span>CATEGORY: ${expenseDetails.category}</span>
    <span>DESCRIPTION: ${expenseDetails.description}</span>
    <span>AMOUNT SPENT: ${expenseDetails.expenseamount}</span> 
  `;
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Remove Expense";
  deleteButton.addEventListener("click", () => {
    deleteExpense(div);
  });
  div.appendChild(deleteButton);
  expenseListDiv.appendChild(div);
  let date = new Date(expenseDetails.createdAt);
  let day = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear();
  let formattedDate = `${day}.${month}.${year}`;
}

function displayLeaderBoard(expenseDetails) {
  const div = document.createElement("div");
  div.classList.add("expense-item");
  div.innerHTML = `
    <span>${expenseDetails.username} -- Expense spent: ${expenseDetails.totalexpense}</span>
    `;
  leaderBoardDiv.appendChild(div);
}

async function deleteExpense(div) {
  await deleteExpenseById(div.id, token);
  div.remove();
  renderPage("delete");
  if (leaderBoardView === true) {
    const allExpenseList = await getAllExpenses(token);
    if (allExpenseList.allExpenses !== null) {
      leaderBoardDiv.innerHTML = "";
      for (let i = 0; i < allExpenseList.allExpenses.length; i++) {
        displayLeaderBoard(allExpenseList.allExpenses[i]);
      }
    }
  }
}

async function renderPage(event) {
  const pageNo = Number(localStorage.getItem("pageNo"));
  const limit = Number(pageLimit.value);
  const startIndex = pageNo * limit - limit;

  const listCount = Number(await getExpenseCount(token));

  if (event === "initialize" || event === "add") {
    if (listCount === 0) {
      expenseListDiv.innerHTML = `<div class="emptyExpense"><p>No expense added, please add an expense.</p></div>`;
      return;
    }
    const userExpenseList = await getUserExpense(startIndex, limit, token);
    if (userExpenseList.userExpense === null) {
      expenseListDiv.innerHTML = `<div class="emptyExpense"><p>No expense added, please add an expense.</p></div>`;
    } else {
      expenseListDiv.innerHTML = "";
      for (let i = 0; i < userExpenseList.userExpense.length; i++) {
        displayExpense(userExpenseList.userExpense[i]);
      }
      if (listCount > pageNo * limit) {
        nextButton.disabled = false;
      } else {
        nextButton.disabled = true;
      }
      if (pageNo === 1) {
        prevButton.disabled = true;
      } else {
        prevButton.disabled = false;
      }
    }
    pageInfo.textContent = `Page ${pageNo}`;
  } else if (event === "delete") {
    if (startIndex == listCount && pageNo !== 1) {
      localStorage.setItem("pageNo", pageNo - 1);
    }
    renderPage("initialize");
  } else if (event.target.id === "nextPage") {
    localStorage.setItem("pageNo", pageNo + 1);
    renderPage("initialize");
  } else if (event.target.id === "prevPage") {
    localStorage.setItem("pageNo", pageNo - 1);
    renderPage("initialize");
  } else if (event.target.id === "pageLimit") {
    renderPage("initialize");
  }
}

function buyPremium() {
  window.location.href = "./views/index.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "./index.html";
}
