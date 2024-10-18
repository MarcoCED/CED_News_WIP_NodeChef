async function fetchFedResearchFeeds(containerId) { 
    const rssUrls = [
        'https://cednews-26197.nodechef.com/feds-notes-feed',         // Proxy for FEDS Notes feed
        'https://cednews-26197.nodechef.com/ifdp-feed',               // Proxy for IFDP feed
        'https://cednews-26197.nodechef.com/feds-working-papers-feed' // Proxy for FEDS Working Papers feed
    ];

    const container = document.getElementById(containerId);
    const allItems = [];

    try {
        for (const rssUrl of rssUrls) {
            const response = await fetch(rssUrl);
            const xmlText = await response.text();
            const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");

            xmlDoc.querySelectorAll("item").forEach(item => {
                const title = item.querySelector("title").textContent;
                const link = item.querySelector("link").textContent;
                const description = item.querySelector("description").textContent;
                const pubDate = new Date(item.querySelector("pubDate").textContent);
                const formattedDate = pubDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
                
                // Detect whether it's a FEDS Note, FEDS Paper, or IFDP Paper based on the title
                let type = "";
                if (title.includes("FEDS Note:")) {
                    type = "FEDS Note";
                } else if (title.includes("FEDS Paper:")) {
                    type = "FEDS Paper";
                } else if (title.includes("IFDP Paper:")) {
                    type = "IFDP Paper";
                }

                // Remove the prefix from the title (FEDS Note:, FEDS Paper:, IFDP Paper:)
                const cleanTitle = title.replace(/^(FEDS Note:|FEDS Paper:|IFDP Paper:)\s*/, '');

                // Push items with modified headline
                allItems.push({
                    title: cleanTitle,
                    type,  // FEDS Note, FEDS Paper, or IFDP Paper
                    link,
                    description,
                    pubDate,
                    formattedDate
                });
            });
        }

        // Sort items by date, most recent first
        allItems.sort((a, b) => b.pubDate - a.pubDate);

        // Clear the container and append the sorted items
        container.innerHTML = ''; 
        allItems.forEach(({ title, type, link, description, formattedDate }) => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            // Prepend "US FED:" to the headline and append the type (FEDS Note, etc.)
            const headline = `
                <h3 class="news-item-title">${formattedDate} - US FED: ${title} - ${type}</h3>
                <div class="news-content" style="display: none;">
                    <p>${description} <a href="${link}" target="_blank">Read More</a></p>
                </div>
            `;
            newsItem.innerHTML = headline;

            // Append to container
            container.appendChild(newsItem);

            // Add hover event to display the content box and keep it stable
            newsItem.addEventListener('mouseenter', async () => {
                const newsContent = newsItem.querySelector('.news-content');
                newsContent.style.display = 'block';
            });

            // Hide the content box when the mouse leaves the news item
            newsItem.addEventListener('mouseleave', () => {
                const newsContent = newsItem.querySelector('.news-content');
                newsContent.style.display = 'none';
            });
        });
    } catch (error) {
        console.error('Error fetching Fed Research feeds:', error);
    }
}

// Initialize the feed when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    fetchFedResearchFeeds('fed-research-feed-container');
});
