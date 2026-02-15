// ======================================================
// DAILY SEEDED RANDOM GENERATOR (Data changes once/day)
// ======================================================

function getDailySeed() {
    const today = new Date();
    return today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();
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

    pick(arr) {
        return arr[this.integer(0, arr.length - 1)];
    }
}

const dailyRandom = new SeededRandom(getDailySeed());


// ======================================================
// STATIC DATA
// ======================================================

const companyData = [
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'INFY', name: 'Infosys Ltd' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'WIPRO', name: 'Wipro Ltd' },
    { symbol: 'ITC', name: 'ITC Ltd' }
];

const meetingPurposes = [
    'Quarterly Results',
    'Dividend Declaration',
    'Stock Split Consideration',
    'Bonus Issue',
    'Merger Discussion',
    'Annual General Meeting'
];

const indicesData = [
    { name: 'NIFTY BANK', base: 43500 },
    { name: 'NIFTY IT', base: 31000 },
    { name: 'NIFTY AUTO', base: 15800 },
    { name: 'NIFTY METAL', base: 6500 }
];


// ======================================================
// DATA GENERATORS
// ======================================================

function formatDate(date) {
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function generateBoardMeetings() {
    const meetings = [];
    const used = new Set();
    const today = new Date();

    for (let i = 0; i < 5; i++) {

        let company;
        do {
            company = dailyRandom.pick(companyData);
        } while (used.has(company.symbol));

        used.add(company.symbol);

        const future = new Date(today);
        future.setDate(today.getDate() + dailyRandom.integer(1, 30));

        meetings.push({
            symbol: company.symbol,
            date: formatDate(future),
            purpose: dailyRandom.pick(meetingPurposes),
            ltp: dailyRandom.range(500, 4000).toFixed(2)
        });
    }

    return meetings;
}

function generateMarketWatch() {
    return indicesData.map(index => {
        const change = dailyRandom.range(-2, 2);
        const value = index.base * (1 + change / 100);

        return {
            name: index.name,
            value: value.toFixed(2),
            change: change.toFixed(2),
            positive: change >= 0
        };
    });
}

function generateAnnouncements() {
    const templates = [
        'Board Meeting to consider Financial Results',
        'Press Release – Strategic Expansion',
        'Investor Presentation Schedule'
    ];

    return templates.map(text => ({
        date: formatDate(new Date()),
        text
    }));
}

function generateNifty50() {
    const base = 19800;
    const change = dailyRandom.range(-0.8, 0.8);
    const value = base * (1 + change / 100);

    return {
        value: value.toFixed(2),
        change: change.toFixed(2),
        positive: change >= 0
    };
}


// ======================================================
// DISPLAY FUNCTIONS
// ======================================================

function displayBoardMeetings(data) {
    const tbody = document.getElementById('corporateTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.symbol}</td>
            <td>${item.date}</td>
            <td>${item.purpose}</td>
            <td>₹${item.ltp}</td>
            <td><a href="#">View Detail</a></td>
        </tr>
    `).join('');
}

function displayMarketWatch(data) {
    const container = document.getElementById('marketWatchList');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="market-watch-item">
            <div>${item.name}</div>
            <div>
                ${item.value}
                <span class="${item.positive ? 'positive' : 'negative'}">
                    ${item.positive ? '+' : ''}${item.change}%
                </span>
            </div>
        </div>
    `).join('');
}

function displayAnnouncements(data) {
    const container = document.getElementById('announcementsList');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="announcement-item">
            <div>${item.date}</div>
            <div>${item.text}</div>
        </div>
    `).join('');
}

function displayNifty50(data) {
    const valueEl = document.getElementById('niftyValue');
    const changeEl = document.getElementById('niftyChange');

    if (!valueEl || !changeEl) return;

    valueEl.textContent = data.value;
    changeEl.textContent = `(${data.positive ? '+' : ''}${data.change}%)`;
    changeEl.className = data.positive ? 'positive' : 'negative';
}


// ======================================================
// NAV ACTIVE AUTO DETECTION (FIXED)
// ======================================================

function setActiveNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPage = window.location.pathname.split('/').pop();

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (!href) return;

        const linkPage = href.split('/').pop();

        if (linkPage === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}


// ======================================================
// CLOCK FIX (Your ID was wrong before)
// ======================================================

function updateDateTime() {
    const el = document.getElementById('topDateTime');
    if (!el) return;

    const now = new Date();

    const formatted = now.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    el.textContent = formatted.toUpperCase();
}



// ======================================================
// TABS
// ======================================================

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}


// ======================================================
// INIT
// ======================================================

function init() {

    setActiveNav();

    displayBoardMeetings(generateBoardMeetings());
    displayMarketWatch(generateMarketWatch());
    displayAnnouncements(generateAnnouncements());
    displayNifty50(generateNifty50());

    updateDateTime();
    setInterval(updateDateTime, 1000);

    setupTabs();

    console.log('Corporate page loaded with daily seed:', getDailySeed());
}

document.addEventListener('DOMContentLoaded', init);
