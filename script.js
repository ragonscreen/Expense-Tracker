/**
 * Custom datepicker built with vanilla JS.
 * Initialised using CDN links in HTML.
 * https://mymth.github.io/vanillajs-datepicker/#/
*/

const input = document.querySelector('.input-date');
const datepicker = new Datepicker(input, {
    autohide: true,
    format: 'dd/mm/yy'
});

/**
 * <----- BASIC FUNCTIONALITY ----->
 *
 * 01. Initialise all expenses after retreieving them from local storage.
 * 02. Add a new expense.
 * 03. Render an expense element.
 * 04. Delete all expense elements.
 * 05. Toggle empty state.
*/

let DATABASE = [];
let localStorageExpensesKey = 'rag.expenses';

document.addEventListener('DOMContentLoaded', () => {
    initialiseExpenses();
    showDateTime();
    showTemperature();
});

const expensesContainer = document.querySelector('.expenses');
const amountTotalElement = document.querySelector('.amount-total');

/**
 * 01. Initialise all expenses after retreieving them from local storage.
 *
 * - Renders each expense.
 * - Calculates the total amount.
 * - Checks for empty state.
*/

const initialiseExpenses = () => {
    let totalAmount = 0;
    const items = getLocalStorage(localStorageExpensesKey);
    items.forEach(item => {
        totalAmount += parseInt(item.amount);
        DATABASE.push(item);
        renderExpenseElement(item);
    });
    if (DATABASE.length >= 1) disableEmptyState();
    amountTotalElement.textContent = totalAmount.toLocaleString();
};

// 01
// const modal = document.querySelector('.expense-modal');

// const btnNewExpense = document.querySelector('.btn-new-expense');
// btnNewExpense.addEventListener('click', () => {
//     modal.showModal();
// });

// const btnCancel = document.querySelector('.btn-cancel');
// btnCancel.addEventListener('click', () => {
//     modal.close();
// });



const btnSave = document.querySelector('.btn-save');
btnSave.addEventListener('click', () => {
    addExpense();
});

const inputDate = document.querySelector('#input-date');
const inputAmount = document.querySelector('#input-amount');
const inputItem = document.querySelector('#input-item');

/**
 * 02. Add a new expense.
 *
 * - Renders a new expense element for the expense.
 * - Updates local storage after adding the expense.
 * - Updates the total amount.
*/

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
        item: item
    };

    DATABASE.push(element);
    amountTotalElement.textContent =
        (
            parseInt(amountTotalElement.textContent.replace(',', '')) +
            parseInt(amount)
        ).toLocaleString();

    updateLocalStorage(localStorageExpensesKey, DATABASE);
    renderExpenseElement(element);
    reset();
};

const btnDeleteAll = document.querySelector('.btn-delete-all');

/**
 * 03. Render an expense element.
 *
 * - Creates a new `div` with a class of `expense` and a unique `data-id`.
 * - Adds the necessary HTMl within the element.
 * - Adds it to the DOM right before the `btn-delete-all` button.
*/

const renderExpenseElement = e => {
    disableEmptyState();

    const element = document.createElement('div');
    element.classList.add('expense');
    element.dataset.id = e.id;
    const html =
        `<p class="expense__date">${e.date}</p>
        <p class="expense__item">${e.item}</p>
        <p class="expense__amount">${e.amount}</p>`;
    element.innerHTML = html;

    if (btnDeleteAll) {
        btnDeleteAll.insertAdjacentElement('beforebegin', element);
    }
};

btnDeleteAll.addEventListener('click', () => {
    deleteAll();
});

/**
 * 04. Delete all expense elements.
 * - Removes all expenses from local storage.
 * - Removes all expense elements.
 * - Renders empty state.
*/

const deleteAll = () => {
    DATABASE = DATABASE.filter(e => !e);
    updateLocalStorage(localStorageExpensesKey, DATABASE);
    renderEmptyState();
    const elements = document.querySelectorAll('.expense');
    elements.forEach(element => element.remove());
    amountTotalElement.textContent = '0';
};

/**
 * 05. Toggle empty state.
*/

const renderEmptyState = () => {
    expensesContainer.classList.remove('expenses-visible');
};

const disableEmptyState = () => {
    if (!expensesContainer.classList.contains('expenses-visible')) {
        expensesContainer.classList.add('expenses-visible')
    }
};

/**
 * <----- Local Storage ----->
*/

// 01
const getLocalStorage = key => {
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
 * - Uses geolocation API to get location and OpenWeatherMap API to get temperature.
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
        day: 'numeric'
    };

    const date = newDate.toLocaleDateString(undefined, dateOptions);
    dateElement.textContent = date;

    const timeOptions = {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
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

    const success = position => {
        const coordinates = position.coords;
        const lat = coordinates.latitude;
        const lon = coordinates.longitude;

        const API_KEY = '618091e70c4175355131cb39a395b4cd';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                let temp = Math.round(data.main.temp);
                tempCelsius = `${temp}°C`;
                tempFahrenheit = `${Math.round(temp * 9 / 5 + 32)}°F`;
                temperatureElement.textContent = tempCelsius;
                dividerElement.textContent = '•';
            })
            .catch(err => {
                console.log(err);
            });
    };

    const error = () => {
        console.log('Unable to display temperature. Please allow location access.');
        temperatureElement.style.display = 'none';
        dividerElement.style.display = 'none';
    };

    navigator.geolocation.getCurrentPosition(success, error, temperatureOptions);
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
const validateNum = elem => {
    const inputValue = elem.value.trim();
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue == 0) elem.value = '';
};

// 03
const reset = () => {
    inputDate.value = '';
    inputAmount.value = '';
    inputItem.value = '';
};
