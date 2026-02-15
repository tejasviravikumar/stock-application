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
// COMPANY DATA
// ===========================

const smeCompanies = [
    { symbol: 'SMEGOLD', name: 'Goldstone Infra Ltd.', basePrice: 145 },
    { symbol: 'TECHSME', name: 'Tech Solutions SME', basePrice: 82 },
    { symbol: 'FOODCORP', name: 'Food Processing Corp', basePrice: 215 },
    { symbol: 'SOLARIND', name: 'Solar Industry India', basePrice: 54 },
    { symbol: 'PRINTPRO', name: 'Print Professional Ltd', basePrice: 11 },
    { symbol: 'PHARMEX', name: 'Pharma Excellence', basePrice: 128 },
    { symbol: 'GREENPOW', name: 'Green Power Ltd', basePrice: 95 },
    { symbol: 'AUTOTECH', name: 'Auto Tech India', basePrice: 167 },
    { symbol: 'MEDIPLUS', name: 'Medi Plus Healthcare', basePrice: 203 },
    { symbol: 'EDUSERV', name: 'Edu Services Ltd', basePrice: 76 }
];

let currentCompany = smeCompanies[0];
let priceChart = null;
let volumeChart = null;

// ===========================
// CHART DATA GENERATION
// ===========================

function generateCandlestickData(basePrice, periods = 30) {
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < periods; i++) {
        const open = price;
        const change = dailyRandom.range(-3, 3);
        const close = open * (1 + change / 100);
        const high = Math.max(open, close) * (1 + dailyRandom.range(0, 1) / 100);
        const low = Math.min(open, close) * (1 - dailyRandom.range(0, 1) / 100);
        
        data.push({
            x: i,
            o: open,
            h: high,
            l: low,
            c: close
        });
        
        price = close;
    }
    
    return data;
}

function generateVolumeData(periods = 30) {
    const data = [];
    for (let i = 0; i < periods; i++) {
        data.push(dailyRandom.integer(50000, 500000));
    }
    return data;
}

function generateLineData(basePrice, periods = 30) {
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < periods; i++) {
        const change = dailyRandom.range(-2, 2);
        price = price * (1 + change / 100);
        data.push(price);
    }
    
    return data;
}

// ===========================
// CHART CREATION
// ===========================

function createPriceChart(type = 'candlestick') {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    if (priceChart) {
        priceChart.destroy();
    }
    
    const candleData = generateCandlestickData(currentCompany.basePrice);
    const lineData = generateLineData(currentCompany.basePrice);
    const labels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
    
    let chartConfig = {
        type: type === 'candlestick' ? 'bar' : type === 'area' ? 'line' : 'line',
        data: {
            labels: labels,
            datasets: [{
                label: currentCompany.symbol,
                data: type === 'candlestick' ? candleData.map(d => d.c) : lineData,
                backgroundColor: type === 'area' ? 'rgba(30, 64, 175, 0.1)' : 'rgba(30, 64, 175, 0.8)',
                borderColor: '#1e40af',
                borderWidth: 2,
                fill: type === 'area',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    };
    
    priceChart = new Chart(ctx, chartConfig);
}

function createVolumeChart() {
    const ctx = document.getElementById('volumeChart').getContext('2d');
    
    if (volumeChart) {
        volumeChart.destroy();
    }
    
    const volumeData = generateVolumeData();
    const labels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
    
    volumeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Volume',
                data: volumeData,
                backgroundColor: volumeData.map((_, i) => 
                    i % 2 === 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                ),
                borderColor: volumeData.map((_, i) => 
                    i % 2 === 0 ? '#10b981' : '#ef4444'
                ),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return (value / 1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// ===========================
// UI UPDATES
// ===========================

function updateStockInfo() {
    const candleData = generateCandlestickData(currentCompany.basePrice, 1)[0];
    const open = candleData.o;
    const close = candleData.c;
    const high = candleData.h;
    const low = candleData.l;
    const change = close - open;
    const changePercent = (change / open) * 100;
    const volume = dailyRandom.integer(100000, 2000000);
    
    document.getElementById('currentSymbol').textContent = currentCompany.symbol;
    document.getElementById('currentCompany').textContent = currentCompany.name;
    document.getElementById('currentPrice').textContent = '₹' + close.toFixed(2);
    
    const priceChangeEl = document.getElementById('priceChange');
    const changeText = (change >= 0 ? '+' : '') + change.toFixed(2) + 
                       ' (' + (changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%)';
    priceChangeEl.textContent = changeText;
    priceChangeEl.className = 'price-change ' + (change >= 0 ? 'positive' : 'negative');
    
    document.getElementById('openPrice').textContent = '₹' + open.toFixed(2);
    document.getElementById('highPrice').textContent = '₹' + high.toFixed(2);
    document.getElementById('lowPrice').textContent = '₹' + low.toFixed(2);
    document.getElementById('volumeValue').textContent = volume.toLocaleString('en-IN');
}

function populateSymbolDropdown() {
    const select = document.getElementById('symbolSelect');
    select.innerHTML = smeCompanies.map(company => 
        `<option value="${company.symbol}">${company.symbol} - ${company.name}</option>`
    ).join('');
}

function displayTechnicalIndicators() {
    const container = document.getElementById('indicatorsList');
    
    const rsi = dailyRandom.range(30, 70).toFixed(2);
    const macd = dailyRandom.range(-2, 2).toFixed(2);
    const sma20 = (currentCompany.basePrice * dailyRandom.range(0.95, 1.05)).toFixed(2);
    const ema50 = (currentCompany.basePrice * dailyRandom.range(0.92, 1.08)).toFixed(2);
    
    container.innerHTML = `
        <div class="indicator-item">
            <span class="indicator-label">RSI (14):</span>
            <span class="indicator-value ${rsi > 70 ? 'negative' : rsi < 30 ? 'positive' : ''}">${rsi}</span>
        </div>
        <div class="indicator-item">
            <span class="indicator-label">MACD:</span>
            <span class="indicator-value ${parseFloat(macd) >= 0 ? 'positive' : 'negative'}">${macd}</span>
        </div>
        <div class="indicator-item">
            <span class="indicator-label">SMA (20):</span>
            <span class="indicator-value">₹${sma20}</span>
        </div>
        <div class="indicator-item">
            <span class="indicator-label">EMA (50):</span>
            <span class="indicator-value">₹${ema50}</span>
        </div>
    `;
}

function displayMarketStats() {
    const container = document.getElementById('statsList');
    
    const marketCap = dailyRandom.range(100, 500).toFixed(2);
    const peRatio = dailyRandom.range(15, 35).toFixed(2);
    const week52High = (currentCompany.basePrice * 1.25).toFixed(2);
    const week52Low = (currentCompany.basePrice * 0.75).toFixed(2);
    
    container.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Market Cap:</span>
            <span class="stat-value">₹${marketCap} Cr</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">P/E Ratio:</span>
            <span class="stat-value">${peRatio}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">52W High:</span>
            <span class="stat-value">₹${week52High}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">52W Low:</span>
            <span class="stat-value">₹${week52Low}</span>
        </div>
    `;
}

function displayRecentTrades() {
    const container = document.getElementById('tradesList');
    const trades = [];
    
    for (let i = 0; i < 5; i++) {
        const price = currentCompany.basePrice * dailyRandom.range(0.98, 1.02);
        const qty = dailyRandom.integer(100, 1000);
        const time = `${dailyRandom.integer(9, 15)}:${String(dailyRandom.integer(0, 59)).padStart(2, '0')}`;
        trades.push({ price, qty, time });
    }
    
    container.innerHTML = trades.map(trade => `
        <div class="trade-item">
            <span class="trade-time">${trade.time}</span>
            <span class="trade-price">₹${trade.price.toFixed(2)}</span>
            <span class="trade-qty">${trade.qty}</span>
        </div>
    `).join('');
}

// ===========================
// EVENT HANDLERS
// ===========================

function setupEventListeners() {
    // Symbol selection
    document.getElementById('symbolSelect').addEventListener('change', (e) => {
        const symbol = e.target.value;
        currentCompany = smeCompanies.find(c => c.symbol === symbol);
        updateStockInfo();
        createPriceChart();
        createVolumeChart();
        displayTechnicalIndicators();
        displayMarketStats();
        displayRecentTrades();
    });
    
    // Timeframe buttons
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            createPriceChart();
        });
    });
    
    // Chart type buttons
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.getAttribute('data-type');
            createPriceChart(type);
        });
    });
    
    // Search functionality
    document.getElementById('symbolSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toUpperCase();
        const found = smeCompanies.find(c => c.symbol.includes(searchTerm) || c.name.toUpperCase().includes(searchTerm));
        if (found) {
            document.getElementById('symbolSelect').value = found.symbol;
            currentCompany = found;
            updateStockInfo();
            createPriceChart();
            createVolumeChart();
            displayTechnicalIndicators();
            displayMarketStats();
            displayRecentTrades();
        }
    });
}

function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).toUpperCase();
    
    const dateTimeEl = document.getElementById('topDateTime');
    if (dateTimeEl) {
        dateTimeEl.textContent = formatted;
    }
}

function displayNiftySME() {
    const baseValue = 12400;
    const change = dailyRandom.range(-1.5, 1.5);
    const value = baseValue * (1 + change / 100);
    
    const valueEl = document.getElementById('niftyBreadcrumbValue');
    const changeEl = document.getElementById('niftyBreadcrumbChange');
    
    if (valueEl && changeEl) {
        valueEl.textContent = value.toFixed(2);
        changeEl.textContent = `(${change >= 0 ? '+' : ''}${change.toFixed(2)}%)`;
        changeEl.className = change >= 0 ? 'positive' : 'negative';
    }
}

// ===========================
// INITIALIZATION
// ===========================

function init() {
    console.log('Initializing Charts page with daily seed:', getDailySeed());
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    populateSymbolDropdown();
    updateStockInfo();
    displayTechnicalIndicators();
    displayMarketStats();
    displayRecentTrades();
    displayNiftySME();
    
    createPriceChart();
    createVolumeChart();
    
    setupEventListeners();
    
    console.log('Charts page initialized. Data will change tomorrow.');
}

document.addEventListener('DOMContentLoaded', init);