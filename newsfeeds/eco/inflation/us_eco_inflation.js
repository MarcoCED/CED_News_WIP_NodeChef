// Utility function to fetch data with caching, allowing for hourly updates
async function fetchWithCache(url, cacheKey, lastFetchKey) {
    const now = Date.now();
    const lastFetchTime = localStorage.getItem(lastFetchKey);
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData && lastFetchTime && now - lastFetchTime < 60 * 60 * 1000) {
        console.log(`Using cached data for ${url}`);
        return cachedData;
    }

    try {
        console.log(`Fetching new data from: ${url}`);
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.text();
            localStorage.setItem(cacheKey, data);
            localStorage.setItem(lastFetchKey, now.toString());
            return data;
        }
    } catch (error) {
        console.warn(`Error fetching ${url}:`, error);
    }
    return null;
}

// Function to process Atom feeds (e.g., CPI, PPI, XIMPIM)
function processInflationFeed(feedData) {
    const parser = new DOMParser();
    const feedXml = parser.parseFromString(feedData, 'application/xml');
    const entries = feedXml.getElementsByTagName('entry');
    return Array.from(entries).map(entry => {
        const title = entry.getElementsByTagName('title')[0]?.textContent || 'No title';
        const link = entry.getElementsByTagName('link')[0]?.getAttribute('href') || '#';
        const content = entry.getElementsByTagName('content')[0]?.textContent || '';
        const pubDate = new Date(entry.getElementsByTagName('published')[0]?.textContent);

        return { title, link, content, pubDate };
    });
}

// Function to process standard RSS feeds (for Atlanta Fed)
function processRSSFeed(feedData) {
    const parser = new DOMParser();
    const feedXml = parser.parseFromString(feedData, 'application/xml');
    const items = feedXml.getElementsByTagName('item');
    return Array.from(items).map(item => {
        const title = item.getElementsByTagName('title')[0]?.textContent || 'No title';
        const link = item.getElementsByTagName('link')[0]?.textContent || '#';
        const content = item.getElementsByTagName('description')[0]?.textContent || '';
        const pubDate = new Date(item.getElementsByTagName('pubDate')[0]?.textContent);

        return { title, link, content, pubDate };
    });
}


// Function to format the date and time as MM/DD HH:mm in Eastern Time (US Eastern Time Zone)
function formatDateTime(date) {
    const options = {
        timeZone: 'America/New_York', // Set to Eastern Time
        month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    };

    // Convert to Eastern Time and return formatted result (MM/DD HH:mm)
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date)).replace(',', '');
}

// Function to display inflation news with ATL FED styling
function displayInflationNews(entries, container) {
    container.innerHTML = ''; // Clear previous content
    entries.forEach(entry => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const title = document.createElement('h3');

        // Logic to determine if it's CPI or PPI, but exclude MYCPI
        const isInflationRelated = entry.title.toLowerCase().includes('cpi') || entry.title.toLowerCase().includes('ppi');
        const isMyCPI = entry.title.toLowerCase().includes('mycpi');

        // Format date and time for all entries, including Atlanta Fed and XIMPIM
        const formattedDate = formatDateTime(entry.pubDate);

        // Apply different styling for CPI/PPI but not for MYCPI
        if (isInflationRelated && !isMyCPI) {
            title.className = 'news-item-title inflation-headline'; // Bold, uppercase, red for CPI and PPI, excluding MYCPI
        } else {
            title.className = 'news-item-title'; // Default styling for others
        }

        // Prepend the timestamp and append "US" after the timestamp, ensuring spacing
        title.innerHTML = `
            <span class="date">${formattedDate}</span>
            <span class="us-label" style="margin-left: 25px;"> - US</span>
            <span class="headline-text" style="margin-left: 1px;">${entry.title}</span>`;

        // If the entry is from Atlanta Fed, append the ATL FED tag
        const atlFedTag = document.createElement('span');
        if (entry.title.toLowerCase().includes('atlanta fed') || entry.link.toLowerCase().includes('atlantafed.org')) {
            atlFedTag.className = 'atl-fed-box';
            atlFedTag.textContent = 'ATL FED';
            title.appendChild(atlFedTag);
        }

        newsItem.appendChild(title);

        const content = document.createElement('p');
        content.className = 'news-content';
        content.textContent = entry.content;

        const link = document.createElement('a');
        link.href = entry.link;
        link.textContent = 'Read more';
        link.target = '_blank';
        content.appendChild(link);

        newsItem.appendChild(content);
        container.appendChild(newsItem);
    });
}


// Function to fetch and display inflation feeds (CPI, PPI, Wage Growth Tracker, and other inflation-related feeds)
async function fetchInflationFeeds(containerId) {
    const container = document.getElementById(containerId);
    const combinedEntries = [];

   // Fetch CPI feed
try {
    const cpiData = await fetchWithCache('https://cednews-26197.nodechef.com/cpi-feed', 'cpi_cache', 'cpi_last_fetch');
    if (cpiData) {
        const cpiEntries = processInflationFeed(cpiData);
        combinedEntries.push(...cpiEntries);
    }
} catch (error) {
    console.error('Error fetching CPI feed:', error);
}

// Fetch PPI feed
try {
    const ppiData = await fetchWithCache('https://cednews-26197.nodechef.com/ppi-feed', 'ppi_cache', 'ppi_last_fetch');
    if (ppiData) {
        const ppiEntries = processInflationFeed(ppiData);
        combinedEntries.push(...ppiEntries);
    }
} catch (error) {
    console.error('Error fetching PPI feed:', error);
}

// Fetch Wage Growth Tracker feed
try {
    const wageGrowthTrackerData = await fetchWithCache('https://cednews-26197.nodechef.com/wageGrowthTracker-feed', 'wageGrowthTracker_cache', 'wageGrowthTracker_last_fetch');
    if (wageGrowthTrackerData) {
        const wageGrowthTrackerEntries = processRSSFeed(wageGrowthTrackerData);
        combinedEntries.push(...wageGrowthTrackerEntries);
    }
} catch (error) {
    console.error('Error fetching Wage Growth Tracker feed:', error);
}

// Fetch Sticky Price feed (Atlanta Fed)
try {
    const stickyPriceData = await fetchWithCache('https://cednews-26197.nodechef.com/inflationProject_stickyPrice-feed', 'stickyPrice_cache', 'stickyPrice_last_fetch');
    if (stickyPriceData) {
        const stickyPriceEntries = processRSSFeed(stickyPriceData);
        combinedEntries.push(...stickyPriceEntries);
    }
} catch (error) {
    console.error('Error fetching Sticky Price feed:', error);
}

// Fetch BIE feed (Atlanta Fed)
try {
    const bieData = await fetchWithCache('https://cednews-26197.nodechef.com/inflationProject_bie-feed', 'bie_cache', 'bie_last_fetch');
    if (bieData) {
        const bieEntries = processRSSFeed(bieData);
        combinedEntries.push(...bieEntries);
    }
} catch (error) {
    console.error('Error fetching BIE feed:', error);
}


    // Sort and display combined feed entries by publication date
    combinedEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    displayInflationNews(combinedEntries, container);
}

// Initialize the feed loading when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    fetchInflationFeeds('inflation-feed-container');
});
