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

    timerToggle.addEventListener('click', () => {
        timerSettings.classList.toggle('hidden');
    });

    function updateDisplay() {
        const hours = document.getElementById('hours').textContent;
        const minutes = document.getElementById('minutes').textContent;
        const seconds = document.getElementById('seconds').textContent;
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    hoursInc.addEventListener('click', () => {
        const hours = document.getElementById('hours');
        hours.textContent = (parseInt(hours.textContent, 10) + 1).toString().padStart(2, '0');
        updateDisplay();
    });

    hoursDec.addEventListener('click', () => {
        const hours = document.getElementById('hours');
        hours.textContent = (Math.max(parseInt(hours.textContent, 10) - 1, 0)).toString().padStart(2, '0');
        updateDisplay();
    });

    minutesInc.addEventListener('click', () => {
        const minutes = document.getElementById('minutes');
        minutes.textContent = (parseInt(minutes.textContent, 10) + 1).toString().padStart(2, '0');
        updateDisplay();
    });

    minutesDec.addEventListener('click', () => {
        const minutes = document.getElementById('minutes');
        minutes.textContent = (Math.max(parseInt(minutes.textContent, 10) - 1, 0)).toString().padStart(2, '0');
        updateDisplay();
    });

    secondsInc.addEventListener('click', () => {
        const seconds = document.getElementById('seconds');
        seconds.textContent = (parseInt(seconds.textContent, 10) + 1).toString().padStart(2, '0');
        updateDisplay();
    });

    secondsDec.addEventListener('click', () => {
        const seconds = document.getElementById('seconds');
        seconds.textContent = (Math.max(parseInt(seconds.textContent, 10) - 1, 0)).toString().padStart(2, '0');
        updateDisplay();
    });
});
