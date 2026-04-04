import { DB } from '../../../assets/js/data.js';
import '../../../assets/css/tailwind.css';
import '../../../assets/css/responsive.css';
import '../../../assets/css/uspn.css';

// Utilities and logout come from src/main.js & assets/js/data.js
function showToast(msg, type = 'success') {
  if (window.showToast) window.showToast(msg, type);
  else alert(msg);
}

let shipment = null;

async function loadShipment() {
  const id = new URLSearchParams(window.location.search).get('id');
  const mainEl = document.getElementById('admin-main');
  const contentEl = document.getElementById('edit-content');
  const errorEl = document.getElementById('not-found-msg');

  try {
    shipment = await DB.getShipmentById(id);
    if (!shipment || shipment.error) {
      errorEl.classList.remove('hidden');
      return;
    }
    contentEl.classList.remove('hidden');
    document.getElementById('page-title').textContent = shipment.trackingNumber ? DB.esc(shipment.trackingNumber) : 'Unassigned Shipment';
    document.getElementById('e-tracking').value = shipment.trackingNumber || '';
    document.getElementById('e-status').value = shipment.status;
    document.getElementById('e-eta').value = shipment.estimatedDelivery || '';
    document.getElementById('e-location').value = shipment.currentLocation || '';
    document.getElementById('e-lat').value = shipment.currentLat || '';
    document.getElementById('e-lng').value = shipment.currentLng || '';
    document.getElementById('e-route').textContent = DB.esc(shipment.origin) + ' → ' + DB.esc(shipment.destination);
    document.getElementById('e-cargo-info').textContent = `${DB.esc(shipment.cargoType)} · ${DB.esc(shipment.weight)} kg`;
    renderLog();
  } catch (err) {
    showToast('Failed to load shipment data.', 'error');
  }
}

async function autoGenTracking() {
  try {
    const data = await DB.generateTrackingNumber();
    document.getElementById('e-tracking').value = data;
  } catch (err) {
    showToast('Failed to generate tracking number.', 'error');
  }
}

async function saveChanges() {
  const btn = document.querySelector('button[onclick="saveChanges()"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm mr-2">sync</span> Saving...';

  const updates = {
    trackingNumber: document.getElementById('e-tracking').value.trim() || null,
    status: document.getElementById('e-status').value,
    estimatedDelivery: document.getElementById('e-eta').value || null,
    currentLocation: document.getElementById('e-location').value.trim(),
    currentLat: parseFloat(document.getElementById('e-lat').value) || null,
    currentLng: parseFloat(document.getElementById('e-lng').value) || null,
  };

  try {
    const updated = await DB.updateShipment(shipment._id, updates);
    if (updated.error) throw new Error(updated.error);
    shipment = updated;
    document.getElementById('page-title').textContent = updated.trackingNumber || 'Unassigned Shipment';
    showToast('Changes saved successfully!');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

async function addLogEntry() {
  const btn = document.querySelector('button[onclick="addLogEntry()"]');
  const location = document.getElementById('log-location').value.trim();
  const event = document.getElementById('log-event').value.trim();
  
  if (!location || !event) {
    showToast('Please fill all log fields.', 'error');
    return;
  }

  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm mr-2">sync</span> Adding...';

  try {
    const updated = await DB.addActivityLog(shipment._id, { location, event });
    if (updated.error) throw new Error(updated.error);
    shipment = updated;
    document.getElementById('log-location').value = '';
    document.getElementById('log-event').value = '';
    renderLog();
    showToast('Log entry added.');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

function renderLog() {
  const logs = [...(shipment.activityLog || [])].reverse();
  document.getElementById('log-entries').innerHTML = logs.map((entry, i) => `
    <div class="flex gap-8 group pb-8">
      <div class="flex flex-col items-center">
        <div class="w-3 h-3 rounded-full ${i === 0 ? 'bg-secondary ring-4 ring-secondary/20' : 'bg-outline-variant'}"></div>
        ${i < logs.length - 1 ? '<div class="w-px flex-1 bg-outline-variant/30 mt-4"></div>' : ''}
      </div>
      <div class="flex-1 -mt-1 pb-4">
        <div class="flex justify-between items-start mb-1 flex-wrap gap-2">
          <h4 class="font-bold text-primary text-sm">${DB.esc(entry.event)}</h4>
          <span class="text-xs font-medium text-on-surface-variant">${DB.fmtDateTime(entry.timestamp)}</span>
        </div>
        <p class="text-on-surface-variant text-sm">${DB.esc(entry.location)}</p>
      </div>
    </div>`).join('');
}

window.autoGenTracking = autoGenTracking;
window.saveChanges = saveChanges;
window.addLogEntry = addLogEntry;

; (async () => {
  const mainEl = document.getElementById('admin-main');
  if (mainEl) {
    mainEl.classList.remove('hidden');
    mainEl.classList.add('fade-in');
  }

  const adminUser = DB.requireAuth('admin');
  if (adminUser) {
    loadShipment();
  }
})();
