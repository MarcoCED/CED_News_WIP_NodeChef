// Function to fetch and display the Real Economy RSS feeds (BEA, G17, GDPNow, HOAM, Census)
async function fetchRealEconomyFeeds(containerId) {
    const rssUrls = [
        'https://cednews-26197.nodechef.com/bea-feed',    // Proxy for BEA Feed
        'https://cednews-26197.nodechef.com/g17-feed',    // Proxy for G17 Feed
        'https://cednews-26197.nodechef.com/gdpnow-feed', // Proxy for GDPNow Feed
        'https://cednews-26197.nodechef.com/hoam-feed',   // Proxy for Home Ownership Affordability Monitor Feed
        'https://cednews-26197.nodechef.com/census-feed'  // Proxy for Census Bureau Economic Indicators (New)
    ];

    const container = document.getElementById(containerId);
    const allItems = []; // To store all items from all feeds

    try {
        for (const rssUrl of rssUrls) {
            const response = await fetch(rssUrl);
            const xmlText = await response.text();
            const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");

            // Extract and process each item
            xmlDoc.querySelectorAll("item").forEach(item => {
                let title = item.querySelector("title").textContent;
                const link = item.querySelector("link").textContent;
                const description = item.querySelector("description").textContent;

                // Modify BEA headlines: Replace all instances of "U.S." with "US"
                if (rssUrl.includes('bea')) {
                    title = title.replace(/U\.S\./g, "US");
                }

                // Modify G17 headlines: Replace "G.17" and remove "Are Now Available" and "Data"
                if (rssUrl.includes('g17')) {
                    title = title.replace(/G\.17/g, "Industrial Production and Capacity Utilization");
                    title = title.replace(/are now available/g, "").trim();
                    title = title.replace(/\bData\b/g, "").trim();
                }

                // Append "ATL FED" to GDPNow and HOAM headlines
                let atlFedTag = '';
                if (rssUrl.includes('gdpnow') || rssUrl.includes('hoam')) {
                    atlFedTag = '<span class="atl-fed-box">ATL FED</span>';  // Create the ATL FED box
                }

                // Handle date extraction based on feed type
                let parsedDate = null;
                if (rssUrl.includes('g17')) {
                    const cbNamespace = "http://www.cbwiki.net/wiki/index.php/Specification_1.1";
                    const occurrenceDate = item.getElementsByTagNameNS(cbNamespace, "occurrenceDate")[0]?.textContent;
                    parsedDate = occurrenceDate ? new Date(occurrenceDate) : null;
                } else if (rssUrl.includes('bea') || rssUrl.includes('gdpnow') || rssUrl.includes('hoam') || rssUrl.includes('census')) {
                    const pubDate = item.querySelector("pubDate")?.textContent;
                    parsedDate = pubDate ? new Date(pubDate) : null;
                }

                // Ensure valid date and format the date
                if (parsedDate && !isNaN(parsedDate.getTime())) {
                    const formattedDate = parsedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
                    allItems.push({ formattedDate, title, atlFedTag, link, description, parsedDate });
                } else {
                    console.warn(`No valid date found for item: ${title}`);
                }
            });
        }

        // Sort items by date, most recent first
        allItems.sort((a, b) => b.parsedDate - a.parsedDate);

        // Clear the container and display sorted items
        container.innerHTML = allItems.map(({ formattedDate, title, atlFedTag, link, description }) => `
            <div class="news-item">
                <h3 class="news-item-title">
                    ${formattedDate} - ${title.trim()} ${atlFedTag}  <!-- Appending ATL FED box here -->
                </h3>
                <div class="news-content">
                    <p>${description} <a href="${link}" target="_blank">Read More</a></p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error fetching the Real Economy feeds:", error);
    }
}

// Call the function when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => fetchRealEconomyFeeds('real-economy-feed-container'));
