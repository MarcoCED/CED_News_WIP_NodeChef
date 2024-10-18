document.addEventListener("DOMContentLoaded", function () {
    const mainWireContainer = document.getElementById('main-wire');

    // Sidebar hover expansion
    document.querySelectorAll('.Menulist li').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('expanded');
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('expanded');
        });
    });

    // Fetch user's location and display the correct country flag before the clock
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const countryCode = data.country_code.toLowerCase();
            const userLocationFlag = document.getElementById('user-location-flag');
            userLocationFlag.src = `https://flagcdn.com/w20/${countryCode}.png`;
            userLocationFlag.alt = `${data.country_name} Flag`;
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
        });

    // Clock Functionality with UTC offset
    function updateClock() {
        const clockElement = document.getElementById('clock');
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const utcOffset = now.getTimezoneOffset() / -60;
        const utcOffsetString = `UTC${utcOffset >= 0 ? "+" : ""}${utcOffset}`;
        clockElement.textContent = `${hours}:${minutes}:${seconds} (${utcOffsetString})`;
    }

    setInterval(updateClock, 1000);
    updateClock();
});
