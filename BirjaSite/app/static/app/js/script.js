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
const volumeCtx = document.getElementById('volumeChart').getContext('2d');
let volumeChart;

let pointsChecked = false;
let fillChecked = false;
let volumeChecked = false;
let emaSmaChecked = false;

const cryptoSelect = document.getElementById('cryptoSelect');
let currentRange = '1h';

const chartConfig = {
    type: chartType,  // Ваш тип графика (например, 'candlestick')
    data: {
        labels: [],  // Метки времени (например, ['2023-01-01', '2023-01-02', ...])
        datasets: [
            {
                data: [],  // Данные для основного графика (свечи или бары)
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
                color: {
                    up: '#249D92',
                    down: '#C95454',
                    unchanged: '#999999'
                },
                barThickness: 'flex',
                barPercentage: 1,
                categoryPercentage: 0.8,
                backgroundColors: {
                    up: 'rgba(69, 183, 52, 0.8)',
                    down: 'rgba(255,62,31, 1)',
                    unchanged: 'rgba(201, 203, 207, 1)',
                },
                borderColors: {
                    up: 'rgb(75, 192, 192)',
                    down: 'rgb(255, 99, 132)',
                    unchanged: 'rgb(201, 203, 207)',
                }
            },
            
        ],
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
                    tooltipFormat: 'll',
                },
                ticks: {
                    color: 'white',
                    maxRotation: 0,
                    minRotation: 0,
                },
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.05)',
                    lineWidth: 1,
                }
            },
            y: {
                beginAtZero: false,  // Ось для цены
                position: 'right',
                ticks: {
                    color: 'white',
                    font: {
                        size: 16 // задаем размер шрифта здесь
                    },
                    callback: function(value) {
                        // Дополнительная настройка для отображения значений
                        return value.toFixed(2);
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.05)',
                    lineWidth: 1,
                }
            },
        },
        plugins: {
            crosshair: false,
            annotation: {
                annotations: {
                    horizontalLine: {
                        type: 'line',
                        drawTime: 'afterDatasetsDraw',
                        borderColor: 'rgba(75, 192, 192, 0.8)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            enabled: true,
                            content: 'Price',
                            position: 'start',
                            backgroundColor: 'rgba(75, 192, 192, 0.8)',
                            color: '#fff',
                            font: {
                                size: 12
                            }
                        }
                    },
                    verticalLine: {
                        type: 'line',
                        drawTime: 'afterDatasetsDraw',
                        borderColor: 'rgba(75, 192, 192, 0.8)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                    }
                }
            },
            legend: {
                display: false  // Отключение легенды
            },
            zoom: {
                pan: {
                    enabled: false,
                },
                zoom: {
                    wheel: {
                        enabled: false,
                    },
                    drag: {
                        enabled: false,
                    },
                    pinch: {
                        enabled: false,
                    },
                    mode: 'x',
                },
                zoomLevel: 0
            }
        },
        elements: {
            point: {
                radius: 0,
                hitRadius: 5,
                hoverRadius: 5,
            },
            bar: {
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            }
        },
        onHover: (event, chartElement) => {
            const chart = event.chart;
        
            // Получаем координаты X и Y в зависимости от положения курсора
            const xValue = chart.scales.x.getValueForPixel(event.x);
            const yValue = chart.scales.y.getValueForPixel(event.y);
        
            // Ограничиваем X и Y значениями в пределах графика
            const xMinLimit = chart.scales.x.min;
            const xMaxLimit = chart.scales.x.max;
            const yMinLimit = chart.scales.y.min;
            const yMaxLimit = chart.scales.y.max;
        
            const boundedXValue = Math.max(Math.min(xValue, xMaxLimit), xMinLimit);
            const boundedYValue = Math.max(Math.min(yValue, yMaxLimit), yMinLimit);
        
            // Обновляем координаты аннотаций
            chart.options.plugins.annotation.annotations.horizontalLine.yMin = boundedYValue;
            chart.options.plugins.annotation.annotations.horizontalLine.yMax = boundedYValue;
        
            chart.options.plugins.annotation.annotations.verticalLine.xMin = boundedXValue;
            chart.options.plugins.annotation.annotations.verticalLine.xMax = boundedXValue;
        
            // Обновляем график
            chart.update();
        }
    }
};

const volumeChartConfig = {
    type: 'bar',  // Тип графика - столбчатый
    data: {
        labels: [],  // Метки времени
        datasets: [{
            label: 'Volume',
            data: [],  // Данные по объемам
            backgroundColor: 'rgba(69, 183, 52, 0.8)',  // Цвет баров
            borderColor: 'rgba(69, 183, 52, 1)',  // Цвет границы баров
            borderWidth: 1,  // Толщина границы
            barThickness: 'flex',
            barPercentage: 1,
            categoryPercentage: 0.8,
            backgroundColor: 'rgba(36, 78, 117, 1)',
            borderRadius: 2,
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'll',
                },
                ticks: {
                    display: false,
                    color: 'rgba(255, 255, 255, 0)',
                    maxRotation: 0,
                    minRotation: 0,
                },
                grid: {
                    display: false,
                    color: 'rgba(255, 255, 255, 0.05)',
                    lineWidth: 1,
                }
            },
            y: {
                beginAtZero: true,  // Ось для цены
                position: 'right',
                ticks: {
                    color: 'rgba(255, 255, 255, 0)',
                    font: {
                        size: 16 // задаем размер шрифта здесь
                    },
                    callback: function(value) {
                        // Дополнительная настройка для отображения значений
                        return value.toFixed(2);
                    }
                },
                grid: {
                    display: false,
                    color: 'rgba(255, 255, 255, 0.05)',
                    lineWidth: 1,
                }
            },
        },
        plugins: {
            legend: {
                display: false  // Скрываем легенду
            }
        },
        elements: {
            bar: {
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            }
        }
    }
};

const highlightChartConfig = {
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
};

const canvas = document.getElementById('highlightCanvas');
const ctx2 = canvas.getContext('2d');
let canvasChart;

function createChart() {
    if (currentChart) {
        if (!volumeChecked && volumeChart) {
            volumeChart.destroy();
            fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
        }
        if (!volumeChart) {
            volumeChart = new Chart(volumeCtx, volumeChartConfig);
        }
        if (volumeChart) {
            volumeChart.destroy();
        }
        if (!emaSmaChecked && currentChart.data.datasets[1]) {
            currentChart.data.datasets[1].data = [];
            currentChart.data.datasets[2].data = [];
            currentChart.update();
        }
        currentChart.destroy();
        canvasChart.destroy();
    }
    currentChart = new Chart(ctx, chartConfig);
    if (volumeChecked) {
        volumeChart = new Chart(volumeCtx, volumeChartConfig);
        fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
    }
    if (emaSmaChecked) {
        fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
    }
    canvasChart = new Chart(ctx2, highlightChartConfig);
    
}

createChart();

    let loadedData = [];
    // Обновленная функция для открытия позиции
    
    let interval;
    const apiKey = 'b2f300377672777aa258f397ac6c22f5c1fa12191e41ac68f82196aadf99478c';
    let timeUnit;
    let limit;
    let url;
    const currency = 'USD';

    async function fetchAndAddDataToChart(symbol, range, chartType, startTime, append = false, isInterval = false) {
        const screenWidth = window.innerWidth;
        currentChart.options.scales.x.time.unit = timeUnit;
        switch (range) {
            case '6M':
                if (!isInterval) {
                    interval = screenWidth > 576 ? 7 : 25;
                    limit = 210;
                    timeUnit = 'day';
                    url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                }
                console.log(1);
                break;
            case '1M':
                if (!isInterval) {
                    interval = screenWidth > 576 ? 25 : 100;
                    limit = 1000;
                    timeUnit = 'day';
                    url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                }
                break;
            case '1W':
                if (!isInterval) {
                    interval = screenWidth > 576 ? 3 : 20;
                    limit = 250;
                    timeUnit = 'hour';
                    url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                }
                break;
            case '1D':
                if (!isInterval) {
                    interval = screenWidth > 576 ? 4 : 45;
                    limit = 360;
                    timeUnit = 'minute';
                    url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                }
                break;
            case '1H':
                if (!isInterval) {
                    interval = screenWidth > 576 ? 2 : 10;
                    limit = 75;
                    timeUnit = 'minute';
                    url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                }
                break;
            default:
                if (!isInterval) {
                    interval = screenWidth > 576 ? 2 : 10;
                    limit = 75;
                    timeUnit = 'minute';
                    url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                }
                break;
        }

        if (startTime && !isNaN(startTime)) {
            const toTs = Math.floor(startTime / 1000);
            url += `&toTs=${toTs}`;
        }
    
        try {
            const response = await fetch(url);
            const data = await response.json();
        
            if (data.Response === "Success") {
                let newData = [];
                let volumes = [];
                for (let i = data.Data.Data.length; i > 0; i -= interval) {
                    const intervalData = data.Data.Data.slice(i, i + interval);
                    
                    if (intervalData.length > 0) {
                        const endOfIntervalData = intervalData[intervalData.length - 1];
                        // Собираем данные по объемам
                        const totalVolume = intervalData.reduce((sum, point) => sum + point.volumefrom, 0);
                        if (intervalData.length === 1) {
                            newData.push({
                                time: endOfIntervalData.time,
                                open: endOfIntervalData.open,
                                high: endOfIntervalData.high,
                                low: endOfIntervalData.low,
                                close: endOfIntervalData.close,
                                volume: totalVolume
                            });
                        } else {
                            newData.push({
                                time: endOfIntervalData.time,
                                open: intervalData[0].open,
                                high: Math.max(...intervalData.map(point => point.high)),
                                low: Math.min(...intervalData.map(point => point.low)),
                                close: endOfIntervalData.close,
                                volume: totalVolume 
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
        
                // Обновляем данные по объемам
                volumes = currentChart.data.datasets[0].data.map(point => ({
                    x: new Date(point.time * 1000),
                    y: point.volume
                }));
                
                
                volumeChart.data.datasets[0].data = volumes;
                updateChart(chartType, timeUnit);
                updatePriceData();

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
            const apiEndpoint = 'https://min-api.cryptocompare.com/data/v2/';
            // Используем histominute для получения последних данных
            const response = await fetch(`${apiEndpoint}histominute?fsym=${crypto}&tsym=USD&limit=1&api_key=${apiKey}`);
            const data = await response.json();
            const latestData = data.Data.Data[0];
            
            // Получаем необходимые значения
            const currentOpen = latestData.open;
            const currentHigh = latestData.high;
            const currentLow = latestData.low;
            const currentClose = latestData.close;
            const currentVolume = latestData.volumefrom;
            const currentTime = Date.now(); // Время в секундах
    
            // Если есть загруженные данные
            if (loadedData.length > 0) {
                const lastDataPoint = loadedData[loadedData.length - 1];
                const timeDifference = (currentTime - new Date(currentChart.data.datasets[0].data.at(-1).x).getTime());
                const intervalMilliseconds = convertIntervalToMilliseconds(interval, timeUnit);
                if (timeDifference >= intervalMilliseconds) {
                    // Добавить новую точку данных
                    const newDataPoint = {
                        time: currentTime,
                        open: currentOpen,
                        high: currentHigh,
                        low: currentLow,
                        close: currentClose,
                        volume: currentVolume
                    };

                    const newDataPoint2 = {
                        x: new Date(currentTime),
                        o: currentOpen,
                        h: currentHigh,
                        l: currentLow,
                        c: currentClose,
                        volume: currentVolume
                    };
                    
                    let val = Math.log10(newDataPoint2.c);
                    let volumePoint = currentVolume;
                
                    // Приведение объема к масштабу цены
                    while (Math.log10(volumePoint) < val) {
                        volumePoint *= 10;
                    }
                
                    newDataPoint2.volume = volumePoint;
                    newDataPoint.volume = volumePoint;
                    
                    //loadedData.push(newDataPoint2);
                    
                    if (chartType === 'candlestick' || chartType === 'ohlc') {
                        currentChart.data.datasets[0].data.push(newDataPoint2);
                    } else {
                        currentChart.data.datasets[0].data.push(newDataPoint.close);
                    }
                    currentChart.update();
                    volumeChart.data.datasets[0].data.shift();
                    
                    volumeChart.data.datasets[0].data.push({x: new Date(currentTime), y: currentVolume * 10000});

                    if (currentChart.data.labels) {
                        loadedData.shift();
                        currentChart.data.datasets[0].data.shift();
                        currentChart.options.scales.x.min += convertIntervalToMilliseconds(interval, timeUnit); // Сдвиг начала оси X на 1 минуту вперед
                        currentChart.options.scales.x.max += convertIntervalToMilliseconds(interval, timeUnit);
                        volumeChart.options.scales.x.min += convertIntervalToMilliseconds(interval, timeUnit); // Сдвиг начала оси X на 1 минуту вперед
                        volumeChart.options.scales.x.max += convertIntervalToMilliseconds(interval, timeUnit);
                        volumeChart.update();
                        currentChart.update();
                    }              
                    console.log(volumeChart.data.datasets[0].data);
                    console.log(currentChart.data.datasets[0].data)     
                } else {
                    // Обновить последнюю точку данных
                    const index = currentChart.data.datasets[0].data.length - 1;
                    const lastDataPoint2 = currentChart.data.datasets[0].data[index];
                    lastDataPoint2.c = currentClose;
                    lastDataPoint2.h = lastDataPoint.high;
                    lastDataPoint2.l = lastDataPoint.low;

                    lastDataPoint.close = currentClose;
                    lastDataPoint.high = lastDataPoint.high;
                    lastDataPoint.low = lastDataPoint.low;
                    // Обновляем последнюю точку в графике
                    if (chartType == 'candlestick' || chartType === 'ohlc') {
                         currentChart.data.datasets[0].data[index] = lastDataPoint2;
                    } else {
                        currentChart.data.datasets[0].data[index] = lastDataPoint.close;
                    }

                    let val = Math.log10(lastDataPoint2.c);
                    let volumePoint = currentVolume;
                
                    // Приведение объема к масштабу цены
                    while (Math.log10(volumePoint) < val) {
                        volumePoint *= 10;
                    }

                    volumeChart.data.datasets[0].data[index].y = volumePoint;
                    volumeChart.update(); 
                }
            } else {
                // Если данных еще нет, добавить первую точку данных
                const newDataPoint = {
                    time: new Date(currentTime),
                    open: currentPrice,
                    high: currentPrice,
                    low: currentPrice,
                    close: currentPrice
                };
                loadedData.push(newDataPoint);
    
                // Добавляем первую точку в график
                currentChart.data.datasets[0].data.push(newDataPoint);
            }
    
            // Обновление графика после добавления или изменения данных
            currentChart.update();
            if (volumeChecked) {
                volumeChart.options.scales.x.time.unit = timeUnit;
                volumeChart.data.labels = currentChart.data.labels;
                volumeChart.options.scales.x.min = currentChart.options.scales.x.min; // Сдвиг начала оси X на 1 минуту вперед
                volumeChart.options.scales.x.max = currentChart.options.scales.x.max;
                volumeChart.data.datasets[0].data = currentChart.data.datasets[0].data.map(point => ({
                    x: point.x,
                    y: point.volume
                }));
                volumeChart.update();
            }
            console.log(volumeChart.data.datasets[0].data);
            console.log(currentChart.data.datasets[0].data);
        } catch (error) {
            console.error("Error fetching current price:", error);
        }
    }

    function clearChart() {
        loadedData = [];
        currentChart.data.labels = [];
        currentChart.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        chartConfig.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        currentChart.update('none');
    }

    function updateChart(chartType, timeUnit) {
        const visibleData = loadedData.slice(loadedData.length - Math.ceil(loadedData.length * 0.9));
        
        // Обновление основного графика (цены)
        if (chartType === 'line') {
            const prices = visibleData.map(point => ({
                t: new Date(point.time * 1000),
                y: point.close
            }));
    
            chartConfig.data.labels = prices.map(point => point.t);
            chartConfig.data.datasets[0].data = prices.map(point => point.y);
        } else if (chartType === 'candlestick' || chartType === 'ohlc') {
            const prices = visibleData.map(point => ({
                t: new Date(point.time * 1000),
                o: point.open,
                h: point.high,
                l: point.low,
                c: point.close,
                volume: point.volume
            }));
            chartConfig.data.labels = prices.map(point => point.t);
            chartConfig.data.datasets[0].data = prices.map(point => {
                let val = Math.log10(point.c);
                let volume = point.volume;
            
                // Приведение объема к масштабу цены
                while (Math.log10(volume) < val) {
                    volume *= 10;
                }
            
                return {
                    x: point.t,
                    o: point.o,
                    h: point.h,
                    l: point.l,
                    c: point.c,
                    volume: volume // Возвращаем конечное значение объема
                };
            });
        }
    
        chartConfig.options.scales.x.time.unit = timeUnit;
    
        // Центрирование последнего значения графика цен
        const maxTime = Math.max(...chartConfig.data.labels.map(date => date.getTime()));
        const minTime = Math.min(...chartConfig.data.labels.map(date => date.getTime()));
        const midPoint = maxTime + (maxTime - minTime) / 2;
    
        currentChart.options.scales.x.min = minTime;
        currentChart.options.scales.x.max = midPoint;
    
        // Обновление графика объемов
        const volumes = visibleData.map(point => ({
            x: new Date(point.time * 1000),
            y: point.volume  // Объем
        }));
    
        // Проверяем, существует ли график объемов
        if (volumeChecked) {
            volumeChart.data.labels = visibleData.map(point => new Date(point.time * 1000));
            volumeChart.data.datasets[0].data = volumes;
            volumeChart.options.scales.x.time.unit = timeUnit;
            
            // Центрируем последнее значение графика объемов
            const maxVolumeTime = Math.max(...volumeChart.data.labels.map(date => date.getTime()));
            const minVolumeTime = Math.min(...volumeChart.data.labels.map(date => date.getTime()));
            const midVolumePoint = maxVolumeTime + (maxVolumeTime - minVolumeTime) / 2;
    
            volumeChart.options.scales.x.min = minVolumeTime;
            volumeChart.options.scales.x.max = midVolumePoint;
    
            // Обновляем график объемов
            volumeChart.update();
        }

    if (emaSmaChecked) {
        const smaData = calculateSMA(loadedData, 5);  // Период 20
        const emaData = calculateEMA(loadedData, 5);  // Период 20
        
        chartConfig.data.datasets[1] = {
            label: 'SMA 20',
            data: visibleData.map((point, index) => ({
                x: new Date(point.time * 1000),
                y: smaData[index + (loadedData.length - visibleData.length)]
            })),
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 2,
            fill: false,
            type: 'line'
        };

        // Добавляем EMA на график
        chartConfig.data.datasets[2] = {
            label: 'EMA 20',
            data: visibleData.map((point, index) => ({
                x: new Date(point.time * 1000),
                y: emaData[index + (loadedData.length - visibleData.length)]
            })),
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: false,
            type: 'line'
        };
    }
    // Добавляем SMA на график
    currentChart.update();
    }

    cryptoSelect.addEventListener('change', () => {
        clearChart();

        fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
        updateAnnotationsWithNewBounds(currentChart);
    });

    function handleChartTypeClick(Type) {
        chartType = Type;
        chartConfig.type = chartType;
        chartConfig.data.datasets[0].type = chartType;
        chartConfig.data.datasets[0].backgroundColor = chartType === 'line' ? 'rgba(75, 192, 192, 0)' : undefined;
        chartConfig.data.datasets[0].borderColor = chartType === 'line' ? 'rgba(75, 192, 192, 1)' : undefined;
        chartConfig.data.datasets[0].borderWidth = chartType === 'line' ? 1 : undefined;
        chartConfig.data.datasets[0].fill = chartType === 'line';
        clearChart();
        createChart();
        updateChart();
        fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType, undefined, false, false);
        // Ваш код для обработки изменения типа графика
    }
    
    // Добавляем обработчики событий для всех кнопок типа графика
    document.querySelectorAll('.chart-type').forEach(button => {
        button.addEventListener('click', function() {
            const chartType = this.getAttribute('data-chart-type');
            handleChartTypeClick(chartType);
        });
    });

    function handleIntervalClick(inter) {
        currentRange = inter;
        console.log(chartType)
        clearChart();
        createChart();
        updateChart();
        
        fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
        updateAnnotationsWithNewBounds(currentChart);
    }
    
    // Добавляем обработчики событий для всех кнопок интервала
    document.querySelectorAll('.interval').forEach(button => {
        button.addEventListener('click', function() {
            const inter = this.getAttribute('data-interval');
            handleIntervalClick(inter);
        });
    });

    document.getElementById('cryptoChart').addEventListener('wheel', async (event) => {
        event.preventDefault();
        const deltaY = event.deltaY;
    
        const minDataPoints = 10; // Минимальное количество данных на графике
        const maxDataPoints = 100; // Максимальное количество данных на графике
    
        if (deltaY > 0) { // Scroll down to load more data
            if (loadedData.length < maxDataPoints) {
                const startTime = loadedData.length ? loadedData[0].time * 1000 : undefined;
                
                await fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType, startTime);
            }
        } else { // Scroll up to remove data
            if (loadedData.length > minDataPoints) {
                
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
    });;
    
    async function fetchAndAppendDataToChart(symbol, range, chartType) {
        await updatePriceData();
    }

    fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType);
    updateAnnotationsWithNewBounds(currentChart);
    
    setInterval(() => fetchAndAppendDataToChart(cryptoSelect.value, currentRange, chartType), 6000);
    chartType = 'candlestick';
    handleChartTypeClick('candlestick');
    const togglePoints = document.getElementById('toggle-points');
    const toggleFill = document.getElementById('toggle-fill');
    const toggleVolumes = document.getElementById('toggle-volumes');
    const toggleSmaEma = document.getElementById('toggle-sma-ema');

    function handlePointsToggle(isChecked) {
        if (isChecked) {
            console.log("Points enabled");
            chartConfig.options.elements.point = {
                radius: 2,
                hitRadius: 5,
                hoverRadius: 5,
            }
            // Ваш код для включения точек
        } else {
            console.log("Points disabled");
            chartConfig.options.elements.point = {
                radius: 0,
                hitRadius: 5,
                hoverRadius: 5,
            }
            // Ваш код для отключения точек
        }
        createChart();
    }
    
    function handleFillToggle(isChecked) {
        if (isChecked) {
            console.log("Fill enabled");
            chartConfig.data.datasets[0].backgroundColor = 'rgba(75, 192, 192, 0.5)';

            // Ваш код для включения заливки
        } else {
            console.log("Fill disabled");
            chartConfig.data.datasets[0].backgroundColor = 'rgba(0,0,0,0)';

            // Ваш код для отключения заливки
        }
        createChart();
    }
    
    function handleVolumesToggle(isChecked) {
        if (isChecked) {
            console.log("Volumes enabled");
            volumeChecked = true;
            // Ваш код для включения объемов
        } else {
            console.log("Volumes disabled");
            volumeChecked = false;
            // Ваш код для отключения объемов
        }
        createChart();
    }

    function handleSmaEmaToggle(isChecked) {
        if (isChecked) {
            console.log("EmaSma enabled");
            emaSmaChecked = true
            // Ваш код для включения объемов
        } else {
            console.log("EmaSma disabled");
            emaSmaChecked = false;
            // Ваш код для отключения объемов
        }
        createChart();
    }
    
    // Добавляем слушатели событий для переключателей
    togglePoints.addEventListener('change', function() {
        handlePointsToggle(this.checked);
    });
    
    toggleFill.addEventListener('change', function() {
        handleFillToggle(this.checked);
    });
    
    toggleVolumes.addEventListener('change', function() {
        handleVolumesToggle(this.checked);
    });

    toggleSmaEma.addEventListener('change', function() {
        handleSmaEmaToggle(this.checked);
    });

    const longButton = document.getElementById('longButton');
    const shortButton = document.getElementById('shortButton');
    function resizeCanvas() {
        if (currentChart) {
            canvasChart.xMax = currentChart.xMax;
            canvasChart.yMax = currentChart.yMax;
            canvasChart.xMin = currentChart.xMin;
            canvasChart.yMin = currentChart.yMin;
        } else {
            console.error("currentChart is not defined or is undefined.");
        }
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
        ctx2.fillRect(0, y, canvas.width, canvas.height - y);
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
        const hours = parseInt(document.getElementById('hours').value, 10);
        const minutes = parseInt(document.getElementById('minutes').value, 10);
        const seconds = parseInt(document.getElementById('seconds').value, 10);
        const totalTime = (hours * 3600) + (minutes * 60) + seconds;

        const annotation = {
            type: 'line',
            yMin: currentPrice,  // Устанавливаем начальную точку линии по оси Y
            yMax: currentPrice,  // Устанавливаем конечную точку линии по оси Y (та же цена)
            borderColor: color,
            borderWidth: 2,
            borderDash: [5, 5],  // Пунктирная линия
            label: {
                enabled: true,
                content: `${type.toUpperCase()} @ ${currentPrice}`,
                position: 'start',  // Позиция текста
                backgroundColor: color,
                color: '#fff',  // Цвет текста
                font: {
                    size: 12
                }
            }
        };
    
        // Проверяем, инициализированы ли аннотации
        if (!currentChart.options.plugins.annotation) {
            currentChart.options.plugins.annotation = {
                annotations: {}
            };
        }
    
        // Ограничение на количество аннотаций (например, до 6)
        if (Object.keys(currentChart.options.plugins.annotation.annotations).length <= 2 && totalTime > 30) {
            const annotationId = `annotation_${Date.now()}`; // Генерируем уникальный ID для аннотации
            currentChart.options.plugins.annotation.annotations[annotationId] = annotation;
            startTimer();  // Запуск таймера
            hideProfitMenu();  // Скрытие меню прибыли
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
                const annotations = currentChart.options.plugins.annotation.annotations;
                const annotationKeys = Object.keys(annotations);
                const lastKey = annotationKeys[annotationKeys.length - 1];
                delete annotations[lastKey];
                currentChart.update();
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

    function calculateSMA(data, period) {
        let sma = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                sma.push(null);  // Недостаточно данных для полного периода
            } else {
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    sum += data[i - j].close;
                }
                sma.push(sum / period);
            }
        }
        return sma;
    }

    function calculateEMA(data, period) {
        let ema = [];
        const multiplier = 2 / (period + 1);
        
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                ema.push(null);  // Недостаточно данных для полного периода
            } else if (i === period - 1) {
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    sum += data[i - j].close;
                }
                ema.push(sum / period);  // Первая точка EMA — это SMA
            } else {
                const prevEma = ema[i - 1];
                const currentClose = data[i].close;
                ema.push((currentClose - prevEma) * multiplier + prevEma);
            }
        }
        return ema;
    }

    const intervalButton = document.getElementById('interval-toggle-2');;
    
    intervalButton.addEventListener('click', function(event) {
        document.querySelectorAll('.interval-2').forEach(button => {
            button.addEventListener('click', function() {
                const interval2 = this.getAttribute('data-interval');
                const symbol = cryptoSelect.value;
                switch (interval2) {
                    case '1M':
                        interval = 1;
                        limit = 60;
                        timeUnit = 'minute'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '2M':
                        interval = 2;
                        limit = 60;
                        timeUnit = 'minute'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '5M':
                        interval = 5;
                        limit = 60;
                        timeUnit = 'minute'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '10M':
                        interval = 10;
                        limit = 60;
                        timeUnit = 'minute'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '30M':
                        interval = 30;
                        limit = 1440;
                        timeUnit = 'hour'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '1H':
                        interval = 1;
                        limit = 24;
                        timeUnit = 'hour'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '2H':
                        interval = 2;
                        limit = 24;
                        timeUnit = 'hour'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '3H':
                        interval = 3;
                        limit = 24;
                        timeUnit = 'hour'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '4H':
                        interval = 4;
                        limit = 168;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '6H':
                        interval = 6;
                        limit = 168;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '12H':
                        interval = 12;
                        limit = 168;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '1D':
                        interval = 1;
                        limit = 7;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '2D':
                        interval = 2;
                        limit = 31;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '3D':
                        interval = 3;
                        limit = 31;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '5D':
                        interval = 5;
                        limit = 31;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '7D':
                        interval = 7;
                        limit = 31;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '10D':
                        interval = 10;
                        limit = 372;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '14D':
                        interval = 14;
                        limit = 372;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '21D':
                        interval = 21;
                        limit = 372;
                        timeUnit = 'day'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                    case '1MTH':
                        interval = 31;
                        limit = 372;
                        timeUnit = 'month'; 
                        url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&api_key=${apiKey}`;
                        break;
                }
                clearChart();
                
                fetchAndAddDataToChart(cryptoSelect.value, currentRange, chartType, undefined, false, true);
                console.log(loadedData);
            });
        });
    });
    
    function updateAnnotationsWithNewBounds(chart) {
        chart.options.plugins.annotation.annotations = {};
        
        // Обновляем границы графика
        
        // Обновляем значения для аннотаций
        // Обновляем график
        setTimeout(() => {
            const xMinLimit = chart.scales.x.min;
            const xMaxLimit = chart.scales.x.max;
            const yMinLimit = chart.scales.y.min;
            const yMaxLimit = chart.scales.y.max;
    
            chart.options.plugins.annotation.annotations = {
                horizontalLine: {
                    type: 'line',
                    yMin: yMinLimit,
                    yMax: yMinLimit,
                    drawTime: 'afterDatasetsDraw',
                    borderColor: 'rgba(75, 192, 192, 0.8)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    label: {
                        enabled: true,
                        content: 'Price',
                        position: 'start',
                        backgroundColor: 'rgba(75, 192, 192, 0.8)',
                        color: '#fff',
                        font: {
                            size: 12
                        }
                    }
                },
                verticalLine: {
                    type: 'line',
                    drawTime: 'afterDatasetsDraw',
                    borderColor: 'rgba(75, 192, 192, 0.8)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    xMin: xMinLimit,
                    xMax: xMaxLimit
                }
            }
            chart.update();
        }, 100)
    }

    
});