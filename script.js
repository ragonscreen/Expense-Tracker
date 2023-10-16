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
 * 01. Decline non-numeric inputs in amount field
*/

// 01
const validateNum = elem => {
    const inputValue = elem.value.trim();
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue == 0) elem.value = '';
}
