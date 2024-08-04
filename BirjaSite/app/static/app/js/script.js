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
                barThickness: 'flex',
                
            }],
            

        },
        options: {
            animation: {
                duration: 100,
                
            },
            transitions: 'hide',
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
                },
            },
            plugins: {
                annotation: {
                    annotations: []
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
                        mode: 'x',
                        
                    },
                    zoomLevel: 0
                }
            },
            elements: {
                candlestick: {
                    barPercentage: 1.0,
                    categoryPercentage: 0.5,
                    barThickness: 0.1,
                    // Настройка прозрачности свечей
                    borderColor: 'rgba(0, 0, 0, 1)',  // Измените этот цвет для границы свечей
                    borderWidth: 1,
                    // Настройка закругления свечей
                    borderRadius: 5,  // Значение радиуса для закругления углов
                    
                }
            },
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

        let loadedData = [];
        // Обновленная функция для открытия позиции
        
        let interval;
        const apiKey = 'b2f300377672777aa258f397ac6c22f5c1fa12191e41ac68f82196aadf99478c';
        let timeUnit;

        async function fetchAndAddDataToChart(symbol, range, chartType, startTime, append = false) {
            const currency = 'USD';
            let url;
            const screenWidth = window.innerWidth;
        
            switch (range) {
                case '6m':
                    timeUnit = 'day';
                    interval = screenWidth > 576 ? 7 : 25;
                    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=210&api_key=${apiKey}`;
                    break;
                case '1m':
                    timeUnit = 'day';
                    interval = screenWidth > 576 ? 25 : 100;
                    url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=840&api_key=${apiKey}`;
                    break;
                case '1w':
                    timeUnit = 'hour';
                    interval = screenWidth > 576 ? 7 : 20;
                    url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=192&api_key=${apiKey}`;
                    break;
                case '1d':
                    timeUnit = 'minute';
                    interval = screenWidth > 576 ? 10 : 45;
                    url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=360&api_key=${apiKey}`;
                    break;
                case '1h':
                    timeUnit = 'minute';
                    interval = screenWidth > 576 ? 3 : 10;
                    url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=75&api_key=${apiKey}`;
                    break;
                default:
                    timeUnit = 'month';
                    interval = 30;
                    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=2000&api_key=${apiKey}`;
                    break;
            }
        
            if (startTime && !isNaN(startTime)) {
                const toTs = Math.floor(startTime / 1000);
                url += `&toTs=${toTs}`;
            }
        
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
                if (data.Response === "Success") {
                    let newData = [];
                    for (let i = data.Data.Data.length; i > 0; i -= interval) {
                        const intervalData = data.Data.Data.slice(i, i + interval);
                        
                        if (intervalData.length > 0) {
                            const endOfIntervalData = intervalData[intervalData.length - 1];
                            if (intervalData.length === 1) {
                                newData.push({
                                    time: endOfIntervalData.time,
                                    open: endOfIntervalData.open,
                                    high: endOfIntervalData.high,
                                    low: endOfIntervalData.low,
                                    close: endOfIntervalData.close
                                });
                            } else {
                                newData.push({
                                    time: endOfIntervalData.time,
                                    open: intervalData[0].open,
                                    high: Math.max(...intervalData.map(point => point.high)),
                                    low: Math.min(...intervalData.map(point => point.low)),
                                    close: endOfIntervalData.close
                                });
                            }
                        }
                    }
        
                    newData = newData.reverse();
                    if (append) {
                        // Добавляем новые данные в конец
                        const uniqueTimes = new Set(loadedData.map(d => d.time));
                        newData.forEach(d => {
                            if (!uniqueTimes.has(d.time)) {
                                loadedData.push(d);
                                uniqueTimes.add(d.time);
                            }
                        });
                    } else {
                        // Добавляем новые данные в начало
                        const uniqueTimes = new Set(loadedData.map(d => d.time));
                        newData.forEach(d => {
                            if (!uniqueTimes.has(d.time)) {
                                loadedData.unshift(d);
                                uniqueTimes.add(d.time);
                            }
                        });
                    }
        
                    loadedData = loadedData.sort((a, b) => a.time - b.time);
                    
                    updateChart(chartType, timeUnit);
                    
                } else {
                    console.error('Ошибка при получении данных:', data.Message);
                }
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }
        
        function convertIntervalToMilliseconds(interval, unit) {
            switch (unit) {
                case 'day':
                    return interval * 24 * 60 * 60 * 1000;
                case 'hour':
                    return interval * 60 * 60 * 1000;
                case 'minute':
                    return interval * 60 * 1000;
                default:
                    throw new Error('Unsupported interval unit');
            }
        }

        async function updatePriceData() {
            const crypto = cryptoSelect.value;
            try {
                const apiEndpoint = 'https://min-api.cryptocompare.com/data/price?fsym=';
                const response = await fetch(`${apiEndpoint}${crypto}&tsyms=USD&api_key=${apiKey}`);
                const data = await response.json();
                const currentPrice = data.USD;
                const currentTime = data.time; // Время в секундах
        
                // Если есть загруженные данные
                if (loadedData.length > 0) {
                    const lastDataPoint = loadedData[loadedData.length - 1];
                    const timeDifference = (currentTime - lastDataPoint.time) * 1000;
                    const intervalMilliseconds = convertIntervalToMilliseconds(interval, timeUnit);

                    if (timeDifference >= intervalMilliseconds) {
                        // Добавить новую точку данных
                        const newDataPoint = {
                            x: new Date(currentTime * 1000),
                            o: currentPrice,
                            h: currentPrice,
                            l: currentPrice,
                            c: currentPrice
                        };
                        loadedData.push(newDataPoint);
        
                        // Добавляем новую точку в график
                        if (chartType == 'candlestick') {
                            currentChart.data.datasets[0].data.push(newDataPoint);
                        } else {
                            currentChart.data.datasets[0].data.push(newDataPoint.close);
                        }
                    } else {
                        // Обновить последнюю точку данных
                        const index = currentChart.data.datasets[0].data.length - 1;
                        const lastDataPoint2 = currentChart.data.datasets[0].data[index];
                        lastDataPoint2.c = currentPrice;
                        lastDataPoint2.h = Math.max(lastDataPoint.high, currentPrice);
                        lastDataPoint2.l = Math.min(lastDataPoint.low, currentPrice);

                        lastDataPoint.close = currentPrice;
                        lastDataPoint.high = Math.max(lastDataPoint.high, currentPrice);
                        lastDataPoint.low = Math.min(lastDataPoint.low, currentPrice);
                        // Обновляем последнюю точку в графике
                        if (chartType == 'candlestick') {
                             currentChart.data.datasets[0].data[index] = lastDataPoint2;
                             
                        } else {
                            currentChart.data.datasets[0].data[index] = lastDataPoint.close;
                        }
                    }
                } else {
                    // Если данных еще нет, добавить первую точку данных
                    const newDataPoint = {
                        x: new Date(currentTime * 1000),
                        o: currentPrice,
                        h: currentPrice,
                        l: currentPrice,
                        c: currentPrice
                    };
                    loadedData.push(newDataPoint);
        
                    // Добавляем первую точку в график
                    currentChart.data.datasets[0].data.push(newDataPoint);
                }
        
                // Обновление графика после добавления или изменения данных
                currentChart.update();
                
        
            } catch (error) {
                console.error("Error fetching current price:", error);
            }
        }

        function clearChart() {
            loadedData = [];
            currentChart.data.labels = [];
            currentChart.data.datasets[0].data = [];
            currentChart.update('none');
        }

        function updateChart(chartType, timeUnit) {
            const visibleData = loadedData.slice(loadedData.length - Math.ceil(loadedData.length * 0.9));
        
            if (chartType === 'line') {
                const prices = visibleData.map(point => ({
                    t: new Date(point.time * 1000),
                    y: point.close
                }));
        
                chartConfig.data.labels = prices.map(point => point.t);
                chartConfig.data.datasets[0].data = prices.map(point => point.y);
            } else if (chartType === 'candlestick') {
                const prices = visibleData.map(point => ({
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
        
            const maxTime = Math.max(...chartConfig.data.labels.map(date => date.getTime()));
            const minTime = Math.min(...chartConfig.data.labels.map(date => date.getTime()));
            const midPoint = maxTime + (maxTime - minTime) / 2;
        
            currentChart.options.scales.x.min = minTime;
            currentChart.options.scales.x.max = midPoint;
        
            const screenWidth = window.innerWidth;
            if (screenWidth > 576) {
                currentChart.options.elements.candlestick = {
                    barThickness: 'flex',
                    categoryPercentage: 1.0,
                    barPercentage: 0.1,
                };
            } else {
                currentChart.options.elements.candlestick = {
                    barThickness: 0.2,
                    categoryPercentage: 0.1,
                    barPercentage: 0.1,
                };
            }
        
            currentChart.update();
        }
        
        const cryptoSelect = document.getElementById('cryptoSelect');
        const timeRangeButtons = document.getElementById('timeRangeButtons');
        let currentRange = '1h';

        cryptoSelect.addEventListener('change', () => {
            clearChart();
            fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
        });
    
        timeRangeButtons.addEventListener('change', (event) => {
            const selectedRange = event.target.value;
            currentRange = selectedRange;
            clearChart();
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
            clearChart();
            createChart();
            updateChart();
            fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
        });

        document.getElementById('cryptoChart').addEventListener('wheel', async (event) => {
            event.preventDefault();
            const deltaY = event.deltaY;
        
            const minDataPoints = 10; // Минимальное количество данных на графике
            const maxDataPoints = 100; // Максимальное количество данных на графике
        
            if (deltaY > 0) { // Scroll down to load more data
                if (loadedData.length < maxDataPoints) {
                    const startTime = loadedData.length ? loadedData[0].time * 1000 : undefined;
                    if (chartType == "candlestick") {
                        currentChart.options.elements.candlestick = {
                            barThickness: 0.1,
                        };
                    }
                    await fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType, startTime);
                }
            } else { // Scroll up to remove data
                if (loadedData.length > minDataPoints) {
                    if (chartType == "candlestick") {
                        currentChart.options.elements.candlestick = {
                            barThickness: 0.1,
                            categoryPercentage: 1.0,
                            barPercentage: 0.1,
                        };
                    }
                    loadedData = loadedData.slice(Math.floor(loadedData.length / 2));
                    updateChart(chartType, currentChart.options.scales.x.time.unit);
                }
            }
        
            // Обновляем min и max для изменения масштаба по оси X
            const firstTime = loadedData[0].time * 1000;
            const rangeChange = (firstTime - currentChart.options.scales.x.min) * 0.1 * (deltaY > 0 ? 1 : -1);
            
            // Ограничения на масштабирование по оси X
            const minScaleRange = 1000 * 60 * 60 * 24; // Минимальный масштаб: 1 день
            const maxScaleRange = 1000 * 60 * 60 * 24 * 30; // Максимальный масштаб: 30 дней
        
            if ((currentChart.options.scales.x.max - rangeChange) - (currentChart.options.scales.x.min + rangeChange) >= minScaleRange &&
                (currentChart.options.scales.x.max - rangeChange) - (currentChart.options.scales.x.min + rangeChange) <= maxScaleRange) {
                
                currentChart.options.scales.x.min += rangeChange;
                currentChart.options.scales.x.max -= rangeChange;
            }
        
            currentChart.update();
            document.getElementById("cryptoChart").focus();
        });
        
        async function fetchAndAppendDataToChart(symbol, range, chartType) {
            
            const endTime = loadedData.length ? loadedData[loadedData.length - 1].time * 1000 : undefined;
            await updatePriceData();
        }

        fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
        
        setInterval(() => fetchAndAppendDataToChart(cryptoSelect.value, currentRange, chartType), 6000);

        const longButton = document.getElementById('longButton');
        const shortButton = document.getElementById('shortButton');
        const canvas = document.getElementById('highlightCanvas');
        const ctx2 = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvasChart = new Chart(ctx2);
            canvas.width = chartCanvas.width;
            canvas.height = chartCanvas.height;
            canvas.style.width = chartCanvas.style.width;
            canvas.style.height = chartCanvas.style.height;
            canvasChart.xMax = currentChart.xMax;
            canvasChart.yMax = currentChart.yMax;
            canvasChart.xMin = currentChart.xMin;
            canvasChart.yMin = currentChart.xMin;
        }
    
        function getYCoordinateForPrice(price) {
            const yScale = currentChart.scales['y'];
            if (!yScale) {
                console.error('Y scale not found');
                return 0;
            }
            return yScale.getPixelForValue(price);
        }
    
        function getCurrentPrice() {
            // Assuming the latest price is the last data point
            const latestDataPoint = loadedData[loadedData.length - 1];
            return latestDataPoint ? latestDataPoint.close : 0;
        }
    
        function highlightLong() {
            const currentPrice = getCurrentPrice();
            const y = getYCoordinateForPrice(currentPrice);
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            ctx2.fillStyle = 'rgba(0, 158, 37, 0.2)';
            ctx2.fillRect(0, 0, canvas.width, y);
        }
    
        function highlightShort() {
            const currentPrice = getCurrentPrice();
            const y = getYCoordinateForPrice(currentPrice);
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            ctx2.fillStyle = 'rgba(255, 0, 0, 0.2)';
            ctx2.fillRect(0, y, canvas.width, canvas.height - y - 200);
        }
    
        function clearHighlight() {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
        }
    
        longButton.addEventListener('mouseenter', highlightLong);
        longButton.addEventListener('mouseleave', clearHighlight);
        shortButton.addEventListener('mouseenter', highlightShort);
        shortButton.addEventListener('mouseleave', clearHighlight);
        longButton.addEventListener('click', () => addHorizontalLine('long'));
        shortButton.addEventListener('click', () => addHorizontalLine('short'));
        
        window.addEventListener('resize', resizeCanvas);
        currentChart.update();
        resizeCanvas();
        function addHorizontalLine(type) {
            
            const currentPrice = loadedData[loadedData.length - 1].close; // Текущая цена из последних данных
            const color = type === 'long' ? 'green' : 'red';
            const annotation = {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y',
                value: currentPrice,
                borderColor: color,
                borderWidth: 2,
                label: {
                    enabled: true,
                    content: `${type.toUpperCase()} @ ${currentPrice}`,
                }
            };
            if (!currentChart.options.plugins.annotation) {
                currentChart.options.plugins.annotation = {
                    annotations: []
                };
            }
        
            // Добавление новой аннотации
            if (currentChart.options.plugins.annotation.annotations.length === 0) {
                currentChart.options.plugins.annotation.annotations.push(annotation);
                startTimer();
                hideProfitMenu();
            }
        
            // Обновление графика
            currentChart.update();
        }

        function startTimer() {
            const hours = parseInt(document.getElementById('hours').value, 10);
            const minutes = parseInt(document.getElementById('minutes').value, 10);
            const seconds = parseInt(document.getElementById('seconds').value, 10);
            const totalTime = (hours * 3600) + (minutes * 60) + seconds;
    
            let timeLeft = totalTime;
            const timer = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    currentChart.options.plugins.annotation.annotations = [];
                    return;
                }
    
                timeLeft--;
            }, 1000);
        }

        function hideProfitMenu() {
            const profitMenu = document.getElementById('profitMenu');
            profitMenu.style.top = '-100px';
            setTimeout(() => {
                profitMenu.style.display = 'none';
            }, 500); // Time must match the transition duration in CSS
        }
    });
