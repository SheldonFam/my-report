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
          <button onClick="editReport(event)" class="btn-edit" data-bs-toggle="modal" data-bs-target="#form"><i class="fas fa-edit"></i></button>
          <button onClick="deleteReport(event)" class="btn-delete"  ><i class="fas fa-trash-alt"></i></button>
          <button onClick="viewReport(event)" class="btn-view">View</button>
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
const addButton = document.getElementById("btn-add");

//Setup events
//Event Listeners
//When user press add button after submit data
form.addEventListener("submit", (event) => {
  event.preventDefault();
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

function editReport(event) {
  $("#btn-add").hide();
  $(".btn-save").show();
  let selecteditem = event.target.parentElement.parentElement;
  reportInput.value = selecteditem.children[0].innerHTML;
  dateInput.value = selecteditem.children[1].innerHTML;
  customerInput.value = selecteditem.children[2].innerHTML;
  jobInput.value = selecteditem.children[3].innerHTML;
  actionInput.value = selecteditem.children[4].innerHTML;
}

function deleteReport(event) {
  let id = event.target.parentElement.parentElement.id;
  fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => loadReportList());
}

function viewReport(event) {
  reportModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  let id = event.target.parentElement.parentElement.id;
  fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => showData(data.report));
}

const showData = (report) => {
  const viewReport = document.querySelector(".report");
  viewReport.innerHTML = `
        <table class="table"  ${report._id}  >
        <h3>${report.reportNo}</h3>
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

//Update
//Method:PATCH
const saveButton = document.querySelector(".btn-save");
console.log(saveButton);

function saveReport() {
  console.log("save");
}

// fetch(`${url}/${id}`, {
//   method: "PATCH",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     reportNo: reportInput.value,
//     date: dateInput.value,
//     customerName: customerInput.value,
//     jobscope: jobInput.value,
//     countermeasure: actionInput.value,
//   }),
// })
//   .then((res) => res.json())
//   .then(() => location.reload());
// $("#form").modal("hide");

//After submit data, dismiss modal and show addbutton
form.addEventListener("hidden.bs.modal", function () {
  resetForm();
  msg.innerHTML = " ";
  $("#btn-add").show();
  $(".btn-save").hide();
});

//When create new report is pressed, hide save button
form.addEventListener("show.bs.modal", function () {
  $(".btn-save").hide();
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

//Close viewReport
const closeReport = () => {
  reportModal.classList.add("hidden");
  overlay.classList.add("hidden");
};
