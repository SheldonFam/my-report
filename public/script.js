// Api Calls
const url = "/api/report";

const reportApi = {
  getReports: () => {
    return fetch(url).then((res) => res.json());
  },
  addReport: (reportData) => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    }).then((res) => res.json());
  },
};

//Data-> Show UI
const ui = {
  renderReports: (reports) => {
    tasksList.innerHTML = "";
    reports.forEach((report) => {
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
          <button onClick="openReport()" class="open-report" >View</button>
          </span>
    </div>
    `;
    });
  },
};

//Action -> Do Something

//Get Elements
const form = document.getElementById("form");
const reportInput = document.getElementById("reportInput");
const dateInput = document.getElementById("dateInput");
const customerInput = document.getElementById("customerInput");
const jobInput = document.getElementById("jobInput");
const textArea = document.getElementById("textarea");
const msg = document.getElementById("msg");
const tasksList = document.getElementById("tasks");
const addButton = document.getElementById("add_button");

//Setup events
//Event Listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
  resetForm();
});

// //Function
const formValidation = () => {
  if (reportInput.value === "") {
    msg.innerHTML = "Report No cannot be empty!";
    msg.style.color = "Red";
    console.log("failure");
  } else {
    function onAccepthDataSuccess() {
      console.log("success");
      msg.innerHTML = " ";
    }
    acceptData(onAccepthDataSuccess);
  }
};

function loadReportList() {
  //Method:GET
  reportApi.getReports().then((data) => ui.renderReports(data.reports));
}

loadReportList();

//Create
//Method:POST
const acceptData = (onSuccess) => {
  reportApi
    .addReport({
      reportNo: reportInput.value,
      date: dateInput.value,
      customerName: customerInput.value,
      jobscope: jobInput.value,
      countermeasure: textArea.value,
    })
    .then(() => {
      onSuccess();
      loadReportList();
    });
};

tasksList.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(tasksList);
  let editButtonIsPressed = e.target.id == "edit-report";
  let deleteButtonIsPressed = e.target.id == "delete-report";
  let id = e.target.parentElement.parentElement.id;
  console.log(id);

  //Delete-Remove the existing post
  //Method:DELETE
  if (deleteButtonIsPressed) {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => loadReportList());
  }

  if (editButtonIsPressed) {
    let selectedTask = e.target.parentElement.parentElement;
    console.log(selectedTask);
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

//When viewButton is pressed
const report = document.querySelector(".report");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-report");

const openReport = () => {
  report.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeReport = () => {
  report.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnCloseModal.addEventListener("click", closeReport);

//TodoList!!!
//1)Modal will dismiss after submit data.
//2)After viewButton is pressed, open modal and show report data.
//3)Only show date,edit button,delete button and view button after
//  user success submit data.
