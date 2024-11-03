const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskView = document.getElementById("taskView");

let tasks = [];

function addTask(event) {
    event.preventDefault();
    if (taskForm.checkValidity()) {
        console.log("Форма валидна!");
        const name = document.getElementById("taskName").value;
        const priority = document.getElementById("taskPriority").value;
        const deadline =document.getElementById("taskDeadline").value;
        const hashtag = document.getElementById("taskHashtag").value;
        const comment = document.getElementById("taskComment").value;
    
        const newTask = {
            name,
            priority,
            deadline,
            hashtag,
            comment,
            completed: false,
            id: Date.now()
        };
    
        tasks.push(newTask);
    
        taskForm.reset();
    
        renderTaskList();
    } else {
        console.log("Форма не валидна!");
        taskForm.querySelectorAll(":invalid").forEach(function(field) {
            console.log(`Поле ${field.id} невалидно: ${field.validationMessage}`);
        });
    }
}

function renderTaskList() {
    taskList.innerHTML = ''; 

    const filteredTasks = filterTasks(tasks);
    let today = new Date();

    filteredTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');

        const deadlineDate = new Date(task.deadline);
        const detailsId = `details-${task.id}`;
        let typeOfTask='';
        let taskContent='';
        if(task.completed===true){
            typeOfTask='completed';
        }
        else if (deadlineDate<new Date(today.getFullYear(), today.getMonth(), today.getDate())){
            typeOfTask='deadline';
        }
        else{
            typeOfTask='normal';           
        }
        taskContent = `
        ${typeOfTask==='normal'?'<div style="padding: 10px">': ''}
            <div class="${typeOfTask==='completed'? 'complited-task-block' : ''} ${typeOfTask==='deadline'? 'deadline-task-block' : ''} d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1" title="${task.name}">
                        ${task.name.length > 20 ? task.name.substring(0, 20) + '...' : task.name}
                    </h6>
                        <small class="text-muted">Приоритет: ${task.priority}, Дата окончания: ${task.deadline}, Статус: ${task.completed==true?'Закончен': 'В процессе'}</small>
                </div>
                <div class="col-md-2 d-flex justify-content-end"">
                    ${typeOfTask==='completed'? '':  `<button class="btn btn-sm btn-success me-2" data-task-id=${task.id} onclick="markTaskComplete(this)">Завершить</button>`}
                    <button class="btn btn-sm btn-danger me-2" data-task-id="${task.id}" onclick="deleteTask(this)">Удалить</button>
                    <button class="btn btn-sm btn-info" onclick="toggleDetails('${detailsId}')">Раскрыть</button>
                </div>
            </div>
        ${typeOfTask==='normal'?'</div>': ''} 
        <div id="${detailsId}" class="task-details" style="display: none; padding: 10px;">
            <h3 class="mb-3">Описание задачи</h3>
            <div class="mb-3">
                <label for="taskName-${task.id}" class="form-label">Название:</label>
                <input type="text" id="taskName-${task.id}" class="form-control" value="${task.name}" disabled>
            </div>
            <div class="mb-3">
                <label for="taskPriority-${task.id}" class="form-label">Приоритет:</label>
                <input type="text" id="taskPriority-${task.id}" class="form-control" value="${task.priority}" disabled>
            </div>
            <div class="mb-3">
                <label for="taskDeadline-${task.id}" class="form-label">Срок выполнения:</label>
                <input type="date" id="taskDeadline-${task.id}" class="form-control" value="${task.deadline}" disabled>
            </div>
            <div class="mb-3">
                <label for="taskHashtag-${task.id}" class="form-label">Хэштег:</label>
                <input type="text" id="taskHashtag-${task.id}" class="form-control" value="${task.hashtag}" disabled>
            </div>
            <div class="mb-3">
                <label for="taskComment-${task.id}" class="form-label">Комментарий:</label>
                <textarea id="taskComment-${task.id}" class="form-control" rows="3" disabled>${task.comment}</textarea>
            </div>
            ${typeOfTask==='completed'?'': `<button class="btn btn-info me-2" id="editButton-${task.id}" onclick="editTask(${task.id})">Изменить</button>`} 
            <button class="btn btn-success" id="saveButton-${task.id}" style="display: none;" onclick="saveTask('${task.id}')">Сохранить</button>
        </div>
        `; 
        listItem.innerHTML = taskContent;
        taskList.appendChild(listItem);
    });
}

function filterTasks(allTasks) {
    const view = taskView.value;

    if (view === 'all') {
        return allTasks;
    }
    const today = new Date();
    let todayStart=new Date();
    let todayEnd=new Date();

    if(view==='today'){
        todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    }
    else if(view==='week'){
        todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
        todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8);
    }
    else if(view==='month'){
        todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
        todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 31);
    }
    else if(view==='year'){
        todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
        todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 366);
    }

    return allTasks.filter(task => {
        const deadlineDate = new Date(task.deadline);
        return deadlineDate >= todayStart && deadlineDate < todayEnd;
    });
}

function markTaskComplete(button) {
    const taskId = parseInt(button.dataset.taskId);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = true;
        renderTaskList();
    }
}

function deleteTask(button) {
    const taskId = parseInt(button.dataset.taskId);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        renderTaskList();
    }
}

function toggleDetails(detailsId) {
    const detailsElement = document.getElementById(detailsId);
    if (detailsElement.style.display === "none") {
        detailsElement.style.display = "block";
    } else {
        detailsElement.style.display = "none";
    }
}

function editTask(taskId) {
    const fields = ['Name', 'Priority', 'Deadline', 'Hashtag', 'Comment'];
    fields.forEach(field => {
        document.getElementById(`task${field}-${taskId}`).disabled = false;
    });
    document.getElementById(`editButton-${taskId}`).style.display = 'none';
    document.getElementById(`saveButton-${taskId}`).style.display = 'inline-block';
}

function saveTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(taskId));
    
    if (taskIndex !== -1) {
        tasks[taskIndex].name = document.getElementById(`taskName-${taskId}`).value;
        tasks[taskIndex].priority = document.getElementById(`taskPriority-${taskId}`).value;
        tasks[taskIndex].deadline = document.getElementById(`taskDeadline-${taskId}`).value;
        tasks[taskIndex].hashtag = document.getElementById(`taskHashtag-${taskId}`).value;
        tasks[taskIndex].comment = document.getElementById(`taskComment-${taskId}`).value;

        renderTaskList();
    }
}

taskForm.addEventListener('submit', addTask);
taskView.addEventListener('change', renderTaskList);
renderTaskList();