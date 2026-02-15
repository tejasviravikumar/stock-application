// ===========================
// DATE-BASED SEED GENERATOR
// ===========================

function getDailySeed() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return year * 10000 + month * 100 + day;
}

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
}

const dailyRandom = new SeededRandom(getDailySeed());

// ===========================
// DATA DEFINITIONS
// ===========================

const etfData = [
    { symbol: 'NIFTYBEES', index: 'Nifty 50 Index', baseLTP: 214 },
    { symbol: 'BANKBEES', index: 'Nifty Bank Index', baseLTP: 442 },
    { symbol: 'JUNIORBEES', index: 'Nifty Next 50 Index', baseLTP: 522 },
    { symbol: 'CPSEETF', index: 'Nifty CPSE Index', baseLTP: 56 },
    { symbol: 'ICICINV20', index: 'Nifty NV20 Index', baseLTP: 124 },
    { symbol: 'MON100', index: 'NASDAQ 100 Index', baseLTP: 108 }
];

const insightsData = [
    { tag: 'LEARNING HUB', title: 'What are ETFs? A Beginner\'s Guide to Passive Investing' },
    { tag: 'TAXATION', title: 'Understanding Capital Gains on ETF Redemption' },
    { tag: 'STRATEGY', title: 'How to build a Core-Satellite Portfolio using ETFs' }
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

function generateETFData() {
    return etfData.map(etf => {
        const ltpVariation = dailyRandom.range(0.95, 1.05);
        const ltp = etf.baseLTP * ltpVariation;
        const change = dailyRandom.range(-2, 2);
        const volume = dailyRandom.integer(1000000, 50000000);
        const turnover = dailyRandom.range(10, 200);
        
        return {
            symbol: etf.symbol,
            index: etf.index,
            ltp: ltp,
            change: change,
            volume: volume,
            turnover: turnover
        };
    });
}

function generateNiftyBees() {
    const baseValue = 214;
    const change = dailyRandom.range(-1, 1);
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

function displayETFTable(etfs) {
    const tbody = document.getElementById('etfTableBody');
    
    tbody.innerHTML = etfs.map(etf => {
        const changeClass = etf.change >= 0 ? 'change-positive' : 'change-negative';
        const changeSymbol = etf.change >= 0 ? '+' : '';
        
        return `
            <tr>
                <td class="symbol-cell">${etf.symbol}</td>
                <td class="index-cell">${etf.index}</td>
                <td class="ltp-cell">${formatCurrency(etf.ltp)}</td>
                <td class="${changeClass}">${changeSymbol}${etf.change.toFixed(2)}%</td>
                <td>${formatNumber(etf.volume)}</td>
                <td>${formatCurrency(etf.turnover)}</td>
                <td><button class="buy-sell-btn">BUY / SELL</button></td>
            </tr>
        `;
    }).join('');
}

function displayActiveETFs(etfs) {
    const container = document.getElementById('activeList');
    const sortedETFs = [...etfs].sort((a, b) => b.turnover - a.turnover).slice(0, 4);
    
    container.innerHTML = sortedETFs.map(etf => `
        <div class="active-item">
            <span class="active-name">${etf.symbol}</span>
            <span class="active-value">${formatCurrency(etf.turnover)} Cr</span>
        </div>
    `).join('');
}

function displayInsights() {
    const container = document.getElementById('insightsList');
    
    container.innerHTML = insightsData.map(insight => `
        <div class="insight-item">
            <div class="insight-tag">${insight.tag}</div>
            <div class="insight-title">${insight.title}</div>
        </div>
    `).join('');
}

function displayNiftyBees(nifty) {
    const valueEl = document.getElementById('niftyBreadcrumbValue');
    const changeEl = document.getElementById('niftyBreadcrumbChange');
    
    if (valueEl && changeEl) {
        valueEl.textContent = formatCurrency(nifty.value);
        changeEl.textContent = `(${nifty.isPositive ? '+' : ''}${nifty.change.toFixed(2)}%)`;
        changeEl.className = nifty.isPositive ? 'positive' : 'negative';
    }
}

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

function updateLastUpdated() {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(',', '').toUpperCase();
    
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = formatted + ' IST';
    }
}

// ===========================
// TAB SWITCHING
// ===========================

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// ===========================
// INITIALIZATION
// ===========================

function init() {
    console.log('Initializing ETF page with daily seed:', getDailySeed());
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    updateLastUpdated();
    setInterval(updateLastUpdated, 60000);
    
    const etfs = generateETFData();
    const niftyBees = generateNiftyBees();
    
    displayETFTable(etfs);
    displayActiveETFs(etfs);
    displayInsights();
    displayNiftyBees(niftyBees);
    
    setupTabs();
    
    console.log('ETF page initialized. Data will change tomorrow.');
}

document.addEventListener('DOMContentLoaded', init);