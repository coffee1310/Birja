document.addEventListener('DOMContentLoaded', function() {
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const timerDisplay = document.getElementById('timer-display');

    const hoursInc = document.getElementById('hours-inc');
    const hoursDec = document.getElementById('hours-dec');
    const minutesInc = document.getElementById('minutes-inc');
    const minutesDec = document.getElementById('minutes-dec');
    const secondsInc = document.getElementById('seconds-inc');
    const secondsDec = document.getElementById('seconds-dec');
    const timerToggle = document.getElementById('timer-toggle');
    const timerSettings = document.getElementById('timer-settings');
    const timerConfirm = document.getElementById('timer-confirm');

    // Начальные значения времени
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Функции для увеличения и уменьшения времени
    function increaseTime(type) {
        switch (type) {
            case 'hours':
                //hours = (hours + 1) % 24; // Ограничение до 24 часов
                break;
            case 'minutes':
                minutes = (minutes + 1) % 5; // Ограничение до 5 минут
                break;
            case 'seconds':
                seconds = (seconds + 1) % 60; // Ограничение до 60 секунд
                break;
        }
        updateDisplay();
    }

    function decreaseTime(type) {
        switch (type) {
            case 'hours':
                //hours = (hours - 1 + 24) % 24; // Ограничение до 24 часов
                break;
            case 'minutes':
                minutes = (minutes - 1 + 60) % 5; // Ограничение до 5 минут
                break;
            case 'seconds':
                seconds = (seconds - 1 + 60) % 60; // Ограничение до 60 секунд
                break;
        }
        updateDisplay();
    }

    // Функция обновления отображаемого времени
    function updateDisplay() {
        hoursDisplay.textContent = hours.toString().padStart(2, '0');
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Обработчики событий для кнопок увеличения и уменьшения
    hoursInc.addEventListener('click', () => increaseTime('hours'));
    hoursDec.addEventListener('click', () => decreaseTime('hours'));
    minutesInc.addEventListener('click', () => increaseTime('minutes'));
    minutesDec.addEventListener('click', () => decreaseTime('minutes'));
    secondsInc.addEventListener('click', () => increaseTime('seconds'));
    secondsDec.addEventListener('click', () => decreaseTime('seconds'));

    // Обработчик для кнопки "Выбрать время"
    timerToggle.addEventListener('click', () => {
        timerSettings.classList.toggle('hidden');
    });
});
