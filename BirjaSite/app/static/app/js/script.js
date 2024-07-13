document.addEventListener("DOMContentLoaded", function() {
    const faders = document.querySelectorAll('.fade-in');
    const counters = document.querySelectorAll('.count-up');

    const options = {
        threshold: 0.1,
        passive: true // Добавляем опцию passive для улучшения производительности
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('show');
                }

                if (entry.target.classList.contains('count-up')) {
                    animateCount(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, options);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    counters.forEach(counter => {
        appearOnScroll.observe(counter);
    });

    function animateCount(element) {
        const target = +element.getAttribute('data-target');
        const increment = target / 100; // продолжительность анимации

        let current = 0;
        function updateCount() {
            current += increment;
            if (current < target) {
                element.innerText = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                element.innerText = target;
            }
        }

        updateCount();
    }

    const bitcoinChart = new Chart(document.getElementById('cryptoChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Crypto Price (USD)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        tooltipFormat: 'll'
                    }
                },
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        drag: {
                            enabled: false
                        },
                        pinch: {
                            enabled: false
                        },
                        mode: 'xy'
                    }
                }
            }
        }
    });

    const apiKey = 'b2f300377672777aa258f397ac6c22f5c1fa12191e41ac68f82196aadf99478c';

    async function fetchAndAddDataToChart(symbol, range) {
        const currency = 'USD';
        const now = Math.floor(Date.now() / 1000);
        const dayInSeconds = 86400;
        let fromTimestamp;
        let timeUnit;
        let url;

        switch (range) {
            case 'all':
                fromTimestamp = now - (10 * 365 * dayInSeconds); // Примерно 10 лет
                timeUnit = 'month';
                url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=2000&api_key=${apiKey}`;
                break;
            case '5y':
                fromTimestamp = now - (5 * 365 * dayInSeconds);
                timeUnit = 'month';
                url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=1825&api_key=${apiKey}`;
                break;
            case '1y':
                fromTimestamp = now - (365 * dayInSeconds);
                timeUnit = 'day';
                url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=365&api_key=${apiKey}`;
                break;
            case '6m':
                fromTimestamp = now - (6 * 30 * dayInSeconds);
                timeUnit = 'day';
                url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=180&api_key=${apiKey}`;
                break;
            case '1m':
                fromTimestamp = now - (30 * dayInSeconds);
                timeUnit = 'hour';
                url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=720&api_key=${apiKey}`;
                break;
            case '1w':
                fromTimestamp = now - (7 * dayInSeconds);
                timeUnit = 'hour';
                url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=168&api_key=${apiKey}`;
                break;
            case '1d':
                fromTimestamp = now - dayInSeconds;
                timeUnit = 'minute';
                url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=1440&api_key=${apiKey}`;
                break;
            case '1h':
                fromTimestamp = now - 3600;
                timeUnit = 'minute';
                url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=60&api_key=${apiKey}`;
                break;
            default:
                fromTimestamp = now - (10 * 365 * dayInSeconds); // По умолчанию 10 лет
                timeUnit = 'month';
                url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=2000&api_key=${apiKey}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            console.log(data); // Логирование данных для отладки

            if (data.Response === "Success") {
                const prices = data.Data.Data.map(point => ({
                    t: new Date(point.time * 1000),
                    y: point.close
                }));

                bitcoinChart.data.labels = prices.map(point => point.t);
                bitcoinChart.data.datasets[0].data = prices.map(point => point.y);
                bitcoinChart.options.scales.x.time.unit = timeUnit; // Устанавливаем единицу времени для оси x
                bitcoinChart.update();
                document.getElementById('cryptoChart').focus();
            } else {
                console.error('Ошибка при получении данных:', data.Message);
            }
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    // Инициализация графика с данными для выбранной криптовалюты и интервала
    const cryptoSelect = document.getElementById('cryptoSelect');
    const timeRangeButtons = document.querySelectorAll('#timeRangeButtons button');
    let currentRange = 'all';

    cryptoSelect.addEventListener('change', () => {
        fetchAndAddDataToChart(cryptoSelect.value, currentRange);
    });

    timeRangeButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentRange = button.getAttribute('data-range');
            fetchAndAddDataToChart(cryptoSelect.value, currentRange);
        });
    });

    // Изначально загружаем данные для первой криптовалюты в списке и выбранного интервала
    fetchAndAddDataToChart(cryptoSelect.value, currentRange);

    // Обновление данных каждые 2 минуты
    setInterval(() => fetchAndAddDataToChart(cryptoSelect.value, currentRange), 10000); // 120000 мс = 2 минуты
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialMinX = null;
    let initialMaxX = null;
    let initialMinY = null;
    let initialMaxY = null;

    document.getElementById('cryptoChart').addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialMinX = bitcoinChart.options.scales.x.min;
        initialMaxX = bitcoinChart.options.scales.x.max;
        initialMinY = bitcoinChart.options.scales.y.min;
        initialMaxY = bitcoinChart.options.scales.y.max;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            const scaleX = 1 + deltaX / 1000; // Настройте это значение для изменения чувствительности горизонтальной прокрутки
            const scaleY = 1 + deltaY / 1000; // Настройте это значение для изменения чувствительности вертикальной прокрутки

            // Обновляем горизонтальные границы
            const newMinX = initialMinX + (deltaX * (initialMaxX - initialMinX) / 1000);
            const newMaxX = initialMaxX + (deltaX * (initialMaxX - initialMinX) / 1000);

            // Ограничиваем минимальные и максимальные значения
            bitcoinChart.options.scales.x.min = newMinX;
            bitcoinChart.options.scales.x.max = newMaxX;

            // Обновляем вертикальные границы
            const newMinY = initialMinY / scaleY;
            const newMaxY = initialMaxY / scaleY;

            // Ограничиваем минимальные и максимальные значения
            bitcoinChart.options.scales.y.min = newMinY;
            bitcoinChart.options.scales.y.max = newMaxY;

            bitcoinChart.update();
        }
    });
});