document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById('menu-toggle');
    const settingsMenu = document.getElementById('settings-menu');

    menuToggle.addEventListener('click', function() {
        settingsMenu.classList.toggle('hidden');
    });

    const menuItems = document.querySelectorAll('.menu-content button');
    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            settingsMenu.classList.add('hidden');
        });
    });
});