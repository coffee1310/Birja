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
                label: 'Bitcoin Price (USD)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'll'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    function fetchAndAddDataToChart() {
        fetch('/get_blockchain_data/')  // Путь к вашему Django view
    .then(response => response.json())
    .then(data => {
        // Обработка полученных данных и добавление их в график
        console.log(data);
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

    // Инициализируем загрузку данных при загрузке страницы
    fetchAndAddDataToChart();

    // Обновляем данные каждые 2 минуты
    setInterval(fetchAndAddDataToChart, 120000); // 120000 мс = 2 минуты
});