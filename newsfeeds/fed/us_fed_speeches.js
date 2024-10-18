// Adding Dallas Fed to the list of feeds for speeches
async function fetchFedSpeechesFeeds(containerId) {
    const rssUrls = [
        'https://cednews-26197.nodechef.com/boston-fed-speeches-feed',   // Boston Fed feed
        'https://cednews-26197.nodechef.com/atlanta-fed-speeches-feed',  // Atlanta Fed feed
        'https://cednews-26197.nodechef.com/richmond-fed-speeches-feed', // Richmond Fed feed
        'https://cednews-26197.nodechef.com/dallas-fed-speeches-feed'    // Dallas Fed feed
    ];

    const container = document.getElementById(containerId);
    const allItems = [];

    try {
        for (const rssUrl of rssUrls) {
            const response = await fetch(rssUrl);
            const xmlText = await response.text();
            const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");

            xmlDoc.querySelectorAll("item").forEach(item => {
                let title = item.querySelector("title").textContent;
                const link = item.querySelector("link").textContent;
                const description = item.querySelector("description")?.textContent || 'No description available';
                const pubDate = new Date(item.querySelector("pubDate").textContent);
                const formattedDate = pubDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

                // Prepend appropriate abbreviations based on the feed URL
                let prefix = '';
                let labelClass = '';
                if (rssUrl.includes('atlanta-fed')) {
                    prefix = 'ATL FED';
                    labelClass = 'atl-fed-box';
                } else if (rssUrl.includes('boston-fed')) {
                    prefix = 'BOS FED';
                    labelClass = 'bos-fed-box';
                } else if (rssUrl.includes('richmond-fed')) {
                    prefix = 'RIC FED';
                    labelClass = 'ric-fed-box';
                } else if (rssUrl.includes('dallas-fed')) {
                    prefix = 'DAL FED';
                    labelClass = 'dal-fed-box';
                }

                // Append items to the list
                allItems.push({
                    title,
                    link,
                    description,
                    pubDate,
                    formattedDate,
                    prefix,
                    labelClass
                });
            });
        }

        // Sort items by date, most recent first
        allItems.sort((a, b) => b.pubDate - a.pubDate);

        // Clear the container and append the sorted items
        container.innerHTML = '';
        allItems.forEach(({ title, link, description, formattedDate, prefix, labelClass }) => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            const headline = `
                <h3 class="news-item-title">
                    <span class="fed-label ${labelClass}">${prefix}</span> 
                    ${formattedDate} - ${title}
                </h3>
                <div class="news-content" style="display: none;">
                    <p>${description} <a href="${link}" target="_blank">Read More</a></p>
                </div>
            `;

            newsItem.innerHTML = headline;
            container.appendChild(newsItem);

            // Add hover event to display the content box
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
        console.error('Error fetching Fed Speeches feeds:', error);
    }
}

// Initialize the feed when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    fetchFedSpeechesFeeds('fed-speeches-feed-container'); // Call function to load speeches feeds
});
