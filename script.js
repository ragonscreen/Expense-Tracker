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
 * <----- Secondary Functionality ----->
 *
 * 01. Show date and time
 * 02. Show temperature
 * - Uses geolocation API to get location and OpenWeatherMap API to get temperature.
 * - User must enable location to display temperature.
*/

document.addEventListener('DOMContentLoaded', () => {
    showDateTime();
    showTemperature();
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
}

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
