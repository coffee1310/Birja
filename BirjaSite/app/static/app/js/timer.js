document.addEventListener("DOMContentLoaded", function() {
    const timerToggle = document.getElementById('timer-toggle');
    const timerSettings = document.getElementById('timer-settings');
    const timerDisplay = document.getElementById('timer-display');
    const hoursInc = document.getElementById('hours-inc');
    const hoursDec = document.getElementById('hours-dec');
    const minutesInc = document.getElementById('minutes-inc');
    const minutesDec = document.getElementById('minutes-dec');
    const secondsInc = document.getElementById('seconds-inc');
    const secondsDec = document.getElementById('seconds-dec');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');

    timerToggle.addEventListener('click', () => {
        timerSettings.classList.toggle('hidden');
    });

    function updateDisplay() {
        const hours = hoursInput.value.padStart(2, '0');
        const minutes = minutesInput.value.padStart(2, '0');
        const seconds = secondsInput.value.padStart(2, '0');
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    function increment(input, max) {
        input.value = Math.min(parseInt(input.value, 10) + 1, max).toString().padStart(2, '0');
        updateDisplay();
    }

    function decrement(input, min) {
        input.value = Math.max(parseInt(input.value, 10) - 1, min).toString().padStart(2, '0');
        updateDisplay();
    }

    function validateInput(input, min, max) {
        if (input.value === '') {
            input.value = min.toString().padStart(2, '0');
        } else if (parseInt(input.value, 10) < min) {
            input.value = min.toString().padStart(2, '0');
        } else if (parseInt(input.value, 10) > max) {
            input.value = max.toString().padStart(2, '0');
        }
        updateDisplay();
    }

    hoursInc.addEventListener('click', () => increment(hoursInput, 23));
    hoursDec.addEventListener('click', () => decrement(hoursInput, 0));
    minutesInc.addEventListener('click', () => increment(minutesInput, 59));
    minutesDec.addEventListener('click', () => decrement(minutesInput, 0));
    secondsInc.addEventListener('click', () => increment(secondsInput, 59));
    secondsDec.addEventListener('click', () => decrement(secondsInput, 0));

    hoursInput.addEventListener('input', () => validateInput(hoursInput, 0, 23));
    minutesInput.addEventListener('input', () => validateInput(minutesInput, 0, 59));
    secondsInput.addEventListener('input', () => validateInput(secondsInput, 0, 59));

    // Ensure the display is correct on load
    updateDisplay();

    function hideProfitMenu() {
        const profitMenu = document.getElementById('profitMenu');
        profitMenu.style.top = '-100px';
        setTimeout(() => {
            profitMenu.style.display = 'none';
        }, 500); // Time must match the transition duration in CSS
    }
});
