// USPN Utilities - assets/js/utils.js
import { DB } from './data.js'

// ── Google Maps Static API ─────────────────────────────────────────────────
// Replace with your actual API key
const MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_STATIC_API_KEY';

function mapEmbed(lat, lng, zoom = 10, width = 600, height = 300) {
    if (!lat || !lng) return null;
    const marker = `color:0xFE6B00|${lat},${lng}`;
    const style = [
        'feature:all|element:labels.text.fill|color:0x44474d',
        'feature:water|element:geometry|color:0x0d1c32',
        'feature:road|element:geometry|color:0x191c1d',
        'feature:landscape|element:geometry|color:0xf3f4f5'
    ].map(s => `style=${encodeURIComponent(s)}`).join('&');
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&markers=${encodeURIComponent(marker)}&${style}&key=${MAPS_API_KEY}`;
}

function mapEmbedByLocation(locationName, zoom = 8, width = 600, height = 300) {
    const marker = `color:0xFE6B00|${encodeURIComponent(locationName)}`;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(locationName)}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&markers=${marker}&key=${MAPS_API_KEY}`;
}

// ── Status Chip HTML ───────────────────────────────────────────────────────
function statusChip(status) {
    const map = {
        'In Transit':  'bg-secondary-container text-on-secondary-container',
        'Pending':     'bg-surface-variant text-on-surface-variant',
        'Delayed':     'bg-error-container text-on-error-container',
        'Delivered':   'bg-green-100 text-green-800',
        'Cancelled':   'bg-surface-container-highest text-outline'
    };
    const cls = map[status] || map['Pending'];
    return `<span class="${cls} px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">${status}</span>`;
}

// ── Format date ────────────────────────────────────────────────────────────
function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateTime(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Nav auth state ─────────────────────────────────────────────────────────
function renderNavAuth(containerId, activePage = '') {
    const user = DB.getCurrentUser();
    const el = document.getElementById(containerId);
    if (!el) return;

    const pages = [
        { href: '/index.html', label: 'Home', key: 'home' },
        { href: '/pages/services.html', label: 'Services', key: 'services' },
        { href: '/pages/tracking.html', label: 'Tracking', key: 'tracking' },
        { href: '/pages/about.html', label: 'About Us', key: 'about' },
    ];

    const navLinks = pages.map(p => {
        const active = activePage === p.key;
        return `<a href="${p.href}" class="${active ? 'text-orange-600 font-extrabold border-b-2 border-orange-600' : 'text-slate-600 font-medium hover:text-orange-500'} transition-colors duration-300">${p.label}</a>`;
    }).join('');

    let authLinks = '';
    if (!user) {
        authLinks = `<a href="/pages/login.html" class="text-slate-600 font-medium hover:text-orange-500 transition-colors">Login</a>
                     <a href="/pages/register.html" class="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-all">Register</a>`;
    } else if (user.role === 'admin') {
        authLinks = `<a href="/pages/admin/dashboard.html" class="text-slate-600 font-medium hover:text-orange-500 transition-colors">Admin</a>
                     <button onclick="logout()" class="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all">Logout</button>`;
    } else {
        authLinks = `<a href="/pages/dashboard.html" class="text-slate-600 font-medium hover:text-orange-500 transition-colors">Dashboard</a>
                     <button onclick="logout()" class="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all">Logout</button>`;
    }

    el.innerHTML = `${navLinks}${authLinks}`;
}

function logout() {
    DB.clearSession();
    // Navigate to root index relative to current page depth
    const depth = (window.location.pathname.match(/\//g) || []).length;
    const prefix = depth <= 2 ? './' : depth === 3 ? '../' : '../../';
    window.location.href = prefix + 'index.html';
}

// ── Toast notification ─────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    const bg = type === 'success' ? 'bg-primary-container text-white' : 'bg-error-container text-on-error-container';
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 z-[9999] ${bg} px-6 py-4 rounded-xl font-body font-medium ambient-shadow transition-all`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// Expose globals for inline page scripts
window.logout = logout;
window.showToast = showToast;
window.mapEmbed = mapEmbed;
window.mapEmbedByLocation = mapEmbedByLocation;
window.statusChip = statusChip;
window.fmtDate = fmtDate;
window.fmtDateTime = fmtDateTime;
