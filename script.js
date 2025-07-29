const note = document.getElementById("note");
const toggleColor = document.getElementById("toggleColor");
const newTaskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task");
const uncheckedList = document.getElementById("unchecked-list");
const checkedList = document.getElementById("checked-list");
const savedColor = localStorage.getItem("noteColor");
if (savedColor) note.style.background = savedColor;
const editDateDisplay = document.getElementById("edit-date");
const savedDate = localStorage.getItem("lastEdited");
if (savedDate) {
  editDateDisplay.textContent = "Edited " + savedDate;
}

toggleColor.addEventListener("click", () => {
  const isWhite = note.style.background === "white";
  
  if (isWhite) {
    note.style.background = "#f9e276";
    note.classList.remove("white");
    document.querySelector(".fab").style.background = "#ffffff"; // FAB back to white
    localStorage.setItem("noteColor", "#f9e276");
  } else {
    note.style.background = "white";
    note.classList.add("white");
    document.querySelector(".fab").style.background = "#f9e176"; // FAB becomes yellow
    localStorage.setItem("noteColor", "white");
  }
  updateEditDate();
});

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  uncheckedList.innerHTML = "";
  checkedList.innerHTML = "";
  tasks.forEach(task => {
    const li = createTask(task.text, task.completed);
    (task.completed ? checkedList : uncheckedList).appendChild(li);
  });
}

function saveTasks() {
  const allLis = [...uncheckedList.children, ...checkedList.children];
  const tasks = allLis.map(li => ({
    text: li.querySelector("span").textContent,
    completed: li.querySelector("input").checked
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateEditDate();
}

function updateEditDate() {
  const now = new Date();
  const formatted = now.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  localStorage.setItem("lastEdited", formatted);
  editDateDisplay.textContent = "Edited " + formatted;
}

function createTask(text, completed = false) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = text;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  li.appendChild(span);
  li.appendChild(checkbox);
  if (completed) li.classList.add("completed");

  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed");
    if (checkbox.checked) {
      checkedList.appendChild(li);
    } else {
      uncheckedList.appendChild(li);
    }
    saveTasks();
  });

  return li;
}

addTaskBtn.addEventListener("click", () => {
  const text = newTaskInput.value.trim();
  if (text) {
    const li = createTask(text);
    uncheckedList.appendChild(li);
    saveTasks();
    newTaskInput.value = "";
  }
});

loadTasks();
