// Get HTML elements
let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let todoList = document.getElementById("todoList");
let clearBtn = document.getElementById("clearBtn");

let totalTasks = document.getElementById("totalTasks");
let completedTasks = document.getElementById("completedTasks");

let filterButtons = document.querySelectorAll(".filter");

// Store tasks
let tasks = [];

// Add a new task
function addTask() {

    let taskText = taskInput.value.trim();

    // Check if input is empty
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    // Create task object
    let task = {
        text: taskText,
        completed: false
    };

    // Add task to array
    tasks.push(task);

    // Clear input
    taskInput.value = "";

    // Display tasks
    displayTasks();
}


// Display tasks
function displayTasks(filter = "all") {

    // Clear current list
    todoList.innerHTML = "";

    // Filter tasks
    let filteredTasks = tasks.filter(function(task) {

        if (filter === "active") {
            return !task.completed;
        }

        if (filter === "completed") {
            return task.completed;
        }

        return true;
    });


    // Show message if there are no tasks
    if (filteredTasks.length === 0) {

        let message = document.createElement("p");

        message.className = "empty-message";

        message.textContent = "No tasks to show.";

        todoList.appendChild(message);

    }


    // Loop through tasks
    filteredTasks.forEach(function(task, index) {

        let li = document.createElement("li");

        li.className = "todo-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        // Checkbox
        let checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;


        // Task text
        let span = document.createElement("span");

        span.className = "task-text";

        span.textContent = task.text;


        // Delete button
        let deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";


        // Complete task
        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            displayTasks(filter);

        });


        // Delete task
        deleteButton.addEventListener("click", function() {

            let taskIndex = tasks.indexOf(task);

            tasks.splice(taskIndex, 1);

            displayTasks(filter);

        });


        // Add elements to task
        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(deleteButton);

        todoList.appendChild(li);

    });


    // Update statistics
    updateStats();
}


// Update task statistics
function updateStats() {

    totalTasks.textContent = tasks.length;

    let completed = tasks.filter(function(task) {
        return task.completed;
    });

    completedTasks.textContent = completed.length;
}


// Clear all tasks
function clearAllTasks() {

    if (tasks.length === 0) {
        alert("There are no tasks to clear.");
        return;
    }

    let confirmClear = confirm("Are you sure you want to clear all tasks?");

    if (confirmClear) {

        tasks = [];

        displayTasks();

    }
}


// Add task when button is clicked
addBtn.addEventListener("click", addTask);


// Add task when Enter is pressed
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Filter tasks
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        // Add active class to clicked button
        button.classList.add("active");

        // Get selected filter
        let filter = button.dataset.filter;

        // Display filtered tasks
        displayTasks(filter);

    });

});


// Clear all button
clearBtn.addEventListener("click", clearAllTasks);


// Display tasks when page loads
displayTasks();