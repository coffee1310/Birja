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
                        },
                        ticks: {
                            color: 'white'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: 0,
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
                }
            }
        });

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

        async function fetchAndAddDataToChart(symbol, range) {
            const currency = 'USD';
            const now = Math.floor(Date.now() / 1000);
            const dayInSeconds = 86400;
            let fromTimestamp;
            let timeUnit;
            let url;

            switch (range) {
                case 'all':
                    fromTimestamp = now - (10 * 365 * dayInSeconds);
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
                    fromTimestamp = now - (10 * 365 * dayInSeconds);
                    timeUnit = 'month';
                    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&toTs=${now}&limit=2000&api_key=${apiKey}`;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();

                console.log(data);

                if (data.Response === "Success") {
                    const prices = data.Data.Data.map(point => ({
                        t: new Date(point.time * 1000),
                        y: point.close
                    }));

                    bitcoinChart.data.labels = prices.map(point => point.t);
                    bitcoinChart.data.datasets[0].data = prices.map(point => point.y);

                    const minY = Math.min(...prices.map(point => point.y));
                    bitcoinChart.options.scales.y.min = minY;

                    bitcoinChart.options.scales.x.time.unit = timeUnit;
                    bitcoinChart.update();
                    document.getElementById('cryptoChart').focus();
                } else {
                    console.error('Ошибка при получении данных:', data.Message);
                }
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }

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

        fetchAndAddDataToChart(cryptoSelect.value, currentRange);

        setInterval(() => fetchAndAddDataToChart(cryptoSelect.value, currentRange), 10000);

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

                const minXBoundary = bitcoinChart.data.labels[0].getTime();
                const maxXBoundary = bitcoinChart.data.labels[bitcoinChart.data.labels.length - 1].getTime();
                const minYBoundary = Math.min(...bitcoinChart.data.datasets[0].data);

                const newMinX = Math.max(minXBoundary, initialMinX + deltaX * (initialMaxX - initialMinX) / 1000);
                const newMaxX = Math.min(maxXBoundary, initialMaxX + deltaX * (initialMaxX - initialMinX) / 1000);

                bitcoinChart.options.scales.x.min = newMinX;
                bitcoinChart.options.scales.x.max = newMaxX;

                const newMinY = Math.max(minYBoundary, initialMinY - deltaY * (initialMaxY - initialMinY) / 1000);
                const newMaxY = initialMaxY - deltaY * (initialMaxY - initialMinY) / 1000;

                bitcoinChart.options.scales.y.min = newMinY;
                bitcoinChart.options.scales.y.max = newMaxY;

                bitcoinChart.update();
            }
        });
        
    });
