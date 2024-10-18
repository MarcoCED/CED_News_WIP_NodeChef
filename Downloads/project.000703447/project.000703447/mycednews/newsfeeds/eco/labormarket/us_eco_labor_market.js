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

// Function to process Atom feeds (for BLS feeds)
function processAtomFeed(feedData) {
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


// Function to display news items
function displayLaborMarketNews(entries, container) {
    container.innerHTML = ''; // Clear previous content
    entries.forEach(entry => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const title = document.createElement('h3');

        // Check if it's an EMPSIT headline and add the specific class
        if (entry.title.toLowerCase().includes('payroll employment')) {
            title.className = 'news-item-title empsit-headline'; // Add EMPSIT headline class
        } else {
            title.className = 'news-item-title'; // Default class for other headlines
        }

        title.innerHTML = `<span class="date">${formatDate(entry.pubDate)}</span> <span class="dash">-</span> ${entry.title}`;
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



// Function to format date as MM/DD
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${month}/${day}`;
}

// Function to fetch and display labor market feeds
async function fetchLaborMarketFeeds(containerId) {
    const container = document.getElementById(containerId);
    const combinedEntries = [];

    // Fetch EMPSIT feed
try {
    const empsitData = await fetchWithCache('https://cednews-26197.nodechef.com/empsit-feed', 'empsit_cache', 'empsit_last_fetch');
    if (empsitData) {
        const empsitEntries = processAtomFeed(empsitData);
        combinedEntries.push(...empsitEntries);
    }
} catch (error) {
    console.error('Error fetching EMPSIT feed:', error);
}

// Fetch JOLTS feed
try {
    const joltsData = await fetchWithCache('https://cednews-26197.nodechef.com/jolts-feed', 'jolts_cache', 'jolts_last_fetch');
    if (joltsData) {
        const joltsEntries = processAtomFeed(joltsData);
        combinedEntries.push(...joltsEntries);
    }
} catch (error) {
    console.error('Error fetching JOLTS feed:', error);
}

// Fetch ECI feed
try {
    const eciData = await fetchWithCache('https://cednews-26197.nodechef.com/eci-feed', 'eci_cache', 'eci_last_fetch');
    if (eciData) {
        const eciEntries = processAtomFeed(eciData);
        combinedEntries.push(...eciEntries);
    }
} catch (error) {
    console.error('Error fetching ECI feed:', error);
}

// Fetch LAUS feed (State Employment and Unemployment)
try {
    const lausData = await fetchWithCache('https://cednews-26197.nodechef.com/laus-feed', 'laus_cache', 'laus_last_fetch');
    if (lausData) {
        const lausEntries = processAtomFeed(lausData);
        combinedEntries.push(...lausEntries);
    }
} catch (error) {
    console.error('Error fetching LAUS feed:', error);
}

// Fetch Weekly Earnings feed
try {
    const weeklyEarningsData = await fetchWithCache('https://cednews-26197.nodechef.com/weekly-earnings-feed', 'weekly_earnings_cache', 'weekly_earnings_last_fetch');
    if (weeklyEarningsData) {
        const weeklyEarningsEntries = processAtomFeed(weeklyEarningsData);
        combinedEntries.push(...weeklyEarningsEntries);
    }
} catch (error) {
    console.error('Error fetching Weekly Earnings feed:', error);
}

// Fetch Atlanta Fed feed (standard RSS)
try {
    const atlantaFedData = await fetchWithCache('https://cednews-26197.nodechef.com/atlanta-fed-feed', 'atlanta_fed_cache', 'atlanta_fed_last_fetch');
    if (atlantaFedData) {
        const atlantaFedEntries = processRSSFeed(atlantaFedData);
        combinedEntries.push(...atlantaFedEntries);
    }
} catch (error) {
    console.error('Error fetching Atlanta Fed feed:', error);
}


    // Sort and display combined feed entries
    combinedEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    displayLaborMarketNews(combinedEntries, container);
}
