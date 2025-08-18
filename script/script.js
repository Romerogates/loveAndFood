const itemInput = document.getElementById('itemInput');
const dateInput = document.getElementById('dateInput');
const shoppingList = document.getElementById('shoppingList');

let items = JSON.parse(localStorage.getItem('shoppingList')) || [];

// Définir la date par défaut à aujourd'hui
const today = new Date().toISOString().split('T')[0];
if (!dateInput.value) dateInput.value = today;

// Sauvegarde et rend la liste
function saveAndRender() {
    localStorage.setItem('shoppingList', JSON.stringify(items));
    renderList();
}

// Affiche uniquement les éléments correspondant à la date sélectionnée
function renderList() {
    shoppingList.innerHTML = '';
    const selectedDate = dateInput.value || today;

    const filteredItems = items
        .filter(item => item.date === selectedDate);

    filteredItems.forEach((item) => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkboxItem';
        checkbox.checked = item.checked;
        checkbox.addEventListener('change', () => {
            item.checked = checkbox.checked;
            saveAndRender();
        });

        const span = document.createElement('span');
        span.textContent = item.text;
        span.addEventListener('click', () => {
            item.checked = !item.checked;
            saveAndRender();
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.className = 'removeBtn';
        if (item.checked) {
            removeBtn.classList.add('locked');
            removeBtn.disabled = true;
        } else {
            removeBtn.addEventListener('click', () => {
                const index = items.indexOf(item);
                items.splice(index, 1);
                saveAndRender();
            });
        }

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(removeBtn);
        shoppingList.appendChild(li);
    });
}

// Ajouter un nouvel élément
function addItem() {
    const text = itemInput.value.trim();
    const date = dateInput.value || today;
    if (!text) return;

    items.push({ text, date, checked: false });
    itemInput.value = '';
    saveAndRender();
}

// Supprimer tous les éléments **uniquement pour la date sélectionnée**
function clearByDate() {
    const selectedDate = dateInput.value || today;
    if (confirm(`Supprimer tous les éléments du ${selectedDate} ?`)) {
        items = items.filter(item => item.date !== selectedDate);
        saveAndRender();
    }
}

// Supprimer tous les éléments de toutes les dates
function clearAll() {
    if (confirm('Tout supprimer ?')) {
        items = [];
        saveAndRender();
    }
}

// Mettre à jour la liste quand la date change
dateInput.addEventListener('change', renderList);

// Initial render
renderList();
