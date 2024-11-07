import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { JSDOM } from 'jsdom';

const app = express();

app.use(cors());

// Serve static files from the root directory
app.use(express.static(path.join(process.cwd())));

// Route to serve index.html from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});
//*****************************LABOR MARKET FEEDS******************************



app.get('/empsit-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bls.gov/feed/empsit.rss');
        const data = await response.text();
        console.log('Fetched EMPSIT feed:', data); // Log the feed for debugging
        res.send(data);
    } catch (error) {
        console.error('Error fetching EMPSIT feed:', error);
        res.status(500).send('Error fetching the EMPSIT feed');
    }
});


// Fetch and serve the JOLTS feed
app.get('/jolts-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bls.gov/feed/jolts.rss');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching JOLTS feed:', error);
        res.status(500).send('Error fetching the JOLTS feed');
    }
});

// Fetch and serve the ECI feed
app.get('/eci-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bls.gov/feed/eci.rss');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching ECI feed:', error);
        res.status(500).send('Error fetching the ECI feed');
    }
});

// Fetch and serve the Real Earnings feed
app.get('/real-earnings-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bls.gov/feed/realer.rss');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching Real Earnings feed:', error);
        res.status(500).send('Error fetching the Real Earnings feed');
    }
});

// Fetch and serve the Atlanta Fed feed
app.get('/atlanta-fed-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.atlantafed.org/RSS/LaborReportFirstLook.aspx');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching Atlanta Fed feed:', error);
        res.status(500).send('Error fetching the Atlanta Fed feed');
    }
});

// Fetch and serve the LAUS feed (State Employment and Unemployment)
app.get('/laus-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bls.gov/feed/laus.rss');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching LAUS feed:', error);
        res.status(500).send('Error fetching the LAUS feed');
    }
});

// Fetch and serve the Weekly Earnings feed
app.get('/weekly-earnings-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bls.gov/feed/wkyeng.rss');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching Weekly Earnings feed:', error);
        res.status(500).send('Error fetching the Weekly Earnings feed');
    }
});

// Fetch and serve the DOL RSS feed
app.get('/dol-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.dol.gov/rss/releases.xml');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching DOL feed:', error);
        res.status(500).send('Error fetching the DOL feed');
    }
});

//***************************INFLATION FEEDS***********************************

// Fetch and serve the PPI feed
app.get('/ppi-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bls.gov/feed/ppi.rss');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching PPI feed:', error);
        res.status(500).send('Error fetching the PPI feed');
    }
});

// Fetch and serve the CPI feed
app.get('/cpi-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bls.gov/feed/cpi.rss');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching CPI feed:', error);
        res.status(500).send('Error fetching the CPI feed');
    }
});

// Fetch and serve the XIMPIM feed
app.get('/ximpim-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bls.gov/feed/ximpim.rss');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching XIMPIM feed:', error);
        res.status(500).send('Error fetching the XIMPIM feed');
    }
});

// Proxy for Sticky Price feed
app.get('/inflationProject_stickyPrice-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.atlantafed.org/rss/inflationProject_stickyPrice');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching Sticky Price feed:', error);
        res.status(500).send('Error fetching the Sticky Price feed');
    }
});

// Proxy for BIE feed
app.get('/inflationProject_bie-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.atlantafed.org/rss/inflationProject_bie');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching BIE feed:', error);
        res.status(500).send('Error fetching the BIE feed');
    }
});

// Proxy for Wage Growth Tracker feed
app.get('/wageGrowthTracker-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.atlantafed.org/rss/WageGrowthTracker');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching Wage Growth Tracker feed:', error);
        res.status(500).send('Error fetching Wage Growth Tracker feed');
    }
});


//*******************************REAL ECONOMY FEEDS****************************

// Proxy to fetch BEA RSS feed
app.get('/bea-feed', async (req, res) => {
    try {
        const response = await fetch('https://apps.bea.gov/rss/rss.xml');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml'); // Set the correct content type
        res.send(data);
    } catch (error) {
        console.error('Error fetching BEA feed:', error);
        res.status(500).send('Error fetching BEA feed');
    }
});

// Proxy to fetch Federal Reserve G17 RSS feed
app.get('/g17-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.federalreserve.gov/feeds/g17.xml');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml'); // Set the correct content type
        res.send(data);
    } catch (error) {
        console.error('Error fetching G17 feed:', error);
        res.status(500).send('Error fetching G17 feed');
    }
});

// Proxy for GDPNow Feed (New Route for GDPNow)
app.get('/gdpnow-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.atlantafed.org/rss/GDPNow');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching GDPNow feed:', error);
        res.status(500).send('Error fetching GDPNow feed');
    }
});

// Proxy for Home Ownership Affordability Monitor Feed (New Route)
app.get('/hoam-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.atlantafed.org/RSS/HomeOwnershipAffordabilityMonitor');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching HOAM feed:', error);
        res.status(500).send('Error fetching HOAM feed');
    }
});

// Proxy for Census Bureau Economic Indicators Feed (New Route)
app.get('/census-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.census.gov/economic-indicators/indicator.xml');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching Census Bureau feed:', error);
        res.status(500).send('Error fetching Census Bureau feed');
    }
});



app.get('/fed-policy-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.federalreserve.gov/feeds/press_monetary.xml');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml'); // Set the correct content type
        res.send(data);
    } catch (error) {
        console.error('Error fetching Fed Policy feed:', error);
        res.status(500).send('Error fetching the Fed Policy feed');
    }
});


// Fetch and serve the FEDS Notes feed
app.get('/feds-notes-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.federalreserve.gov/feeds/feds_notes.xml');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml'); // Set the correct content type
        res.send(data);
    } catch (error) {
        console.error('Error fetching FEDS Notes feed:', error);
        res.status(500).send('Error fetching the FEDS Notes feed');
    }
});

// Proxy for IFDP feed
app.get('/ifdp-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.federalreserve.gov/feeds/ifdp.xml');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml'); // Set the correct content type
        res.send(data);
    } catch (error) {
        console.error('Error fetching IFDP feed:', error);
        res.status(500).send('Error fetching the IFDP feed');
    }
});


// Proxy for FEDS Working Papers feed
app.get('/feds-working-papers-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.federalreserve.gov/feeds/feds.xml');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml'); // Set the correct content type
        res.send(data);
    } catch (error) {
        console.error('Error fetching FEDS Working Papers feed:', error);
        res.status(500).send('Error fetching the FEDS Working Papers feed');
    }
});

// Proxy for Conference Board Press Feed
app.get('/conference-board-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.conference-board.org/rss/rss.cfm?type=press');
        const data = await response.text();
        res.set('Content-Type', 'application/rss+xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching Conference Board feed:', error);
        res.status(500).send('Error fetching the Conference Board feed');
    }
});




/****************************** Fed Speeches *********************************/

// Proxy for Boston Fed Speeches feed
app.get('/boston-fed-speeches-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.bostonfed.org/feeds/rss_speeches.xml');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching Boston Fed Speeches feed:', error);
        res.status(500).send('Failed to fetch Boston Fed Speeches feed');
    }
});

// Proxy for Atlanta Fed Speeches feed
app.get('/atlanta-fed-speeches-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.atlantafed.org/rss/speechindex');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching Atlanta Fed Speeches feed:', error);
        res.status(500).send('Failed to fetch Atlanta Fed Speeches feed');
    }
});

app.get('/richmond-fed-speeches-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.richmondfed.org/press_room/speeches?cc_view=rss&source=fedweb&format=colon');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching Richmond Fed Speeches feed:', error);
        res.status(500).send('Failed to fetch Richmond Fed Speeches feed');
    }
});


// Proxy for Dallas Fed Speeches feed
app.get('/dallas-fed-speeches-feed', async (req, res) => {
    try {
        const response = await fetch('https://www.dallasfed.org/rss/speeches.xml');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching Dallas Fed Speeches feed:', error);
        res.status(500).send('Failed to fetch Dallas Fed Speeches feed');
    }
});

// Last route handler (e.g., health check)
app.get('/health', (req, res) => {
    res.send('Server is running!');
});


const port = process.env.PORT || 80;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

