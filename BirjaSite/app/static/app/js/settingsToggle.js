document.addEventListener("DOMContentLoaded", function() {
    let intervals = {
        '6M': ['10D', '14D', '21D', '1MTH'],
        '1M': ['2D', '3D', '5D', '7D'],
        '1W': ['4H', '6H', '12H', '1D'],
        '1D': ['30M', '1H', '2H', '3H'],
        '1H': ['1M', '2M', '5M', '10M']
    };

    // Сопоставляем периоды с интервалами
    const periodToIntervals = {
        '6M': intervals["6M"],
        '1M': intervals["1M"],
        '1W': intervals["1W"],
        '1D': intervals["1D"],
        '1H': intervals["1H"],
    };

    const interval2Toggle = document.getElementById('interval-toggle-2');
    const interval2Menu = document.getElementById('interval-menu-2');
    const intervalButtonsContainer = document.getElementById('interval-buttons-2');

    const menuToggle = document.getElementById('menu-toggle');
    const settingsMenu = document.getElementById('settings-menu');
    const intervalToggle = document.getElementById('interval-toggle');
    const intervalMenu = document.getElementById('interval-menu');
    const settingsToggle = document.getElementById('settings-toggle');
    const settings2Menu = document.getElementById('settings2-menu');

    let period = '1H';
    let chartType = 'line';

    createIntervalButtons(period);
    
    menuToggle.addEventListener('click', function() {
        settingsMenu.classList.toggle('hidden');
    });

    const menuItems = document.querySelectorAll('.menu-content button');
    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            settingsMenu.classList.add('hidden');
        });
    });
    
    intervalToggle.addEventListener('click', function() {
        intervalMenu.classList.toggle('hidden');
    });

    const intervalItems = document.querySelectorAll('.interval-content button');
    intervalItems.forEach(function(item) {
        item.addEventListener('click', function() {
            intervalMenu.classList.add('hidden');
        });
    });

    settingsToggle.addEventListener('click', function() {
        settings2Menu.classList.toggle('hidden');
    });

    const settings2Items = document.querySelectorAll('.settings-content button');
    settings2Items.forEach(function(item) {
        item.addEventListener('click', function() {
            settings2Menu.classList.add('hidden');
        });
    });

    function createIntervalButtons(period) {
        intervalButtonsContainer.innerHTML = ''; // Очищаем контейнер
        const selectedIntervals = periodToIntervals[period];
        
        // Создаем кнопки на основе выбранного периода
        selectedIntervals.forEach(interval => {
            const button = document.createElement('button');
            button.classList.add('interval-2');
            button.setAttribute('data-interval', interval);
            button.innerText = interval;
            intervalButtonsContainer.appendChild(button);
        });
    }

    // Событие для показа/скрытия меню интервалов
    interval2Toggle.addEventListener('click', function() {
        interval2Menu.classList.toggle('hidden');
    });

    document.querySelectorAll('.chart-type').forEach(button => {
        button.addEventListener('click', function() {
            const chartType = button.getAttribute('data-chart-type');
            const period = document.getElementById('');
            if (chartType === 'candlestick') {
                createIntervalButtons(period);
            } else if (chartType === 'ohlc') {
                createIntervalButtons(period);
            } else {
                createIntervalButtons(period);
            }
        });
    });

    document.querySelectorAll('.interval').forEach(button => {
        button.addEventListener('click', function() {
            period = this.getAttribute('data-interval');
            createIntervalButtons(period);
        });
    });

    document.querySelectorAll('.chart-type').forEach(button => {
        button.addEventListener('click', function() {
            chartType = this.getAttribute('data-chart-type');

            if (chartType === 'candlestick') {
                createIntervalButtons(period);
            } else if (chartType === 'ohlc') {
                createIntervalButtons(period);
            } else {
                createIntervalButtons(period);
            }
        });
    });

    document.addEventListener('click', function(event) {
        // Проверяем, если клик был вне меню и вне кнопки переключения
        if (!settingsMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            settingsMenu.classList.add('hidden');
        }
        if (!intervalMenu.contains(event.target) && !intervalToggle.contains(event.target)) {
            intervalMenu.classList.add('hidden');
        }
        if (!interval2Menu.contains(event.target) && !interval2Toggle.contains(event.target)) {
            interval2Menu.classList.add('hidden');
        }
        if (!settings2Menu.contains(event.target) && !settingsToggle.contains(event.target)) {
            settings2Menu.classList.add('hidden');
        }
    }); 
});
