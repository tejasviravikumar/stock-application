// ==========================
// Generate resources data
// ==========================
function generateResources() {
    return [
        {
            id: 1,
            icon: 'fa-building-columns',
            title: 'Basics of Stock Market',
            description: 'Learn what a share actually is and how the global stock exchanges facilitate the buying and selling of ownership.',
            readTime: '5 min read',
            views: '12.4k views',
            badge: 'easy',
            action: 'Learn Now',
            status: null
        },
        {
            id: 2,
            icon: 'fa-wallet',
            title: 'Understanding Dividends',
            description: 'Discover how companies share their profits with investors and how to build a passive income stream through stocks.',
            readTime: '8 min read',
            views: null,
            badge: null,
            action: 'Review',
            status: 'Completed'
        },
        {
            id: 3,
            icon: 'fa-file-invoice-dollar',
            title: 'Reading a Balance Sheet',
            description: 'Assets, liabilities, and equity explained. Learn to judge the financial health of any company before you invest.',
            readTime: null,
            views: '8.9k views',
            badge: 'intermediate',
            action: 'Start Lesson',
            status: null
        },
        {
            id: 4,
            icon: 'fa-chart-simple',
            title: 'Introduction to Candles',
            description: 'Unlock the visual language of price action. Understand what each candlestick pattern will tell you about market sentiment.',
            readTime: '4 min read',
            views: '21.2k views',
            badge: null,
            action: 'Learn Now',
            status: null
        },
        {
            id: 5,
            icon: 'fa-shield-halved',
            title: 'The 2% Risk Rule',
            description: 'Protect your capital. Learn the fundamental rule of professional risk management to ensure you stay in the game.',
            readTime: null,
            views: null,
            badge: 'crucial',
            action: 'Read Guide',
            rating: 'Highly Rated'
        },
        {
            id: 6,
            icon: 'fa-brain',
            title: 'Psychology of Trading',
            description: 'Master your emotions. Learn how fear and greed impact decision-making and how to stay disciplined.',
            readTime: '10 min read',
            views: null,
            badge: null,
            action: 'Start Lesson',
            status: 'New Course'
        }
    ];
}


// ==========================
// Update Date & Time
// ==========================
function updateDateTime() {
    const now = new Date();

    const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    };

    const date = now.toLocaleDateString('en-IN', dateOptions).toUpperCase();
    const time = now.toLocaleTimeString('en-IN');

    const topDate = document.getElementById('topDateTime');

    if (topDate) {
        topDate.textContent = `${date} | ${time}`;
    }
}


// ==========================
// Display Resources
// ==========================
function displayResources() {
    const container = document.getElementById('resourcesGrid');
    if (!container) return; // Safety check

    const resources = generateResources();

    container.innerHTML = resources.map(resource => {

        // Badge (difficulty / importance)
        let badgeHtml = '';
        if (resource.badge) {
            const badgeText =
                resource.badge.charAt(0).toUpperCase() +
                resource.badge.slice(1);

            badgeHtml = `
                <div class="resource-badge ${resource.badge}">
                    ${badgeText}
                </div>
            `;
        }

        // Footer Meta
        let footerHtml = '';

        if (resource.status) {
            footerHtml += `
                <div class="resource-status">
                    <i class="fa-solid fa-check-circle"></i>
                    <span>${resource.status}</span>
                </div>
            `;
        }

        if (resource.rating) {
            footerHtml += `
                <div class="resource-rating">
                    <i class="fa-solid fa-star"></i>
                    <span>${resource.rating}</span>
                </div>
            `;
        }

        if (resource.views) {
            footerHtml += `
                <div class="resource-meta">
                    <i class="fa-solid fa-eye"></i>
                    <span>${resource.views}</span>
                </div>
            `;
        }

        if (resource.readTime) {
            footerHtml += `
                <div class="resource-meta">
                    <i class="fa-solid fa-clock"></i>
                    <span>${resource.readTime}</span>
                </div>
            `;
        }

        return `
            <div class="resource-card">
                <div class="resource-header">
                    <div class="resource-icon">
                        <i class="fa-solid ${resource.icon}"></i>
                    </div>
                    ${badgeHtml}
                </div>

                <h3>${resource.title}</h3>
                <p>${resource.description}</p>

                <div class="resource-footer">
                    ${footerHtml}
                    <a href="#" class="resource-action">
                        ${resource.action} →
                    </a>
                </div>
            </div>
        `;
    }).join('');
}


// ==========================
// Category Tabs
// ==========================
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            console.log('Category switched to:',
                tab.getAttribute('data-category'));
        });
    });
}


// ==========================
// Initialize
// ==========================
function init() {
    updateDateTime();
    setInterval(updateDateTime, 1000);

    displayResources();
    setupCategoryTabs();
}

document.addEventListener('DOMContentLoaded', init);
