let userWork = document.querySelector("#work-name");
let userDeadline = document.querySelector("#deadline-date");
let userPriority = document.querySelector("#select-priority");
let addItemButton = document.querySelector("#add-item-btn");
let todayToDoList = document.querySelector(".today-todo-list");
let futureToDoList = document.querySelector(".future-todo-list");
let completeToDoList = document.querySelector(".completed-todo-list");
let deleteButton = document.querySelectorAll(".del-btn");
let todo = document.querySelectorAll(".same-todo");

const USER_TODO_KEY = "TODO_KEY";
const now = new Date().toLocaleDateString();
let currentDate = parseInt(now.slice(0, 2)),
  currentMonth = parseInt(now.slice(3, 4)),
  currentYear = parseInt(now.slice(5, now.length));
let todoUserListDetails = [],
  userCurrentYear,
  userCurrentMonth,
  userCurrentDate;
function loadFromStorage() {
  try {
    let stored = localStorage.getItem(USER_TODO_KEY);
    todoUserListDetails = stored ? JSON.parse(stored) : [];
    if (stored) populateUserToDoList();
  } catch (err) {
    console.log("Cannot fetch the data from storage, maybe it's not stored");
    todoUserListDetails = [];
  }
}

function setDataInLocal() {
  todoUserListDetails =
    todoUserListDetails !== undefined ? todoUserListDetails : [];
  localStorage.setItem(USER_TODO_KEY, JSON.stringify(todoUserListDetails));
}


function populateUserToDoList() {
  todayToDoList.innerHTML = "";
  futureToDoList.innerHTML = "";
  completeToDoList.innerHTML = "";
  let futureList =1, todayList = 1, completeList = 1;
  todoUserListDetails.forEach((todouser) => {
     let isToday = false;
  ((userCurrentYear = parseInt(todouser.Deadline.slice(0, 4))),
    (userCurrentMonth = parseInt(todouser.Deadline.slice(5, 7))),
    (userCurrentDate = parseInt(
      todouser.Deadline.slice(8, todouser.Deadline.length),
    )));
  if(userCurrentYear === currentYear &&
    userCurrentMonth === currentMonth &&
    userCurrentDate === currentDate)  isToday = true;
  let listItem = document.createElement("div");
  listItem.classList.add("list-item");
  let workName = document.createElement("span");
  workName.classList.add('work-left');
  let deadlineTime = document.createElement("span");
  deadlineTime.classList.add('deadline-center')
  let priorityLevel = document.createElement("span");
  priorityLevel.classList.add('priority-justify');
  if(todouser.isCompleted===1){
    workName.textContent = `${completeList}. ${todouser.Work}`;
    completeList++;
  }
  else if(isToday){
     workName.textContent = `${todayList}. ${todouser.Work}`;
     todayList++;
  }
  else{
    workName.textContent = `${futureList}. ${todouser.Work}`;
    futureList++;
  }
  deadlineTime.textContent = `${todouser.Deadline}`;
  priorityLevel.textContent = `${todouser.Priority.charAt(0).toUpperCase() + todouser.Priority.slice(1)}`;
  let delCompleteContainer = document.createElement("div");
  delCompleteContainer.classList.add("del-comp");
  let deleteBtn = document.createElement("button");
  let selectTaskBtn = document.createElement("button");
  if(todouser.isCompleted!==1)  deleteBtn.innerHTML = `<i class="fa fa-trash"></i>`;
  else deleteBtn.innerHTML = `<i class="fa fa-trash" style="color: black;"></i>`;
  deleteBtn.classList.add("del-btn");
  deleteBtn.dataset.id = todouser.Id;
  deleteBtn.dataset.name = "delete";
  selectTaskBtn.innerHTML = `<i class="fa fa-check-circle"></i>`;
  selectTaskBtn.classList.add("complete-task-btn");
  selectTaskBtn.dataset.name = 'select'
  selectTaskBtn.dataset.id = todouser.Id;
  if (todouser.isCompleted === 1) {
    listItem.style.backgroundColor = "white";
    workName.style.color = "black";
    deadlineTime.style.color = "black";
    priorityLevel.style.color = "black";
    delCompleteContainer.append(deleteBtn);
    listItem.append(
      workName,
      deadlineTime,
      priorityLevel,
      delCompleteContainer,
    );
    completeToDoList.appendChild(listItem);
    return;
  }
  delCompleteContainer.append(selectTaskBtn, deleteBtn);
  listItem.append(workName, deadlineTime, priorityLevel, delCompleteContainer);
  if(isToday) todayToDoList.appendChild(listItem);
  else futureToDoList.appendChild(listItem);
  });
}

addItemButton.addEventListener("click", (e) => {
  let work = userWork.value,
    deadline = userDeadline.value,
    priority = userPriority.value;
  if (work === "" || deadline === "" || priority === "") {
    alert("Enter all details");
    return;
  }
  ((userCurrentYear = parseInt(deadline.slice(0, 4))),
    (userCurrentMonth = parseInt(deadline.slice(5, 7))),
    (userCurrentDate = parseInt(deadline.slice(8, deadline.length))));
  if (
    userCurrentYear < currentYear ||
    (userCurrentYear >= currentYear && userCurrentMonth < currentMonth) ||
    (userCurrentYear >= currentYear &&
      userCurrentMonth >= currentMonth &&
      userCurrentDate < currentDate)
  ) {
    alert("You can not enter past date");
    return;
  }
  const uniqueId = crypto.randomUUID();
  let todoUser = {
    Id: uniqueId,
    Work: work,
    Deadline: deadline,
    Priority: priority,
    isCompleted: 0,
  };
  todoUserListDetails.push(todoUser);
  setDataInLocal();
  populateUserToDoList();
});

todo.forEach((item) => {
  item.addEventListener("click", (e) => {
    let deleteTargetButton = e.target.closest('.del-btn');
    let selectTargetButton = e.target.closest('.complete-task-btn');
    if(deleteTargetButton!==null){
       if(deleteTargetButton.classList.contains('del-btn')){
          let id = deleteTargetButton.dataset.id;
          if(id)
          deleteToDoFromList(id); 
       }
    } else{
           let id = selectTargetButton.dataset.id;
           if(id)
           toTransferCompleteList(id);
    }
  });
})

function deleteToDoFromList(id) {
  let remListData = [];
  for (let i = 0; i < todoUserListDetails.length; i++) {
    let list = todoUserListDetails[i];
    if (list.Id === id) continue;
    remListData.push(list);
  }
  todoUserListDetails = remListData;
  setDataInLocal();
  populateUserToDoList();
}

function toTransferCompleteList(id) {
  for (let i = 0; i < todoUserListDetails.length; i++) {
    let list = todoUserListDetails[i];
    if (list.Id === id) {
      list.isCompleted = 1;
      break;
    }
  }
  setDataInLocal();
  populateUserToDoList();
}

loadFromStorage();
