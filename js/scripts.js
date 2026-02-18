const todoForm = document.querySelector("#add-form");
const todoInput = document.querySelector("#to-do-input");
const todoList = document.querySelector("#to-do-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
// const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;


//Functions
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".to-do-task");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "to do":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }

};

const generateHTMLForTodo = (task, done) => {
  const todo = document.createElement("div");
  todo.classList.add("to-do-task");

  if (done) {
    todo.classList.add("done");
  }

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = task;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-to-do");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-to-do");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-to-do");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  todoList.appendChild(todo);
};

const getSearchedTodos = (search, filterValue = "all") => {
  let todos;

  switch (filterValue) {
    case "all":
      todos = document.querySelectorAll(".to-do-task");;
      break;

    case "done":
      todos = document.querySelectorAll(".to-do-task.done");
      break;

    case "to do":
      todos = document.querySelectorAll(".to-do-task:not(.done)");
      break;

    default:
      break;
  }

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("tasks-list")) || [];

  return todos;
};

const loadTodos = () => {
  todoInput.value = "";
  filterBtn.value = "all";
  searchInput.value = "";
  todoList.innerHTML = "";

  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    generateHTMLForTodo(todo.task, todo.done);
  });
};

const removeTodoLocalStorage = (task) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.task != task);

  localStorage.setItem("tasks-list", JSON.stringify(filteredTodos));
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("tasks-list", JSON.stringify(todos));
};

const toggleForms = () => {
  todoForm.classList.toggle("hide");
  editForm.classList.toggle("hide");  
  todoList.classList.toggle("hide");
};

const updateTodo = (task) => {
  const todos = document.querySelectorAll(".to-do-task");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = task;

      updateTodoLocalStorage(oldInputValue, task);
    }
  });
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.task === todoOldText ? (todo.task = todoNewText) : null
  );

  localStorage.setItem("tasks-list", JSON.stringify(todos));
};

const updateTodoStatusLocalStorage = (task) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.task === task ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("tasks-list", JSON.stringify(todos));
};


// Events
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-to-do")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-to-do")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }

  if (targetEl.classList.contains("remove-to-do")) {
    parentEl.remove();

    removeTodoLocalStorage(todoTitle);
  }
  
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

// eraseBtn.addEventListener("click", (e) => {
//   e.preventDefault();

//   searchInput.value = "";

//   searchInput.dispatchEvent(new Event("keyup"));
// });

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
  searchInput.value = "";
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  const filterValue = filterBtn.value;

  getSearchedTodos(search, filterValue);  
});

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodoLocalStorage({ task: inputValue, done: 0 });
  }

  loadTodos();
});


loadTodos();
