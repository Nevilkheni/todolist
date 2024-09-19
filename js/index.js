const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const deleteAllButton = document.getElementById('delete-all');

let isEditing = false;
let taskBeingEdited = null;

document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

addTaskButton.addEventListener('click', () => {
    if (isEditing) {
        updateTask();
    } else {
        addTask();
    }
});

deleteAllButton.addEventListener('click', deleteAllTasks);

function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText === '') return;

    const taskItem = createTaskElement(taskText);
    taskList.appendChild(taskItem);

    saveTaskToLocalStorage(taskText);
    newTaskInput.value = '';
}

function createTaskElement(taskText, isChecked = false) {
    const li = document.createElement('li');
    if (isChecked) li.classList.add('checked');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(li, taskText));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(li, taskText));

    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');
    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

  
    taskActions.style.display = isChecked ? 'none' : 'flex';

    checkbox.addEventListener('click', () => {
        li.classList.toggle('checked');
        taskActions.style.display = checkbox.checked ? 'none' : 'flex'; // Hide buttons if checked
        updateTaskStatusInLocalStorage(taskText, checkbox.checked);
    });

    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(taskActions);

    return li;
}


function editTask(taskItem, oldTaskText) {
    newTaskInput.value = oldTaskText;
    isEditing = true;
    taskBeingEdited = { taskItem, oldTaskText };
    addTaskButton.textContent = 'Edit now'; 
}

function updateTask() {
    const newTaskText = newTaskInput.value.trim();
    if (newTaskText === '' || !taskBeingEdited) return;

    const { taskItem, oldTaskText } = taskBeingEdited;
    taskItem.querySelector('span').textContent = newTaskText;

    updateTaskInLocalStorage(oldTaskText, newTaskText);

    isEditing = false;
    taskBeingEdited = null;
    addTaskButton.textContent = 'Add Task'; 
    newTaskInput.value = '';
}

function deleteTask(taskItem, taskText) {
    taskItem.remove();
    deleteTaskFromLocalStorage(taskText);
}

function deleteAllTasks() {
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(({ text, isChecked }) => {
        const taskItem = createTaskElement(text, isChecked);
        taskList.appendChild(taskItem);
    });
}

function saveTaskToLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, isChecked: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function updateTaskInLocalStorage(oldTaskText, newTaskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.text === oldTaskText);
    if (taskIndex > -1) {
        tasks[taskIndex].text = newTaskText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function updateTaskStatusInLocalStorage(taskText, isChecked) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.text === taskText);
    if (taskIndex > -1) {
        tasks[taskIndex].isChecked = isChecked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}