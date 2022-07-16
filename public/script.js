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
          <button onClick="openReport()" class="view_report"  id="view-report" >View</button>
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
const actionInput = document.getElementById("actionInput");
const msg = document.getElementById("msg");
const tasksList = document.getElementById("tasks");
const addButton = document.getElementById("add_button"); // not use??
const saveButton = document.getElementById("save_button");

//Setup events
//Event Listeners
//When user press add button after submit data
form.addEventListener("submit", (events) => {
  events.preventDefault();
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
      $("#form").modal("hide");
    }
    acceptData(onAccepthDataSuccess);
  }
};

//Method:GET
function loadReportList() {
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
      countermeasure: actionInput.value,
    })
    .then(() => {
      onSuccess();
      loadReportList();
    });
};

// Inside the small task , icon and function
tasksList.addEventListener("click", (e) => {
  e.preventDefault();

  let editButtonIsPressed = e.target.id == "edit-report";

  let deleteButtonIsPressed = e.target.id == "delete-report";

  let viewReportButton = e.target.id == "view-report";

  let id = e.target.parentElement.parentElement.id;

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
    $("#add_button").hide();
    $("#save_button").show();
    let selectedTask = e.target.parentElement.parentElement;
    reportInput.value = selectedTask.children[0].innerHTML;
    dateInput.value = selectedTask.children[1].innerHTML;
    customerInput.value = selectedTask.children[2].innerHTML;
    jobInput.value = selectedTask.children[3].innerHTML;
    actionInput.value = selectedTask.children[4].innerHTML;
  }

  if (viewReportButton) {
    fetch(`${url}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => showData(data.report));

    const showData = (report) => {
      const viewReport = document.querySelector(".report");
      viewReport.innerHTML = `
        <table class="table"  ${report._id}  >
        <thead>
          <tr>
            <th>Report Date</th>
            <th>Customer / Contact Person</th>
            <th>Purpose Of Visit / JobScope</th>
            <th>Action Plan/Countermeasure</th>
          </tr>
           </thead>
           <tbody>
          <tr>
            <td>${report.date}</td>
            <td>${report.customerName}</td>
            <td>${report.jobscope}</td>
             <td>${report.countermeasure} </td>
          </tr>
           </tbody>
        </table>
          <button onClick="closeReport()" class="close-report" >&times;</button>
     `;
    };
  }

  //Update
  //Method:PATCH
  saveButton.addEventListener("click", (events) => {
    events.preventDefault();
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
        countermeasure: actionInput.value,
      }),
    })
      .then((res) => res.json())
      .then(() => location.reload());
    $("#form").modal("hide");
  });
});

//After submit data, dismiss modal and show addbutton
form.addEventListener("hidden.bs.modal", function () {
  resetForm();
  msg.innerHTML = " ";
  $("#add_button").show();
  $("#save_button").hide();
});

//When create new report is pressed, hide save button
form.addEventListener("show.bs.modal", function () {
  $("#save_button").hide();
});

//Reset the form
const resetForm = () => {
  reportInput.value = "";
  dateInput.value = "";
  customerInput.value = "";
  jobInput.value = "";
  actionInput.value = "";
};

//To view report
//When viewButton is pressed
const reportModal = document.querySelector(".report");
const overlay = document.querySelector(".overlay");

const openReport = () => {
  reportModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

//Close viewReport
const closeReport = () => {
  reportModal.classList.add("hidden");
  overlay.classList.add("hidden");
};
