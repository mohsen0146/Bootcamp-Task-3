// let todos = [];
let filterValue = "all";
let todoToEditId;



//? Selecting
const todoInput = document.querySelector(".todo__input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todoList");
const selectFilters = document.querySelector(".filter-todos");
const modalText = document.querySelector(".modal__text");
const modal = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const modalInput = document.querySelector(".modal__input")
const closeModalBtn = [...document.querySelectorAll(".close-modal")];
const confirmBtn = document.querySelector(".confirm-btn");
const modalForm = document.querySelector(".modal-form");



//? events
todoForm.addEventListener("submit", addNewTodo);
selectFilters.addEventListener("change", (e)=>{
    filterValue = e.target.value;
    filterTodos();
} )
document.addEventListener("DOMContentLoaded", (e)=>{
    const todos = getAllTodos();
    creatTodos(todos);
})

confirmBtn.addEventListener("click",updateTodo);
modalForm.addEventListener("submit",updateTodo);
closeModalBtn.forEach((btn) => btn.addEventListener("click", closeModal));
modal.addEventListener("click", (e) => e.stopPropagation())
backdrop.addEventListener("click",closeModal)


// ? functions
function addNewTodo(e){
    e.preventDefault();

    if(!todoInput.value) return null;

    const newTodo = {
        id : Date.now(),
        createdAt : new Date().toISOString(),
        title : todoInput.value,
        isCompleted : false,
    }; 
    // todos.push(newTodo);
    saveTodo(newTodo);

    filterTodos();
    
}

function creatTodos (todos){
    let result = ""; 
    todos.forEach(todo => {
        result += `<li class="todo">
        <p class="todo__title ${todo.isCompleted && "completed"}" data-todo-id="${todo.id}">${todo.title}</p>
        <div class="todolist__details">
        <span class="todo__createdAt">${new Date(todo.createdAt).toLocaleDateString("fa-IR")}</span>
         <div class="buttons">
        <button class="todo__check" data-todo-id="${todo.id}">
         <i class="far fa-check-square"></i>
        </button>
        <button class="todo__edit" data-todo-id="${todo.id}">
        <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="todo__remove" data-todo-id="${todo.id}">
        <i class="far fa-trash-alt"></i>
        </button>
         </div>
        </div>
      </li>`;

    });

    todoList.innerHTML = result;
    todoInput.value = "";

    const removeBtns = [...document.querySelectorAll(".todo__remove")];
    removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));
    const checkBtns = [...document.querySelectorAll(".todo__check")];
    checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));
    const editBtns = [...document.querySelectorAll(".todo__edit")];
    editBtns.forEach((btn) => btn.addEventListener("click", showModal) );
    const todoTitle = [...document.querySelectorAll(".todo__title")];
    todoTitle.forEach((btn) => btn.addEventListener("click", showModal) );
 
}

function filterTodos(e){
    const todos = getAllTodos();
    switch(filterValue){
        case "all":{
            creatTodos(todos);
            break;
        }
        case "completed":{
            const filteredTodos = todos.filter(t => t.isCompleted)
            creatTodos(filteredTodos);
            break;
        }
        case "uncompleted":{
            const filteredTodos = todos.filter(t => !t.isCompleted)
            creatTodos(filteredTodos);
            break;

        }
        default:{
            creatTodos(todos);

        }


    }
}

function removeTodo(e){
    let todos = getAllTodos();
    const todoId = Number(e.target.dataset.todoId);
    todos = todos.filter(t => t.id !== todoId);
    saveAllTodos(todos);
    filterTodos();
}

function checkTodo(e){
    let todos = getAllTodos();
    const todoId = Number(e.target.dataset.todoId);
    const todo = todos.find(t => t.id === todoId);
    todo.isCompleted = !todo.isCompleted;
    saveAllTodos(todos);
    filterTodos();
}


// *Local Storage

function getAllTodos(){
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    return savedTodos;
}

function saveTodo (todo){
    // const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    const savedTodos = getAllTodos();
    savedTodos.push(todo);
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    return savedTodos;
}

function saveAllTodos (todos){
    localStorage.setItem("todos", JSON.stringify(todos));
}



// ?modal


function showModal(e){
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
    todoToEditId = Number(e.target.dataset.todoId)
    const savedTodos = getAllTodos();
    const todoToEdit = savedTodos.find(todo => todo.id == todoToEditId)
    modalInput.value = todoToEdit.title;
      
}

function updateTodo(){
    const todos = getAllTodos();
    todos.forEach((todo) => {
        if (todo.id == todoToEditId) todo.title = modalInput.value.trim();
    
    })
    saveAllTodos(todos)
    filterTodos();
}

function closeModal(){
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
    modalInput.value = "";
}







