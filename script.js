/**
 * Custom datepicker built with vanilla JS.
 * Initialised using CDN links in HTML.
 * https://mymth.github.io/vanillajs-datepicker/#/
 */

const input = document.querySelector('#input-date');
const modalInput = document.querySelector('#modal__input-date');
const datepicker = new Datepicker(input, {
    autohide: true,
    format: 'dd/mm/yy',
});
const modalDatepicker = new Datepicker(modalInput, {
    autohide: true,
    format: 'dd/mm/yy',
});

/**
 * <----- BASIC FUNCTIONALITY ----->
 *
 * 01. Initialise all expenses after retreieving them from local storage.
 * 02. Add a new expense.
 * 03. Render an expense element.
 * 04. Edit an expense.
 * 05. Delete all expense elements.
 * 06. Toggle empty state.
 * 07. Update the total amount.
 */

let DATABASE = [];
let localStorageExpensesKey = 'rag.expenses';

document.addEventListener('DOMContentLoaded', () => {
    initialiseExpenses();
    showDateTime();
    showTemperature();
});

/**
 * 01. Initialise all expenses after retreieving them from local storage.
 *
 * - Renders each expense.
 * - Calculates the total amount.
 * - Checks for empty state.
 */

const amountTotalElement = document.querySelector('.amount-total');
const entriesElement = document.querySelector('.entries');

const initialiseExpenses = () => {
    const items = getLocalStorage(localStorageExpensesKey);
    items.forEach((item) => {
        DATABASE.push(item);
        renderExpenseElement(item);
    });
    if (DATABASE.length >= 1) disableEmptyState();
    updateAmount();
};

/**
 * 02. Add a new expense.
 *
 * - Renders a new expense element for the expense.
 * - Updates local storage after adding the expense.
 * - Updates the total amount.
 * - Different versions for regular vs modal. (Need to fix)
 */

const inputDate = document.querySelector('#input-date');
const inputAmount = document.querySelector('#input-amount');
const inputItem = document.querySelector('#input-item');
const modalInputDate = document.querySelector('#modal__input-date');
const modalInputAmount = document.querySelector('#modal__input-amount');
const modalInputItem = document.querySelector('#modal__input-item');

const addExpense = () => {
    if (!inputDate.value || !inputAmount.value || !inputItem.value) return;

    const id = new Date().getTime().toString();
    const date = inputDate.value;
    const amount = inputAmount.value;
    const item = inputItem.value;

    const element = {
        id: id,
        date: date,
        amount: amount,
        item: item,
    };

    DATABASE.push(element);
    updateAmount(amount);
    updateLocalStorage(localStorageExpensesKey, DATABASE);
    renderExpenseElement(element);
    reset();
};

const modalAddExpense = () => {
    if (
        !modalInputDate.value ||
        !modalInputAmount.value ||
        !modalInputItem.value
    )
        return;

    const id = new Date().getTime().toString();
    const date = modalInputDate.value;
    const amount = modalInputAmount.value;
    const item = modalInputItem.value;

    const element = {
        id: id,
        date: date,
        amount: amount,
        item: item,
    };

    DATABASE.push(element);
    updateAmount(amount);
    updateLocalStorage(localStorageExpensesKey, DATABASE);
    renderExpenseElement(element);
    reset();
    modal.close();
};

/**
 * 03. Render an expense element.
 *
 * - Creates a new `div` with a class of `expense` and a unique `data-id`.
 * - Adds the necessary HTMl within the element.
 * - Adds it to the DOM right before the `btn-delete-all` button.
 */

const btnDeleteAll = document.querySelector('.btn-delete-all');

const renderExpenseElement = (e) => {
    disableEmptyState();

    const element = document.createElement('div');
    element.classList.add('expense');
    element.dataset.id = e.id;
    const html = `<p class="expense__date">${e.date}</p>
        <p class="expense__item">${e.item}</p>
        <p class="expense__amount">${e.amount}</p>`;
    element.innerHTML = html;

    if (btnDeleteAll) {
        btnDeleteAll.insertAdjacentElement('beforebegin', element);
    }
};

/**
 * 04. Edit an expense.
 *
 * - Gets the current data and updates the input fields.
 * - Checks which entry is being edited by evaluating the data-id.
 * - Updates the local storage once edited.
 * - Resets the id back to not mess up the next element which will be edited.
 *
 * 04b. Modal Functionalities
 * - Shows/hides btnModalAdd and btnEdit depending upon the current state.
 */

const modal = document.querySelector('.expense-modal');
const btnCancel = document.querySelector('.btn-cancel');
const btnSave = document.querySelector('#btn-save');
const btnNewExpense = document.querySelector('.btn-new-expense');
const btnModalAdd = document.querySelector('#btn-modal-add');
const btnEdit = document.querySelector('#btn-edit');

btnCancel.addEventListener('click', () => {
    modal.close();
});
btnSave.addEventListener('click', () => {
    addExpense();
});
btnNewExpense.addEventListener('click', () => {
    btnEdit.style.display = 'none';
    btnModalAdd.style.display = 'block';
    reset();
    const modalTitle = modal.querySelector('.new-expense__title');
    modalTitle.textContent = 'New Expense';
    modal.showModal();
    btnModalAdd.addEventListener('click', () => {
        modalAddExpense();
    });
});

document.addEventListener('click', (e) => {
    const element = e.target.closest('.expense');
    if (element) editExpense(element);
});

const editExpense = (element) => {
    modal.showModal();
    btnModalAdd.style.display = 'none';
    btnEdit.style.display = 'block';

    let id = element.dataset.id;
    const elementDate = element.querySelector('.expense__date');
    const elementAmount = element.querySelector('.expense__amount');
    const elementItem = element.querySelector('.expense__item');

    modalInputDate.value = elementDate.textContent;
    modalInputAmount.value = elementAmount.textContent;
    modalInputItem.value = elementItem.textContent;

    btnEdit.addEventListener('click', () => {
        DATABASE.map((entry) => {
            if (entry.id == id) {
                entry.date = modalInputDate.value;
                entry.amount = modalInputAmount.value;
                entry.item = modalInputItem.value;

                elementDate.textContent = modalInputDate.value;
                elementAmount.textContent = modalInputAmount.value;
                elementItem.textContent = modalInputItem.value;
            }
            return entry;
        });
        updateLocalStorage(localStorageExpensesKey, DATABASE);
        updateAmount();
        id = '';
        modal.close();
    });
};

/**
 * 05. Delete all expense elements.
 *
 * - Removes all expenses from local storage.
 * - Removes all expense elements.
 * - Renders empty state.
 */

btnDeleteAll.addEventListener('click', () => {
    deleteAll();
});

const deleteAll = () => {
    DATABASE = DATABASE.filter((e) => !e);
    updateLocalStorage(localStorageExpensesKey, DATABASE);
    renderEmptyState();
    const elements = document.querySelectorAll('.expense');
    elements.forEach((element) => element.remove());
    updateAmount();
};

/**
 * 06. Toggle empty state.
 */

const expensesContainer = document.querySelector('.expenses');

const renderEmptyState = () => {
    expensesContainer.classList.remove('expenses-visible');
};

const disableEmptyState = () => {
    if (!expensesContainer.classList.contains('expenses-visible')) {
        expensesContainer.classList.add('expenses-visible');
    }
};

/**
 * 07. Update the total amount.
 *
 * - Gets the data from DATABASE.
 * - Updates the total amount and the number of current entries.
 */

const updateAmount = () => {
    let amount = 0;
    DATABASE.map((e) => (amount += parseInt(e.amount)));
    amountTotalElement.textContent = amount.toLocaleString();
    entriesElement.textContent =
        DATABASE.length == 1
            ? `${DATABASE.length} Entry`
            : `${DATABASE.length} Entries`;
};

/**
 * <----- Local Storage ----->
 *
 * 01. Gets the local storage.
 * - Returns an empty array if no values are found for the associated key.
 *
 * 02. Updates the local storage with the supplied value.
 */

// 01
const getLocalStorage = (key) => {
    return localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : [];
};

// 02
const updateLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

/**
 * <----- Secondary Functionality ----->
 *
 * 01. Show date and time.
 * - Checks date & time every second.
 * 02. Show temperature.
 * - Uses geolocation API to get location.
 * - Uses OpenWeatherMap API to get temperature. (https://openweathermap.org/current)
 * - User must enable location to display temperature.
 */

// 01
const dateElement = document.querySelector('.date');
const timeElement = document.querySelector('.time');

const showDateTime = () => {
    const newDate = new Date();

    const dateOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    };

    const date = newDate.toLocaleDateString(undefined, dateOptions);
    dateElement.textContent = date;

    const timeOptions = {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
    };

    const time = newDate.toLocaleTimeString(undefined, timeOptions);
    timeElement.textContent = time;
};

setInterval(() => {
    showDateTime();
}, 1000);

// 02
const temperatureElement = document.querySelector('.temperature');
const dividerElement = document.querySelector('.divider');
let tempCelsius;
let tempFahrenheit;

const showTemperature = () => {
    const temperatureOptions = {
        timeout: 15000,
        maximumAge: 60000,
    };

    const success = (position) => {
        const coordinates = position.coords;
        const lat = coordinates.latitude;
        const lon = coordinates.longitude;

        const API_KEY = '618091e70c4175355131cb39a395b4cd';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                let temp = Math.round(data.main.temp);
                tempCelsius = `${temp}°C`;
                tempFahrenheit = `${Math.round((temp * 9) / 5 + 32)}°F`;
                temperatureElement.textContent = tempCelsius;
                dividerElement.textContent = '•';
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const error = () => {
        console.log(
            'Unable to display temperature. Please allow location access.'
        );
        temperatureElement.style.display = 'none';
        dividerElement.style.display = 'none';
    };

    navigator.geolocation.getCurrentPosition(
        success,
        error,
        temperatureOptions
    );
};

/**
 * <----- Utility Functions ----->
 *
 * 01. Switch between celsius and fahrenheit in the `temperature` element.
 * 02. Decline non-numeric inputs in `.input-amount` fields.
 */

// 01
temperatureElement.addEventListener('click', () => {
    if (temperatureElement.dataset.unit == 'celsius') {
        temperatureElement.textContent = tempFahrenheit;
        temperatureElement.dataset.unit = 'fahrenheit';
    } else if (temperatureElement.dataset.unit == 'fahrenheit') {
        temperatureElement.textContent = tempCelsius;
        temperatureElement.dataset.unit = 'celsius';
    }
});

// 02
const validateNum = (elem) => {
    const inputValue = elem.value.trim();
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue == 0) elem.value = '';
};

// 03
const reset = () => {
    inputDate.value = '';
    inputAmount.value = '';
    inputItem.value = '';

    modalInputDate.value = '';
    modalInputAmount.value = '';
    modalInputItem.value = '';
};
