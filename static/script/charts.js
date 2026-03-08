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
let candlestickSeries = null;
let lineSeries = null;
let areaSeries = null;
let volumeSeries = null;
let currentChartType = 'candlestick';

// ===========================
// CHART DATA GENERATION
// ===========================

function generateCandlestickData(basePrice, periods = 90) {
    const data = [];
    let price = basePrice;
    const now = new Date();
    
    for (let i = periods - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) {
            continue;
        }
        
        const open = price;
        const change = dailyRandom.range(-3, 3);
        const close = open * (1 + change / 100);
        const high = Math.max(open, close) * (1 + dailyRandom.range(0, 1.5) / 100);
        const low = Math.min(open, close) * (1 - dailyRandom.range(0, 1.5) / 100);
        
        data.push({
            time: Math.floor(date.getTime() / 1000), // Unix timestamp in seconds
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2))
        });
        
        price = close;
    }
    
    return data;
}

function generateVolumeData(candleData) {
    return candleData.map(candle => {
        const volume = dailyRandom.integer(50000, 500000);
        return {
            time: candle.time,
            value: volume,
            color: candle.close >= candle.open ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        };
    });
}

function generateLineData(candleData) {
    return candleData.map(candle => ({
        time: candle.time,
        value: candle.close
    }));
}

// ===========================
// CHART CREATION
// ===========================

function createPriceChart(type = 'candlestick') {
    currentChartType = type;
    
    // Remove existing chart if it exists
    const container = document.getElementById('priceChart');
    container.innerHTML = '';
    
    // Create new chart
    priceChart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 500,
        layout: {
            background: { color: '#ffffff' },
            textColor: '#64748b',
        },
        grid: {
            vertLines: { color: '#f1f5f9' },
            horzLines: { color: '#f1f5f9' },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderColor: '#e2e8f0',
        },
        timeScale: {
            borderColor: '#e2e8f0',
            timeVisible: true,
            secondsVisible: false,
        },
    });
    
    const candleData = generateCandlestickData(currentCompany.basePrice);
    
    if (type === 'candlestick') {
        candlestickSeries = priceChart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });
        candlestickSeries.setData(candleData);
    } else if (type === 'line') {
        const lineData = generateLineData(candleData);
        lineSeries = priceChart.addLineSeries({
            color: '#1e40af',
            lineWidth: 2,
        });
        lineSeries.setData(lineData);
    } else if (type === 'area') {
        const lineData = generateLineData(candleData);
        areaSeries = priceChart.addAreaSeries({
            topColor: 'rgba(30, 64, 175, 0.4)',
            bottomColor: 'rgba(30, 64, 175, 0.05)',
            lineColor: '#1e40af',
            lineWidth: 2,
        });
        areaSeries.setData(lineData);
    }
    
    priceChart.timeScale().fitContent();
    
    // Update stock info with latest candle
    const latestCandle = candleData[candleData.length - 1];
    updateStockInfoFromCandle(latestCandle);
}

function createVolumeChart() {
    const container = document.getElementById('volumeChart');
    container.innerHTML = '';
    
    volumeChart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 150,
        layout: {
            background: { color: '#ffffff' },
            textColor: '#64748b',
        },
        grid: {
            vertLines: { color: '#f1f5f9' },
            horzLines: { color: '#f1f5f9' },
        },
        rightPriceScale: {
            borderColor: '#e2e8f0',
        },
        timeScale: {
            borderColor: '#e2e8f0',
            timeVisible: true,
            secondsVisible: false,
        },
    });
    
    const candleData = generateCandlestickData(currentCompany.basePrice);
    const volumeData = generateVolumeData(candleData);
    
    volumeSeries = volumeChart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: '',
    });
    
    volumeSeries.setData(volumeData);
    volumeChart.timeScale().fitContent();
}

// ===========================
// UI UPDATES
// ===========================

function updateStockInfoFromCandle(candle) {
    const open = candle.open;
    const close = candle.close;
    const high = candle.high;
    const low = candle.low;
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
        createPriceChart(currentChartType);
        createVolumeChart();
        displayTechnicalIndicators();
        displayMarketStats();
        displayRecentTrades();
    });
    
    // Timeframe buttons (placeholder - different data periods)
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            createPriceChart(currentChartType);
            createVolumeChart();
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
            createPriceChart(currentChartType);
            createVolumeChart();
            displayTechnicalIndicators();
            displayMarketStats();
            displayRecentTrades();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (priceChart) {
            const container = document.getElementById('priceChart');
            priceChart.applyOptions({
                width: container.clientWidth
            });
        }
        if (volumeChart) {
            const container = document.getElementById('volumeChart');
            volumeChart.applyOptions({
                width: container.clientWidth
            });
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
    displayTechnicalIndicators();
    displayMarketStats();
    displayRecentTrades();
    displayNiftySME();
    
    createPriceChart('candlestick');
    createVolumeChart();
    
    setupEventListeners();
    
    console.log('Professional candlestick charts initialized. Data will change tomorrow.');
}

document.addEventListener('DOMContentLoaded', init);