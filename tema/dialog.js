// Selectăm elementul cu ID-ul "showDialog", care este butonul pentru deschiderea dialogului
const showDialog = document.getElementById("showDialog");

// Selectăm elementul cu ID-ul "favDialog", care reprezintă fereastra de dialog
const favDialog = document.getElementById("favDialog");

// Selectăm butonul de confirmare din fereastra de dialog
const confirmBtn = favDialog.querySelector("#confirmBtn");

// Selectăm butonul de cancel din fereastra de dialog
const cancelBtn = favDialog.querySelector('button[value="cancel"]');

// Selectăm elementul <output> în care vom afișa rezultatele
const outputBox = document.querySelector("output");

// Adăugăm un ascultător de evenimente pentru butonul "showDialog"
showDialog.addEventListener("click", () => {
  // Afișăm fereastra de dialog când butonul este apăsat
  favDialog.showModal();
});

// Adăugăm un ascultător de evenimente pentru butonul de confirmare din fereastra de dialog
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

  // Construim șirul cu valorile într-un format specific
  const outputText = `
Title: ${titleInput}
Description: ${descriptionInput}
Assignee: ${assigneeInput}`;

  // Atribuim șirul construit elementului <output>
  outputBox.value = outputText;

  // Verificăm dacă toate câmpurile sunt completate
  if (titleInput && descriptionInput && assigneeInput) {
    // Setăm valoarea de returnare a fereastrei de dialog la "success"
    favDialog.returnValue = "success";
  } else {
    // Dacă nu toate câmpurile sunt completate, setăm valoarea de returnare la "error"
    favDialog.returnValue = "error";
  }

  // Închidem fereastra de dialog
  favDialog.close();
});

// Adăugăm un ascultător de evenimente pentru butonul de cancel din fereastra de dialog
cancelBtn.addEventListener("click", () => {
  // Setăm valoarea de returnare a fereastrei de dialog la "cancel"
  favDialog.returnValue = "cancel";

  // Închidem fereastra de dialog
  favDialog.close();
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
    // Dacă valoarea de returnare este "cancel", nu trebuie să afișăm nimic, dar putem face o acțiune opțională dacă dorim
    // În cazul acesta, nu facem nimic suplimentar, doar închidem fereastra de dialog
  }
});
