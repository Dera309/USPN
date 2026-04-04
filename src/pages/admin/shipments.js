import { DB } from '../../../assets/js/data.js';
import '../../../assets/css/tailwind.css';
import '../../../assets/css/responsive.css';
import '../../../assets/css/uspn.css';

// Utilities and logout come from src/main.js & assets/js/data.js
function showToast(msg, type = 'success') {
  if (window.showToast) window.showToast(msg, type);
  else alert(msg);
}

let allShipments = [];
let currentFilter = 'all';
let searchQuery = '';

function render(loading = false) {
  const table = document.getElementById('shipments-table');
  const noRes = document.getElementById('no-results');

  if (loading) {
    table.innerHTML = Array(6).fill(0).map(() => `
      <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/15 ambient-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
        <div class="flex items-center gap-4">
          <div class="h-10 w-10 skeleton rounded-lg"></div>
          <div class="space-y-2">
            <div class="h-4 w-32 skeleton"></div>
            <div class="h-3 w-48 skeleton"></div>
          </div>
        </div>
        <div class="flex gap-2">
          <div class="h-6 w-16 skeleton"></div>
          <div class="h-6 w-20 skeleton rounded-full"></div>
        </div>
      </div>`).join('');
    noRes.classList.add('hidden');
    return;
  }

  let list = allShipments;
  if (currentFilter !== 'all') list = list.filter(s => s.status === currentFilter);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(s => (s.trackingNumber || '').toLowerCase().includes(q) || s.origin.toLowerCase().includes(q) || s.destination.toLowerCase().includes(q));
  }

  if (!list.length) {
    table.innerHTML = '';
    noRes.classList.remove('hidden');
    noRes.innerHTML = searchQuery ? 'No shipments match your search.' : '<div class="text-center py-12"><span class="material-symbols-outlined text-4xl text-outline mb-2">inventory_2</span><p>No shipments found.</p></div>';
    return;
  }
  noRes.classList.add('hidden');
  table.innerHTML = list.map(s => `
    <a href="shipment-edit.html?id=${DB.esc(s._id)}" class="group bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/15 ambient-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-high transition-colors block">
      <div class="flex items-center gap-4">
        <div class="h-10 w-10 items-center justify-center bg-surface-container-low rounded-lg hidden sm:flex"><span class="material-symbols-outlined text-outline text-sm">package_2</span></div>
        <div>
          <div class="text-primary font-bold text-sm">${s.trackingNumber ? DB.esc(s.trackingNumber) : '<span class="text-outline italic">Unassigned</span>'}</div>
          <div class="text-on-surface-variant text-xs">${DB.esc(s.origin)} → ${DB.esc(s.destination)}</div>
        </div>
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-xs text-outline">${DB.fmtDate(s.createdAt)}</span>
        ${DB.statusChip(s.status)}
        <span class="material-symbols-outlined text-outline group-hover:text-secondary transition-colors text-sm">edit</span>
      </div>
    </a>`).join('');
}

function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.id === 'filter-' + f;
    btn.classList.toggle('bg-primary', isActive);
    btn.classList.toggle('text-white', isActive);
    btn.classList.toggle('bg-surface-container-low', !isActive);
    btn.classList.toggle('text-on-surface-variant', !isActive);
  });
  render();
}
window.setFilter = setFilter;

; (async () => {
  const mainEl = document.getElementById('admin-main');
  if (mainEl) {
    mainEl.classList.remove('hidden');
    mainEl.classList.add('fade-in');
  }

  const user = DB.requireAuth('admin');
  if (!user) return;

  try {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = this.value.trim();
        render();
      });
    }

    render(true); // Show skeleton
    const data = await DB.getShipments();
    if (data && data.error) throw new Error(data.error);

    allShipments = Array.isArray(data) ? data : [];
    render();
  } catch (err) {
    console.error('[ADMIN] Error loading shipments:', err);
    const noRes = document.getElementById('no-results');
    if (noRes) {
      noRes.innerHTML = `
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-error mb-4 block">error</span>
          <h3 class="font-headline text-xl font-bold text-primary mb-2">Error loading shipments</h3>
          <p class="text-on-surface-variant mb-6">${DB.esc(err.message)}</p>
          <button onclick="window.location.reload()" class="bg-secondary text-white px-6 py-2 rounded-lg font-bold">Try Again</button>
        </div>`;
      noRes.classList.remove('hidden');
      document.getElementById('shipments-table').innerHTML = '';
    }
  }
})();
