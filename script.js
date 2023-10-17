/**
 * Custom datepicker
 *
 * Initialised using CDN links in HTML
 * https://mymth.github.io/vanillajs-datepicker/#/
*/

const inputs = document.querySelectorAll('.input-date');
inputs.forEach(input => {
    const datepicker = new Datepicker(input, {
        autohide: true,
        format: 'dd/mm/yy'
    });
});

/**
 * <----- Basic Functionality ----->
 *
 * 01. Modal Controls
*/

// 01
const modal = document.querySelector('.expense-modal');

const btnNewExpense = document.querySelector('.btn-new-expense');
btnNewExpense.addEventListener('click', () => {
    modal.showModal();
});

const btnCancel = document.querySelector('.btn-cancel');
btnCancel.addEventListener('click', () => {
    modal.close();
});

/**
 * <----- Utility Functions ----->
 *
 * 01. Decline non-numeric inputs in amount field
*/

// 01
const validateNum = elem => {
    const inputValue = elem.value.trim();
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue == 0) elem.value = '';
}

/**
 * <----- Secondary Functionality ----->
 *
 * 01. Show date and time
*/

document.addEventListener('DOMContentLoaded', () => {
    showDateTime();
});

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
        hour: 'numeric',
        minute: 'numeric'
    }

    const time = newDate.toLocaleTimeString(undefined, timeOptions);
    timeElement.textContent = time;
};

setInterval(() => {
    showDateTime();
}, 1000);
