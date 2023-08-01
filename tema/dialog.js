// Selectăm elementul cu ID-ul "showDialog", care este butonul pentru deschiderea dialogului
const showDialog = document.getElementById("showDialog");

// Selectăm elementul cu ID-ul "favDialog", care reprezintă fereastra de dialog
const favDialog = document.getElementById("favDialog");

// Selectăm butonul de confirmare din fereastra de dialog
const confirmBtn = favDialog.querySelector("#confirmBtn");

// Selectăm butonul de cancel din fereastra de dialog
const cancelBtn = favDialog.querySelector('button[value="cancel"]');

// Selectăm elementul cu ID-ul "completedTasks", care va fi utilizat pentru a afișa taskurile finalizate
const completedTasksOutput = document.getElementById("completedTasks");

// Selectăm elementul cu ID-ul "incompleteTasks", care va fi utilizat pentru a afișa taskurile nefinalizate
const incompleteTasksOutput = document.getElementById("incompleteTasks");

// Array pentru a stoca taskurile
let tasks = getTasksFromLocalStorage();

let currentEditIndex = -1; // Inițializăm cu o valoare invalidă

// Adăugăm un ascultător de evenimente pentru butonul "showDialog"
showDialog.addEventListener("click", () => {
  // Afișăm fereastra de dialog când butonul este apăsat
  favDialog.showModal();

  // Setăm indexul de editare la -1 pentru a indica că dorim să adăugăm un task nou
  currentEditIndex = -1;
});

// Funcție pentru a salva taskurile în LocalStorage
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Funcție pentru a obține taskurile din LocalStorage
function getTasksFromLocalStorage() {
  // Obținem valoarea stocată în LocalStorage cu cheia "tasks"
  const tasks = localStorage.getItem("tasks");

  // Verificăm dacă valoarea "tasks" din LocalStorage există și nu este gol
  // Dacă există, folosim JSON.parse pentru a converti valoarea într-un obiect sau array
  // Dacă nu există, sau este gol, returnăm un array gol
  return tasks ? JSON.parse(tasks) : [];
}

function deleteTask(index) {
  // Eliminam taskul din lista de taskuri
  tasks.splice(index, 1);

  // Actualizam afișarea taskurilor în elementul <output>
  displayTasks();

  // Salvăm taskurile actualizate în LocalStorage
  saveTasksToLocalStorage(tasks);
}

function markAsCompleted(index) {
  // Setăm o proprietate "completed" pe task-ul corespunzător pentru a indica că este finalizat
  tasks[index].completed = true;

  // Actualizam afișarea taskurilor în elementul <output>
  displayTasks();

  // Salvăm taskurile actualizate în LocalStorage
  saveTasksToLocalStorage(tasks);
}

// Funcție pentru a afișa taskurile în elementul <output>
function displayTasks() {
  // Golim conținutul din secțiunile pentru taskurile complete și incomplete
  completedTasksOutput.innerHTML = "";
  incompleteTasksOutput.innerHTML = "";

  // Iteram prin fiecare task și cream elemente HTML pentru a le afișa
  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.innerHTML = `
    <section class="task-section">
      <p>Task ${index + 1}:</p>
      <p><strong>Title:</strong> ${task.title}</p>
      <p><strong>Description:</strong> ${task.description}</p>
      <p><strong>Assignee:</strong> ${task.assignee}</p>
      <button onclick="markAsCompleted(${index})">Completed</button>
      <button onclick="openEditDialog(${index})">Edit</button>
      <img src="deleteButton.png" alt="Delete" class="delete-button" onclick="deleteTask(${index})">
    </section>
    `;

    // Adăugam elementul cu datele taskului în secțiunea corespunzătoare
    if (task.completed) {
      completedTasksOutput.appendChild(taskDiv);
      taskDiv.classList.add("completed");
    } else {
      incompleteTasksOutput.appendChild(taskDiv);
      taskDiv.classList.add("not-completed");
    }
  });
}

function openEditDialog(index) {
  // Obținem taskul de la indexul specificat din lista de taskuri
  const task = tasks[index];

  // Selectăm input-ul pentru titlu din fereastra de dialog
  const titleInput = favDialog.querySelector('input[placeholder="title"]');

  // Selectăm textarea pentru descriere din fereastra de dialog
  const descriptionInput = favDialog.querySelector(
    'textarea[placeholder="description"]'
  );

  // Selectăm input-ul pentru persoana responsabilă cu sarcina din fereastra de dialog
  const assigneeInput = favDialog.querySelector(
    'input[placeholder="assignee"]'
  );

  // Setăm valorile din fereastra de dialog cu valorile corespunzătoare ale taskului
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  assigneeInput.value = task.assignee;

  // Salvăm indexul taskului într-o variabilă globală pentru a ști ce task dorim să edităm
  currentEditIndex = index;

  // Adăugăm indexul taskului în atributul "data-edit-index" al ferestrei de dialog
  // Acest atribut poate fi folosit pentru a identifica taskul pe care dorim să îl edităm în momentul apăsării butonului de confirmare
  favDialog.dataset.editIndex = index;

  // Afișăm fereastra de dialog pentru editare
  favDialog.showModal();
}

confirmBtn.addEventListener("click", (event) => {
  // Împiedicăm acțiunea implicită a butonului (prevenim trimiterea formularului)
  event.preventDefault();

  // Obținem valorile introduse în câmpurile de titlu, descriere și persoana responsabilă cu sarcina
  const titleInput =
    favDialog.querySelector('input[placeholder="title"]')?.value ?? "";
  const descriptionInput =
    favDialog.querySelector('textarea[placeholder="description"]')?.value ?? "";
  const assigneeInput =
    favDialog.querySelector('input[placeholder="assignee"]')?.value ?? "";

  // Verificăm dacă toate câmpurile sunt completate
  if (titleInput && descriptionInput && assigneeInput) {
    if (currentEditIndex !== -1) {
      // Editarea unui task existent
      tasks[currentEditIndex].title = titleInput;
      tasks[currentEditIndex].description = descriptionInput;
      tasks[currentEditIndex].assignee = assigneeInput;
    } else {
      // Crearea unui nou task
      const newTask = {
        title: titleInput,
        description: descriptionInput,
        assignee: assigneeInput,
        completed: false, // Adăugăm o proprietate "completed" pentru a marca dacă taskul este completat sau nu
      };

      tasks.push(newTask);
    }

    // Salvăm taskurile în LocalStorage
    saveTasksToLocalStorage(tasks);

    // Afișăm taskurile actualizate în elementul <output>
    displayTasks();

    // Setăm valoarea de returnare a ferestrei de dialog la "success"
    favDialog.returnValue = "success";
    favDialog.close();
  } else {
    favDialog.returnValue = "error";
    favDialog.close();
  }
});

// Adăugăm un ascultător de evenimente pentru evenimentul "close" al fereastrei de dialog
favDialog.addEventListener("close", (event) => {
  // Verificăm valoarea de returnare a fereastrei de dialog
  if (favDialog.returnValue === null) {
    // Dacă valoarea de returnare este null, afișăm un mesaj corespunzător în elementul <output>
    outputBox.value = "No return value.";
  } else if (favDialog.returnValue === "success") {
    // Dacă valoarea de returnare este "success", afișăm valorile introduse în elementul <output>
    const titleInput =
      favDialog.querySelector('input[placeholder="title"]')?.value ?? "";
    const descriptionInput =
      favDialog.querySelector('textarea[placeholder="description"]')?.value ??
      "";
    const assigneeInput =
      favDialog.querySelector('input[placeholder="assignee"]')?.value ?? "";

    const outputText = `
Title: ${titleInput}
Description: ${descriptionInput}
Assignee: ${assigneeInput}`;

    outputBox.value = outputText;
  } else if (favDialog.returnValue === "error") {
    // Dacă valoarea de returnare este "error", afișăm un mesaj corespunzător în elementul <output>
    outputBox.value = "Error: Please fill in all the fields.";
  } else if (favDialog.returnValue === "cancel") {
  }
  // Afișăm taskurile salvate în LocalStorage la încărcarea paginii
  displayTasks();
});
// Adăugăm un ascultător de evenimente pentru butonul de cancel din fereastra de dialog
cancelBtn.addEventListener("click", () => {
  // Setăm valoarea de returnare a fereastrei de dialog la "cancel"
  favDialog.returnValue = "cancel";

  // Închidem fereastra de dialog
  favDialog.close();
});

// Afișăm taskurile salvate în LocalStorage la încărcarea paginii
displayTasks();
