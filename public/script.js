//Element
const form = document.getElementById("form");
const reportInput = document.getElementById("reportInput");
const dateInput = document.getElementById("dateInput");
const customerInput = document.getElementById("customerInput");
const jobInput = document.getElementById("jobInput");
const textArea = document.getElementById("textarea");
const msg = document.getElementById("msg");
const tasksList = document.getElementById("tasks");
const addButton = document.getElementById("add");
const url = "/api/report";

//Event Listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
  resetForm();
});

//Function
const formValidation = () => {
  if (reportInput.value === "") {
    msg.innerHTML = "Report No cannot be empty!";
    msg.style.color = "Red";
    console.log("failure");
  } else {
    acceptData();
    console.log("success");
    msg.innerHTML = " ";

    add.setAttribute("data-bs-dismiss", "modal");
    add.click();
  }
};

const renderReports = (data) => {
  data.reports.forEach((report) => {
    tasksList.innerHTML += `
     <div id=${report._id}>
          <span class="fw-bold">${report.reportNo}</span>
          <span class="small text-secondary">${report.date}</span>
          <p>${report.customerName}</p>
          <p>${report.jobscope}</p>
          <p>${report.countermeasure}</p>
          <span class="options">
          <i  id="edit-report" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
          <i  id="delete-report" class="fas fa-trash-alt"></i>
          </span>
    </div>
    `;
    console.log(data);
  });
};

//Method:GET
fetch(url)
  .then((res) => res.json())
  .then((data) => renderReports(data));

//Create
//Method:POST
const acceptData = () => {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reportNo: reportInput.value,
      date: dateInput.value,
      customerName: customerInput.value,
      jobscope: jobInput.value,
      countermeasure: textArea.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const dataArr = [];
      dataArr.push(data);
      renderReports(dataArr);
    });
};

tasksList.addEventListener("click", (e) => {
  e.preventDefault();

  let editButtonIsPressed = e.target.id == "edit-report";
  let deleteButtonIsPressed = e.target.id == "delete-report";
  let id = e.target.parentElement.parentElement.id;

  //Delete-Remove the existing post
  //Method:DELETE
  if (deleteButtonIsPressed) {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => location.reload());
  }

  if (editButtonIsPressed) {
    let selectedTask = e.target.parentElement.parentElement;
    reportInput.value = selectedTask.children[0].innerHTML;
    dateInput.value = selectedTask.children[1].innerHTML;
    customerInput.value = selectedTask.children[2].innerHTML;
    jobInput.value = selectedTask.children[3].innerHTML;
    textArea.value = selectedTask.children[4].innerHTML;
  }

  //Update
  //Method:PATCH
  addButton.addEventListener("click", (e) => {
    e.preventDefault();
    fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportNo: reportInput.value,
        date: dateInput.value,
        customerName: customerInput.value,
        jobscope: jobInput.value,
        countermeasure: textArea.value,
      }),
    })
      .then((res) => res.json())
      .then(() => location.reload());
  });
});

const resetForm = () => {
  reportInput.value = "";
  dateInput.value = "";
  customerInput.value = "";
  jobInput.value = "";
  textArea.value = "";
};
