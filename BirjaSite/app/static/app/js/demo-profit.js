document.addEventListener("DOMContentLoaded", function() {
    async function fetchLatestProfit() {
        try {
            const response = await fetch('latest-demo-profit/');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching latest profit:", error);
        }
    }

    function showProfitMenu(profit, date) {
        const profitMenu = document.getElementById('profitMenu');
        profitMenu.innerHTML = `<strong>Latest Profit:</strong> $${profit} on ${new Date(date).toLocaleString()}`;
        profitMenu.style.display = 'block';
        setTimeout(() => {
            profitMenu.style.top = '10px';
        }, 10);
    }

    async function updateProfitMenu() {
        const latestProfitData = await fetchLatestProfit();
        if (latestProfitData) {
            showProfitMenu(latestProfitData.profit, latestProfitData.date);
        }
    }

    updateProfitMenu();
});
