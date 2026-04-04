// USPN Shared Components - assets/js/components.js

function getTopAppBar(activePage = '') {
    const pages = [
        { href: '../index.html', label: 'Home', key: 'home' },
        { href: 'services.html', label: 'Services', key: 'services' },
        { href: 'tracking.html', label: 'Tracking', key: 'tracking' },
        { href: 'about.html', label: 'About Us', key: 'about' },
    ];

    const navLinks = pages.map(p => {
        const active = activePage === p.key;
        return `<a href="${p.href}" class="${active ? 'text-orange-600 font-extrabold border-b-2 border-orange-600 py-1' : 'text-slate-600 font-medium hover:text-orange-500'} transition-colors duration-300">${p.label}</a>`;
    }).join('');

    return `
<header class="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl shadow-xl shadow-slate-900/5">
  <nav class="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
    <a href="../index.html" class="flex items-center gap-2">
      <span class="material-symbols-outlined text-orange-600 text-3xl">local_shipping</span>
      <span class="text-2xl font-black uppercase tracking-widest text-slate-950 font-headline">USPN</span>
    </a>
    <div class="hidden md:flex items-center gap-8" id="nav-links">
      ${navLinks}
    </div>
    <div class="hidden md:flex items-center gap-4" id="nav-auth"></div>
    <button id="mobile-menu-btn" class="md:hidden p-2" aria-label="Open menu">
      <span class="material-symbols-outlined text-3xl text-slate-900">menu</span>
    </button>
  </nav>
  <!-- Mobile drawer -->
  <div id="mobile-menu" class="hidden md:hidden bg-slate-50/95 backdrop-blur-xl border-t border-outline-variant/20 px-8 py-6 space-y-4">
    ${pages.map(p => `<a href="${p.href}" class="block text-slate-700 font-medium py-2 hover:text-orange-500 transition-colors">${p.label}</a>`).join('')}
    <div id="mobile-nav-auth" class="pt-4 space-y-3"></div>
  </div>
</header>`;
}

function getFooter(rootPrefix = '..') {
    return `
<footer class="w-full py-12 mt-auto bg-slate-950 border-t border-slate-800/50">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-8">
    <div class="space-y-6">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-orange-500 text-2xl">local_shipping</span>
        <span class="text-lg font-bold text-white font-headline uppercase tracking-widest">USPN</span>
      </div>
      <p class="text-slate-400 text-sm leading-relaxed max-w-xs">Pioneering high-precision global logistics and supply chain architecture for industry leaders worldwide.</p>
      <div class="flex gap-4">
        <a href="#" class="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors"><span class="material-symbols-outlined text-sm">public</span></a>
        <a href="#" class="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors"><span class="material-symbols-outlined text-sm">hub</span></a>
      </div>
    </div>
    <div class="space-y-4">
      <h4 class="text-white font-semibold font-headline">Navigation</h4>
      <ul class="space-y-2">
        <li><a href="${rootPrefix}/index.html" class="text-slate-500 text-sm hover:text-orange-400 transition-all">Home</a></li>
        <li><a href="${rootPrefix}/pages/services.html" class="text-slate-500 text-sm hover:text-orange-400 transition-all">Services</a></li>
        <li><a href="${rootPrefix}/pages/tracking.html" class="text-slate-500 text-sm hover:text-orange-400 transition-all">Tracking</a></li>
        <li><a href="${rootPrefix}/pages/contact.html" class="text-slate-500 text-sm hover:text-orange-400 transition-all">Contact Us</a></li>
      </ul>
    </div>
    <div class="space-y-4">
      <h4 class="text-white font-semibold font-headline">Company</h4>
      <ul class="space-y-2">
        <li><a href="${rootPrefix}/pages/about.html" class="text-slate-500 text-sm hover:text-orange-400 transition-all">About Us</a></li>
        <li><a href="${rootPrefix}/pages/quote.html" class="text-slate-500 text-sm hover:text-orange-400 transition-all">Get a Quote</a></li>
        <li><a href="#" class="text-slate-500 text-sm hover:text-orange-400 transition-all">Privacy Policy</a></li>
        <li><a href="#" class="text-slate-500 text-sm hover:text-orange-400 transition-all">Terms of Service</a></li>
      </ul>
    </div>
    <div class="space-y-4">
      <h4 class="text-white font-semibold font-headline">Newsletter</h4>
      <p class="text-slate-400 text-sm">Get logistics insights and market updates directly in your inbox.</p>
      <form onsubmit="event.preventDefault(); showToast('Subscribed successfully!');" class="flex flex-col gap-2">
        <input type="email" placeholder="Your email" class="bg-slate-900 border-slate-800 text-white rounded-lg p-3 text-sm focus:ring-orange-500 focus:border-orange-500" />
        <button class="bg-orange-500 text-white font-bold rounded-lg p-3 text-sm hover:bg-orange-600 transition-all">Subscribe</button>
      </form>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-8 mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
    <p class="text-sm text-slate-400">© 2024 USPN. All rights reserved.</p>
    <div class="flex gap-8 text-xs text-slate-600 font-label uppercase tracking-widest">
      <span>London</span><span>Shanghai</span><span>New York</span><span>Singapore</span>
    </div>
  </div>
</footer>`;
}

function initNav(activePage = '', rootPrefix = '..') {
    // Inject TopAppBar
    const headerPlaceholder = document.getElementById('topappbar');
    if (headerPlaceholder) headerPlaceholder.outerHTML = getTopAppBar(activePage);

    // Inject Footer
    const footerPlaceholder = document.getElementById('footer');
    if (footerPlaceholder) footerPlaceholder.outerHTML = getFooter(rootPrefix);

    // Auth links
    const user = DB.getCurrentUser();
    const authHTML = buildAuthHTML(user, rootPrefix);
    const navAuth = document.getElementById('nav-auth');
    const mobileAuth = document.getElementById('mobile-nav-auth');
    if (navAuth) navAuth.innerHTML = authHTML.desktop;
    if (mobileAuth) mobileAuth.innerHTML = authHTML.mobile;

    // Mobile menu toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));
}

function buildAuthHTML(user, rootPrefix = '..') {
    if (!user) {
        return {
            desktop: `<a href="${rootPrefix}/pages/login.html" class="text-slate-600 font-medium hover:text-orange-500 transition-colors">Login</a>
                      <a href="${rootPrefix}/pages/register.html" class="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-all">Register</a>`,
            mobile: `<a href="${rootPrefix}/pages/login.html" class="block text-slate-700 font-medium py-2">Login</a>
                     <a href="${rootPrefix}/pages/register.html" class="block bg-secondary text-white text-center py-3 rounded-lg font-bold">Register</a>`
        };
    }
    if (user.role === 'admin') {
        return {
            desktop: `<a href="${rootPrefix}/pages/admin/dashboard.html" class="text-slate-600 font-medium hover:text-orange-500 transition-colors">Admin</a>
                      <button onclick="logout()" class="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all">Logout</button>`,
            mobile: `<a href="${rootPrefix}/pages/admin/dashboard.html" class="block text-slate-700 font-medium py-2">Admin Dashboard</a>
                     <button onclick="logout()" class="block w-full bg-secondary text-white text-center py-3 rounded-lg font-bold">Logout</button>`
        };
    }
    return {
        desktop: `<a href="${rootPrefix}/pages/dashboard.html" class="text-slate-600 font-medium hover:text-orange-500 transition-colors">Dashboard</a>
                  <button onclick="logout()" class="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all">Logout</button>`,
        mobile: `<a href="${rootPrefix}/pages/dashboard.html" class="block text-slate-700 font-medium py-2">My Dashboard</a>
                 <button onclick="logout()" class="block w-full bg-secondary text-white text-center py-3 rounded-lg font-bold">Logout</button>`
    };
}
