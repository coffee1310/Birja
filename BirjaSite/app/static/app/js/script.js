    document.addEventListener("DOMContentLoaded", function() {
        const faders = document.querySelectorAll('.fade-in');
        const counters = document.querySelectorAll('.count-up');

        const options = {
            threshold: 0.1,
            passive: true
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
            const increment = target / 100; 

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

        const ctx = document.getElementById('cryptoChart').getContext('2d');
    let chartType = 'line';
    let currentChart;

    const chartConfig = {
        type: chartType,
        data: {
            labels: [],
            datasets: [{
                data: [],
                // Цвет для линии графика, если выбран тип 'line'
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
                color: {
                    // Цвет положительных свечей (вверх)
                    up: '#249D92',  // Измените этот цвет на желаемый
                    // Цвет отрицательных свечей (вниз)
                    down: '#C95454',  // Измените этот цвет на желаемый
                    // Цвет неизменившихся свечей
                    unchanged: '#999999'
                },
                barPercentage: 1,
                categoryPercentage: 1,
                    
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
                    },
                    ticks: {
                        color: 'white'
                    },
                },
                y: {
                    beginAtZero: false,
                    position: 'right',
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        backgroundColor: 'white'
                    }
                },
                legend: {
                    display: false // Эта строка убирает подпись (легенду) над графиком
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
                    zoom: {
                        wheel: {
                            enabled: false
                        },
                        drag: {
                            enabled: false
                        },
                        pinch: {
                            enabled: false
                        },
                        mode: 'xy',
                        onZoom: function({chart}) {
                            const minYBoundary = Math.min(...chart.data.datasets[0].data);
                            if (chart.options.scales.y.min < minYBoundary) {
                                chart.options.scales.y.min = minYBoundary;
                                chart.update();
                            }
                        }
                    }
                }
            },
            elements: {
                candlestick: {
                    barPercentage: 1.0,
                    categoryPercentage: 0.5,
                    
                    // Настройка прозрачности свечей
                    borderColor: 'rgba(0, 0, 0, 1)',  // Измените этот цвет для границы свечей
                    borderWidth: 1,
                    // Настройка закругления свечей
                    borderRadius: 5  // Значение радиуса для закругления углов
                    
                }
            }
        }
    };
    function createChart() {
        if (currentChart) {
            currentChart.destroy();
        }
        currentChart = new Chart(ctx, chartConfig);
    }

    createChart();
    const chartTypeSelect = document.getElementById('chartType');

        // Функция для добавления вертикальной линии
        function addVerticalLine(chart, timestamp) {
            chart.options.plugins.annotation.annotations.endLine = {
                type: 'line',
                xMin: timestamp,
                xMax: timestamp,
                borderColor: 'red',
                borderWidth: 2,
                label: {
                    content: 'End Time',
                    enabled: true,
                    position: 'top'
                }
            };
            chart.update();
        }

        // Обновленная функция для открытия позиции
        async function openPosition(amount, duration, positionType) {
            const selectedCrypto = document.getElementById('cryptoSelect').value;
            const response = await fetch('/trade/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    crypto: selectedCrypto,
                    amount: amount,
                    duration: duration,
                    positionType: positionType
                })
            });

            if (response.ok) {
                const result = await response.json();
                const endTime = new Date(result.end_time).getTime();
                addVerticalLine(bitcoinChart, endTime);
                console.log('Position opened successfully:', result);
            } else {
                console.error('Error opening position:', await response.text());
            }
        }

        document.querySelector('.higher').addEventListener('click', () => {
            const amount = parseFloat(document.querySelector('input[name="amount"]').value);
            const duration = calculateDuration();
            openPosition(amount, duration, 'long');
        });

        document.querySelector('.lower').addEventListener('click', () => {
            const amount = parseFloat(document.querySelector('input[name="amount"]').value);
            const duration = calculateDuration();
            openPosition(amount, duration, 'short');
        });

        // Пример функции для расчета продолжительности
        function calculateDuration() {
            const hours = parseInt(document.getElementById('hours').textContent, 10);
            const minutes = parseInt(document.getElementById('minutes').textContent, 10);
            const seconds = parseInt(document.getElementById('seconds').textContent, 10);
            return (hours * 3600) + (minutes * 60) + seconds;
        }

        const apiKey = 'b2f300377672777aa258f397ac6c22f5c1fa12191e41ac68f82196aadf99478c';

        async function fetchAndAddDataToChart(symbol, range, chartType) {
            const apiKey = 'b2f300377672777aa258f397ac6c22f5c1fa12191e41ac68f82196aadf99478c';
            const currency = 'USD';
            const now = Math.floor(Date.now() / 1000);
            const dayInSeconds = 86400;
            let fromTimestamp;
            let timeUnit;
            let url;
            let interval; // Добавляем переменную для интервала
        
            switch (range) {
                case '5y':
                    fromTimestamp = now - (5 * 365 * dayInSeconds);
                    timeUnit = 'month';
                    interval = 7; // Отбираем данные с интервалом в 6 месяцев
                    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=2000&api_key=${apiKey}`;
                    break;
                case '1y':
                    fromTimestamp = now - (365 * dayInSeconds);
                    timeUnit = 'day';
                    interval = 4; // Отбираем данные с интервалом в месяц
                    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=2000&api_key=${apiKey}`;
                    break;
                case '6m':
                    fromTimestamp = now - (6 * 30 * dayInSeconds);
                    timeUnit = 'day';
                    interval = 1; // Отбираем данные с интервалом в полмесяца
                    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=180&api_key=${apiKey}`;
                    break;
                case '1m':
                    fromTimestamp = now - (30 * dayInSeconds);
                    timeUnit = 'hour';
                    interval = 1; // Отбираем данные с интервалом в день
                    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=30&api_key=${apiKey}`;
                    break;
                case '1w':
                    fromTimestamp = now - (7 * dayInSeconds);
                    timeUnit = 'minutes';
                    interval = 2; // Отбираем данные с интервалом в 12 часов
                    url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=168&api_key=${apiKey}`;
                    break;
                case '1d':
                    fromTimestamp = now - dayInSeconds;
                    timeUnit = 'hour';
                    interval = 1; // Отбираем данные с интервалом в час
                    url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=24&api_key=${apiKey}`;
                    break;
                case '1h':
                    fromTimestamp = now - 3600;
                    timeUnit = 'minute';
                    interval = 1; // Отбираем данные с интервалом в минуту
                    url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=60&api_key=${apiKey}`;
                    break;
                default:
                    fromTimestamp = now - (5 * 365 * dayInSeconds);
                    timeUnit = 'month';
                    interval = 7; // Отбираем данные с интервалом в 6 месяцев
                    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=2000&api_key=${apiKey}`;
                    break;
            }
        
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
                if (data.Response === "Success") {
                    let filteredData = [];
                    for (let i = 0; i < data.Data.Data.length; i += interval) {
                        filteredData.push(data.Data.Data[i]);
                    }
        
                    if (chartType === 'line') {
                        const prices = filteredData.map(point => ({
                            t: new Date(point.time * 1000),
                            y: point.close
                        }));
        
                        chartConfig.data.labels = prices.map(point => point.t);
                        chartConfig.data.datasets[0].data = prices.map(point => point.y);
                    } else if (chartType === 'candlestick') {
                        currentChart.data.datasets[0].backgroundColors   = {
                            up: '#249D92',
                            down: '#C95454',
                            unchanged: '#999',
                        };
                        const prices = filteredData.map(point => ({
                            t: new Date(point.time * 1000),
                            o: point.open,
                            h: point.high,
                            l: point.low,
                            c: point.close
                        }));
        
                        chartConfig.data.labels = prices.map(point => point.t);
                        chartConfig.data.datasets[0].data = prices.map(point => ({
                            x: point.t,
                            o: point.o,
                            h: point.h,
                            l: point.l,
                            c: point.c
                        }));
                    }
        
                    chartConfig.options.scales.x.time.unit = timeUnit;
                    document.getElementById('cryptoChart').getContext('2d').canvas.focus();
                    currentChart.update();
                } else {
                    console.error('Ошибка при получении данных:', data.Message);
                }
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }
        

        const cryptoSelect = document.getElementById('cryptoSelect');
        const timeRangeButtons = document.getElementById('timeRangeButtons');
        let currentRange = '1h';

        cryptoSelect.addEventListener('change', () => {
            fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
        });
    
        timeRangeButtons.addEventListener('change', (event) => {
            const selectedRange = event.target.value;
            currentRange = selectedRange;
            fetchAndAddDataToChart(cryptoSelect.value, selectedRange, chartType);
        });

        chartTypeSelect.addEventListener('change', () => {
            chartType = chartTypeSelect.value;
            chartConfig.type = chartType === 'candlestick' ? 'candlestick' : 'line';
            chartConfig.data.datasets[0].type = chartType;
            chartConfig.data.datasets[0].backgroundColor = chartType === 'line' ? 'rgba(75, 192, 192, 0.5)' : undefined;
            chartConfig.data.datasets[0].borderColor = chartType === 'line' ? 'rgba(75, 192, 192, 1)' : undefined;
            chartConfig.data.datasets[0].borderWidth = chartType === 'line' ? 1 : undefined;
            chartConfig.data.datasets[0].fill = chartType === 'line';
            createChart();
            fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
        });

        fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
        setInterval(() => fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType), 3000);

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
            initialMinX = currentChart.options.scales.x.min;
            initialMaxX = currentChart.options.scales.x.max;
            initialMinY = currentChart.options.scales.y.min;
            initialMaxY = currentChart.options.scales.y.max;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const deltaX = event.clientX - startX;
                const deltaY = event.clientY - startY;

                const minXBoundary = currentChart.data.labels[0].getTime();
                const maxXBoundary = currentChart.data.labels[currentChart.data.labels.length - 1].getTime();
                const minYBoundary = Math.min(...currentChart.data.datasets[0].data);

                const newMinX = Math.max(minXBoundary, initialMinX + deltaX * (initialMaxX - initialMinX) / 1000);
                const newMaxX = Math.min(maxXBoundary, initialMaxX + deltaX * (initialMaxX - initialMinX) / 1000);

                currentChart.options.scales.x.min = newMinX;
                currentChart.options.scales.x.max = newMaxX;

                const newMinY = Math.max(minYBoundary, initialMinY - deltaY * (initialMaxY - initialMinY) / 1000);
                const newMaxY = initialMaxY - deltaY * (initialMaxY - initialMinY) / 1000;

                currentChart.options.scales.y.min = newMinY;
                currentChart.options.scales.y.max = newMaxY;

                currentChart.update();
            }
        });
        
    });
