//Element
const form = document.getElementById("form");
const reportInput = document.getElementById("reportInput");
const dateInput = document.getElementById("dateInput");
const customerInput = document.getElementById("customerInput");
const jobInput = document.getElementById("jobInput");
const textArea = document.getElementById("textarea");
const msg = document.getElementById("msg");
const tasks = document.getElementById("tasks");
const add = document.getElementById("add");

//Event Listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

//Function
const formValidation = () => {
  if (reportInput.value === "") {
    msg.innerHTML = "Report No cannot be empty!";
    msg.style.color = "Red";
    console.log("failure");
  } else {
    console.log("success");
    msg.innerHTML = " ";
    acceptData();

    add.setAttribute("data-bs-dismiss", "modal");
    add.click();

    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let data = {};

const acceptData = () => {
  data["report"] = reportInput.value;
  data["date"] = dateInput.value;
  data["customer"] = customerInput.value;
  // data["job"] = jobInput.value;
  // data["description"] = textArea.value;
  console.log(data);

  createTasks();
};

const createTasks = () => {
  tasks.innerHTML += `
     <div>
          <span class="fw-bold">${data.report}</span>
          <span class="small text-secondary">${data.date}</span>
          <p>${data.customer}</p>
          <span class="options">
            <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick="deleteTask(this)" class="fas fa-trash-alt"></i>
          </span>
        </div>
    `;
  resetForm();
};

const deleteTask = (e) => {
  e.parentElement.parentElement.remove();
};

const editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;
  reportInput.value = selectedTask.children[0].innerHTML;
  dateInput.value = selectedTask.children[1].innerHTML;
  customerInput.value = selectedTask.children[2].innerHTML;
  // jobInput.value = selectedTask.children[3].innerHTML;
  // textArea.value = selectedTask.children[4].innerHTML;

  selectedTask.remove();
};

const resetForm = () => {
  reportInput.value = "";
  dateInput.value = "";
  customerInput.value = "";
  jobInput.value = "";
  textArea.value = "";
};
