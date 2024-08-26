document.addEventListener("DOMContentLoaded", function() {
    const openBtn = document.getElementById("openHistoryBtn");
    const closeBtn = document.getElementById("closeHistoryBtn");
    const applyFiltersBtn = document.getElementById("applyFilters");

    openBtn.addEventListener("click", function() {
        openTradeHistoryMenu();
    });

    closeBtn.addEventListener("click", function() {
        closeTradeHistoryMenu();
    });

    applyFiltersBtn.addEventListener("click", function() {
        applyFilters();
    });

    function openTradeHistoryMenu() {
        const tradeHistoryMenu = document.getElementById("tradeHistoryMenu");
        tradeHistoryMenu.style.width = "300px";
        fetchTradeHistory();
    }

    function closeTradeHistoryMenu() {
        const tradeHistoryMenu = document.getElementById("tradeHistoryMenu");
        tradeHistoryMenu.style.width = "0";
    }

    function fetchTradeHistory() {
        const status = document.getElementById('status').value;
        const sortBy = document.getElementById('sort').value;

        fetch(`/trade-demo-history/?status=${status}&sort_by=${sortBy}`)
            .then(response => response.json())
            .then(data => {
                const betHistory = document.getElementById('betHistory');
                betHistory.innerHTML = '';
                data.forEach(bet => {
                    const betDiv = document.createElement('div');
                    betDiv.classList.add('bet-item');
                    
                    // Создаем отдельные блоки для каждого поля
                    const dateDiv = document.createElement('div');
                    dateDiv.textContent = `Date: ${bet.open_time}`;
                    dateDiv.classList.add('field');
                    
                    const amountDiv = document.createElement('div');
                    amountDiv.textContent = `Amount: ${bet.amount}`;
                    amountDiv.classList.add('field');
                    
                    const coefficientDiv = document.createElement('div');
                    coefficientDiv.textContent = `Coefficient: 80%`;
                    coefficientDiv.classList.add('field');
                    
                    const profit = (bet.amount * bet.profit).toFixed(2);
                    const profitDiv = document.createElement('div');
                    profitDiv.textContent = `Profit: ${profit}`;
                    profitDiv.classList.add('field');
                    profitDiv.style.color = profit >= 0 ? 'green' : 'red'; // Установка цвета текста
                    
                    // Добавляем все блоки в основной блок
                    betDiv.appendChild(dateDiv);
                    betDiv.appendChild(amountDiv);
                    betDiv.appendChild(coefficientDiv);
                    betDiv.appendChild(profitDiv);
                    
                    betHistory.appendChild(betDiv);
                });
            })
            .catch(error => console.error('Error fetching trade history:', error));
    }

    function applyFilters() {
        fetchTradeHistory();
    }
});
