// ===========================
// DATE-BASED SEED GENERATOR
// Data changes once per day, not on every refresh
// ===========================

// Get today's date as a seed
function getDailySeed() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return year * 10000 + month * 100 + day; // e.g., 20241115
}

// Seeded random number generator (PRNG)
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }
    
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    
    range(min, max) {
        return min + this.next() * (max - min);
    }
    
    integer(min, max) {
        return Math.floor(this.range(min, max + 1));
    }
    
    pick(array) {
        return array[this.integer(0, array.length - 1)];
    }
}

// Initialize with today's seed
const dailyRandom = new SeededRandom(getDailySeed());

// ===========================
// DATA DEFINITIONS
// ===========================

const smeCompanies = [
    { symbol: 'SMEGOLD', name: 'Goldstone Infra Ltd.' },
    { symbol: 'TECHSME', name: 'Tech Solutions SME' },
    { symbol: 'FOODCORP', name: 'Food Processing Corp' },
    { symbol: 'SOLARIND', name: 'Solar Industry India' },
    { symbol: 'PRINTPRO', name: 'Print Professional Ltd' },
    { symbol: 'PHARMEX', name: 'Pharma Excellence' },
    { symbol: 'GREENPOW', name: 'Green Power Ltd' },
    { symbol: 'AUTOTECH', name: 'Auto Tech India' },
    { symbol: 'MEDIPLUS', name: 'Medi Plus Healthcare' },
    { symbol: 'EDUSERV', name: 'Edu Services Ltd' }
];

const indicesData = [
    { name: 'NIFTY 50', base: 19800 },
    { name: 'NIFTY SME', base: 12400 },
    { name: 'SENSEX', base: 66300 },
    { name: 'INDIA VIX', base: 11.2 }
];

// ===========================
// UTILITY FUNCTIONS
// ===========================

function formatNumber(num) {
    return num.toLocaleString('en-IN');
}

function formatCurrency(num) {
    return num.toFixed(2);
}

// ===========================
// DATA GENERATION
// ===========================

// Generate SME stocks data
function generateSMEStocks() {
    return smeCompanies.map(company => {
        const baseLTP = dailyRandom.range(50, 250);
        const change = dailyRandom.range(-5, 5);
        const volume = dailyRandom.integer(100000, 20000000);
        
        return {
            symbol: company.symbol,
            name: company.name,
            ltp: baseLTP,
            change: change,
            volume: volume
        };
    });
}

// Generate market watch data
function generateMarketWatch() {
    return indicesData.map(index => {
        const change = dailyRandom.range(-2.5, 2.5);
        const value = index.base * (1 + change / 100);
        
        return {
            name: index.name,
            value: value,
            change: change,
            isPositive: change >= 0
        };
    });
}

// Generate announcements
function generateAnnouncements() {
    const today = new Date();
    const announcements = [];
    
    const announcementTemplates = [
        { title: 'SMEGOLD: Intimation of Board Meeting for Dividend', offset: 0 },
        { title: 'PRINTPRO: Quarterly Earnings Release FY24-Q2', offset: 0 },
        { title: 'TECHSME: Strategic acquisition of local startup', offset: 1 }
    ];
    
    announcementTemplates.forEach((template, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - template.offset);
        
        announcements.push({
            date: formatAnnouncementDate(date),
            text: template.title
        });
    });
    
    return announcements;
}

// Format announcement date
function formatAnnouncementDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['OCT', 'OCT', 'NOV'];
    const month = months[dailyRandom.integer(0, 2)];
    const year = date.getFullYear();
    const hours = String(dailyRandom.integer(9, 17)).padStart(2, '0');
    const minutes = String(dailyRandom.integer(0, 59)).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

// Generate NIFTY SME data
function generateNiftySME() {
    const baseValue = 12400;
    const change = dailyRandom.range(-1.5, 1.5);
    const value = baseValue * (1 + change / 100);
    
    return {
        value: value,
        change: change,
        isPositive: change >= 0
    };
}

// ===========================
// DOM MANIPULATION
// ===========================

// Display stock table
function displayStockTable(stocks, sortBy = 'active') {
    const tbody = document.getElementById('stockTableBody');
    
    let sortedStocks = [...stocks];
    
    switch(sortBy) {
        case 'gainers':
            sortedStocks.sort((a, b) => b.change - a.change);
            sortedStocks = sortedStocks.slice(0, 5);
            break;
        case 'losers':
            sortedStocks.sort((a, b) => a.change - b.change);
            sortedStocks = sortedStocks.slice(0, 5);
            break;
        case 'new':
            // Show random 5 as "new listings"
            sortedStocks = sortedStocks.slice(0, 5);
            break;
        default: // active
            sortedStocks = sortedStocks.slice(0, 5);
    }
    
    tbody.innerHTML = sortedStocks.map(stock => {
        const changeClass = stock.change >= 0 ? 'change-positive' : 'change-negative';
        const changeSymbol = stock.change >= 0 ? '▲ +' : '▼ ';
        
        return `
            <tr>
                <td>
                    <div class="symbol-cell">
                        <span class="symbol-name">${stock.symbol}</span>
                        <span class="company-name">${stock.name}</span>
                    </div>
                </td>
                <td class="ltp-cell">${formatCurrency(stock.ltp)}</td>
                <td class="${changeClass}">${changeSymbol}${Math.abs(stock.change).toFixed(2)}%</td>
                <td class="volume-cell">${formatNumber(stock.volume)}</td>
                <td><button class="trade-btn">TRADE</button></td>
            </tr>
        `;
    }).join('');
}

// Display market watch
function displayMarketWatch(indices) {
    const container = document.getElementById('marketWatch');
    
    container.innerHTML = indices.map(index => {
        const changeClass = index.isPositive ? 'change-positive' : 'change-negative';
        const changeSymbol = index.isPositive ? '+' : '';
        
        return `
            <div class="market-item">
                <div class="market-item-name">${index.name}</div>
                <div>
                    <div class="market-item-value">${formatCurrency(index.value)}</div>
                    <div class="market-item-change ${changeClass}">
                        ${changeSymbol}${index.change.toFixed(2)}%
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Display announcements
function displayAnnouncements(announcements) {
    const container = document.getElementById('announcements');
    
    container.innerHTML = announcements.map(announcement => `
        <div class="announcement-item">
            <div class="announcement-date">${announcement.date}</div>
            <div class="announcement-text">${announcement.text}</div>
        </div>
    `).join('');
}

// Display NIFTY SME in breadcrumb
function displayNiftySME(nifty) {
    const valueEl = document.getElementById('niftyBreadcrumbValue');
    const changeEl = document.getElementById('niftyBreadcrumbChange');
    
    if (valueEl && changeEl) {
        valueEl.textContent = formatCurrency(nifty.value);
        changeEl.textContent = `(${nifty.isPositive ? '+' : ''}${nifty.change.toFixed(2)}%)`;
        changeEl.className = nifty.isPositive ? 'positive' : 'negative';
    }
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const formatted = now.toLocaleString('en-US', options).toUpperCase();
    const dateTimeEl = document.getElementById('topDateTime');
    if (dateTimeEl) {
        dateTimeEl.textContent = formatted;
    }
}

// Update last updated time
function updateLastUpdated() {
    const now = new Date();
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    
    const formatted = now.toLocaleString('en-US', options).replace(',', '').toUpperCase();
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = formatted + ' IST';
    }
}

// ===========================
// TAB SWITCHING
// ===========================

let currentStocks = [];

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Display stocks based on selected tab
            const tabType = tab.getAttribute('data-tab');
            displayStockTable(currentStocks, tabType);
        });
    });
}

// ===========================
// AUTHENTICATION CHECK (OPTIONAL)
// ===========================

async function checkAuthentication() {
    try {
        const response = await fetch("http://127.0.0.1:8000/auth/verify", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            alert("Please login to access this page");
            window.location.href = "../pages/signin.html";
            return false;
        }

        return true;
    } catch (error) {
        console.error("Authentication check failed:", error);
        console.log("Authentication endpoint not available, allowing access");
        return true;
    }
}

// ===========================
// INITIALIZATION
// ===========================

function init() {
    console.log('Initializing with daily seed:', getDailySeed());
    
    // Update date/time every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Update last updated time
    updateLastUpdated();
    setInterval(updateLastUpdated, 60000); // Update every minute
    
    // Generate and display data (this will be the same for the whole day)
    currentStocks = generateSMEStocks();
    const marketWatch = generateMarketWatch();
    const announcements = generateAnnouncements();
    const niftySME = generateNiftySME();
    
    displayStockTable(currentStocks, 'active');
    displayMarketWatch(marketWatch);
    displayAnnouncements(announcements);
    displayNiftySME(niftySME);
    
    // Setup tabs
    setupTabs();
    
    console.log('Main page initialized. Data will change tomorrow.');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);