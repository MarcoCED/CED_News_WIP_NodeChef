document.addEventListener("DOMContentLoaded", function() {
    // Sidebar hover expansion
    document.querySelectorAll('.Menulist li').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('expanded');
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('expanded');
        });
    });

    // Dropdown toggle functionality
    const toggles = document.querySelectorAll('.toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('expanded');
            const nextElement = this.nextElementSibling;
            if (nextElement && nextElement.tagName === 'UL') {
                if (this.classList.contains('expanded')) {
                    nextElement.style.display = 'block';
                    nextElement.style.height = nextElement.scrollHeight + 'px';
                    nextElement.style.opacity = '1';
                    nextElement.style.visibility = 'visible';
                } else {
                    nextElement.style.height = '0';
                    nextElement.style.opacity = '0';
                    nextElement.style.visibility = 'hidden';
                    setTimeout(() => {
                        nextElement.style.display = 'none';
                    }, 300);
                }
                this.setAttribute('aria-expanded', this.classList.contains('expanded') ? 'true' : 'false');
            }
        });
    });

    // Fetch user's location and display the correct country flag before the clock
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const countryCode = data.country_code.toLowerCase(); // Correct country code
            const userLocationFlag = document.getElementById('user-location-flag'); // Unique identifier
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

        // Calculate UTC offset in hours
        const utcOffset = now.getTimezoneOffset() / -60;
        const utcOffsetString = `UTC${utcOffset >= 0 ? "+" : ""}${utcOffset}`;

        // Display the time with UTC offset
        clockElement.textContent = `${hours}:${minutes}:${seconds} (${utcOffsetString})`;
    }

    setInterval(updateClock, 1000);
    updateClock();
});
