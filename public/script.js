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
     <div >
      <p id="number" class=reportID>${report._id}</p>
      <p class="fw-bold">${report.date}</p>
      <button onClick="editReport(event)" class="btn-edit" data-bs-toggle="modal" data-bs-target="#form"><i class="fas fa-edit"></i></button>
      <button onClick="deleteReport()" class="btn-delete"  ><i class="fas fa-trash-alt"></i></button>
      <button onClick="viewReport()" class="btn-view">View</button>
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
const saveButton = document.querySelector("#btn-save");

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

//When editReport button is pressed
function editReport(event) {
  $("#btn-add").hide();
  $("#btn-save").show();
  let id = document.getElementById("number").innerHTML;
  console.log(id);
  reportInput.value = document.getElementById("report-No").innerHTML;
  dateInput.value = document.getElementById("date").innerHTML;
  customerInput.value = document.getElementById("customer").innerHTML;
  jobInput.value = document.getElementById("job").innerHTML;
  actionInput.value = document.getElementById("plan").innerHTML;
}

//When deleteReport button is pressed
function deleteReport() {
  let id = document.getElementById("number").innerHTML;
  console.log(id);
  fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => loadReportList());
}

//When viewReport button is pressed
function viewReport() {
  reportModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  let id = document.getElementById("number").innerHTML;
  console.log(id);
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
        <table class="table" ${report._id}  >
        <h3 id="report-No">${report.reportNo}</h3>
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
            <td id="date">${report.date}</td>
            <td id="customer">${report.customerName}</td>
            <td id="job">${report.jobscope}</td>
             <td id="plan">${report.countermeasure} </td>
          </tr>
           </tbody>
        </table>
          <button onClick="closeReport()" class="close-report" >&times;</button>
     `;
};

//Update
//Method:PATCH

function saveReport() {
  console.log("save");
  let id = document.getElementById("number").innerHTML;
  console.log(id);
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
}

//After submit data, dismiss modal and show addbutton
form.addEventListener("hidden.bs.modal", function () {
  resetForm();
  msg.innerHTML = " ";
  $("#btn-add").show();
  $("#btn-save").hide();
});

//When create new report section is pressed, hide save button
form.addEventListener("show.bs.modal", function () {
  $("#btn-save").hide();
});

//Reset the form
const resetForm = () => {
  reportInput.value = "";
  dateInput.value = "";
  customerInput.value = "";
  jobInput.value = "";
  actionInput.value = "";
};

//Define function for view-report button
const reportModal = document.querySelector(".report");
const overlay = document.querySelector(".overlay");

//Close viewReport
const closeReport = () => {
  reportModal.classList.add("hidden");
  overlay.classList.add("hidden");
};
