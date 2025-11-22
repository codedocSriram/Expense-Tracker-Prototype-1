document.addEventListener("DOMContentLoaded", initialize);
const tableBody = document.querySelector("#table_body");
const userToken = localStorage.getItem("token");
const backendUrl = "http://localhost:4000/api/expenses";
const getExpenseReport = userToken => {
  return axios
    .get(`${backendUrl}/expensereport`, {
      headers: { Autherization: userToken }
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return null;
    });
};

function renderTable(expenseDetails) {
  const newRow = document.createElement("tr");
  let date = new Date(expenseDetails.createdAt);
  let day = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear();
  let formattedDate = `${day}-${month}-${year}`;
  newRow.innerHTML = `
  <td>${formattedDate}</td>
          <td>${expenseDetails.description}</td>
          <td>${expenseDetails.category}</td>
          <td>${expenseDetails.expenseamount}</td>
          `;
  tableBody.appendChild(newRow);
}

async function initialize() {
  const allExpenses = await getExpenseReport(userToken);

  tableBody.innerHTML = "";
  if (allExpenses.success == true) {
    let total = 0;
    for (let i = 0; i < allExpenses.userExpense.length; i++) {
      total += Number(allExpenses.userExpense[i].expenseamount);
      renderTable(allExpenses.userExpense[i]);
      if (i == allExpenses.userExpense.length - 1) {
        const lastRow = document.createElement("tr");
        lastRow.innerHTML = `<tr class="total-row">
          <td></td>
          <td></td>
          <td>Totoal Expense:</td>
          <td class="negative">${total}</td>
        </tr>`;
        tableBody.appendChild(lastRow);
      }
    }
  }
  const downloadButton = document.createElement("button");
  downloadButton.addEventListener("click", event => {
    downloadListAsPDF(event);
  });
  downloadButton.innerText = "Download";
  const div = document.querySelector("#add_button_div");
  div.appendChild(downloadButton);
}

function downloadListAsPDF(event) {
  event.preventDefault(); // Prevent form submission

  const table = document.querySelector("#full_table");

  // Use html2canvas to capture the dialog as an image
  html2canvas(table, { scale: 2 }).then(canvas => {
    const { jsPDF } = window.jspdf;
    const imgData = canvas.toDataURL("image/png"); // Convert canvas to image data
    const pdf = new jsPDF("p", "mm", "a4"); // Create a new jsPDF instance

    // Calculate image dimensions to fit the PDF page
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = canvas.height * pdfWidth / canvas.width;

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Save the PDF
    pdf.save("expenseList.pdf");
    alert("Download complete, check downloads.");
  });
}
