async function fetchFedPolicyFeeds(containerId) {
    const feedUrl = 'https://cednews-26197.nodechef.com/fed-policy-feed'; // Proxy for Fed Policy feed

    const container = document.getElementById(containerId);
    container.innerHTML = '';  // Clear any previous content

    try {
        const response = await fetch(feedUrl);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const items = xmlDoc.querySelectorAll("item");

        items.forEach(item => {
            let title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            const description = item.querySelector("description").textContent || 'Click below to read the full article.';
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            const formattedDate = pubDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
            const formattedTime = pubDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            // Replace "Federal Open Market Committee" with "FOMC" in the title
            title = title.replace("Federal Open Market Committee", "FOMC");

            // Check if the title contains "FOMC statement" for custom styling
            let customClass = '';
            if (title.toLowerCase().includes("fomc statement")) {
                customClass = 'fomc-statement'; // Apply a class for custom styling
                title = title.replace("Federal Reserve issues FOMC statement", "US FED: FEDERAL RESERVE STATEMENT ON MONETARY POLICY");
            }

            // Create the HTML structure for each news item
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            const headline = `
                <h3 class="news-item-title ${customClass}">${formattedDate} ${formattedTime} - US FED: ${title}</h3>
                <div class="news-content">
                    <p>${description} <a href="${link}" target="_blank">Read More</a></p>
                </div>
            `;
            newsItem.innerHTML = headline;

            // Append to container
            container.appendChild(newsItem);

            // Show the text box on hover
            newsItem.addEventListener('mouseenter', () => {
                const newsContent = newsItem.querySelector('.news-content');
                newsContent.style.opacity = '1'; // Show content box
            });
            newsItem.addEventListener('mouseleave', () => {
                const newsContent = newsItem.querySelector('.news-content');
                newsContent.style.opacity = '0'; // Hide content box
            });
        });
    } catch (error) {
        console.error('Error fetching Fed Policy feeds:', error);
    }
}

// Initialize the feed
document.addEventListener("DOMContentLoaded", function () {
    fetchFedPolicyFeeds('fed-policy-feed-container');
});
