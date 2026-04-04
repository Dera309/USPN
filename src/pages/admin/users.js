import { DB } from '../../../assets/js/data.js';
import '../../../assets/css/tailwind.css';
import '../../../assets/css/responsive.css';
import '../../../assets/css/uspn.css';

// Utilities and logout come from src/main.js & assets/js/data.js
function showToast(msg, type = 'success') {
  if (window.showToast) window.showToast(msg, type);
  else alert(msg);
}

function renderUsers(users, loading = false) {
  const list = document.getElementById('users-list');
  if (loading) {
    list.innerHTML = Array(5).fill(0).map(() => `
      <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/15 ambient-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full skeleton"></div>
          <div class="space-y-2">
            <div class="h-4 w-32 skeleton"></div>
            <div class="h-3 w-48 skeleton"></div>
          </div>
        </div>
        <div class="flex gap-2">
          <div class="h-6 w-20 skeleton rounded-full"></div>
          <div class="h-6 w-12 skeleton"></div>
        </div>
      </div>`).join('');
    return;
  }
  if (!users || !users.length) { list.innerHTML = '<p class="text-center py-12 text-on-surface-variant">No users registered yet.</p>'; return; }
  list.innerHTML = users.map(u => {
    const badge = u.status === 'suspended'
      ? '<span class="bg-error-container text-on-error-container px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Suspended</span>'
      : '<span class="bg-green-100 text-green-800 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Active</span>';
    const toggle = u.status === 'suspended'
      ? `<button onclick="toggleStatus('${u._id}','active')" class="text-xs font-bold text-green-700 hover:underline">Reactivate</button>`
      : `<button onclick="toggleStatus('${u._id}','suspended')" class="text-xs font-bold text-red-600 hover:underline">Deactivate</button>`;
    return `
      <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/15 ambient-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-outline">person</span></div>
          <div>
            <div class="font-bold text-primary text-sm">${DB.esc(u.name)}</div>
            <div class="text-on-surface-variant text-xs">${DB.esc(u.email)}</div>
            <div class="text-outline text-xs mt-0.5">Joined ${DB.fmtDate(u.createdAt)}</div>
          </div>
        </div>
        <div class="flex items-center gap-4 flex-wrap">
          ${badge}
          <button onclick="openEdit('${u._id}','${DB.esc(u.name)}','${DB.esc(u.email)}','${u.role}')" class="text-xs font-bold text-secondary hover:underline flex items-center gap-1"><span class="material-symbols-outlined text-sm">edit</span> Edit</button>
          ${toggle}
        </div>
      </div>`;
  }).join('');
}

function openEdit(id, name, email, role) {
  document.getElementById('modal-user-id').value = id;
  document.getElementById('modal-name').value = name;
  document.getElementById('modal-email').value = email;
  document.getElementById('modal-role').value = role;
  document.getElementById('edit-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('edit-modal').classList.add('hidden'); }

async function toggleStatus(id, newStatus) {
  try {
    const res = await DB.updateUser(id, { status: newStatus });
    if (res && res.error) throw new Error(res.error);
    const users = await DB.getUsers();
    renderUsers(users);
    showToast(newStatus === 'suspended' ? 'User deactivated.' : 'User reactivated.');
  } catch (err) {
    showToast('Failed to update status: ' + err.message, 'error');
  }
}

window.openEdit = openEdit;
window.closeModal = closeModal;
window.toggleStatus = toggleStatus;

; (async () => {
  const mainEl = document.getElementById('admin-main');
  if (mainEl) {
    mainEl.classList.remove('hidden');
    mainEl.classList.add('fade-in');
  }

  const adminUser = DB.requireAuth('admin');
  if (adminUser) {
    renderUsers(null, true); // Show skeleton
    try {
      const users = await DB.getUsers();
      if (users && users.error) throw new Error(users.error);
      renderUsers(users);
    } catch (err) {
      document.getElementById('users-list').innerHTML = `<div class="text-center py-12"><p class="text-error font-bold">${DB.esc(err.message)}</p></div>`;
    }
  }

  const editUserForm = document.getElementById('edit-user-form');
  if (editUserForm) {
    editUserForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Updating...';

      const id = document.getElementById('modal-user-id').value;
      try {
        const res = await DB.updateUser(id, {
          name: document.getElementById('modal-name').value.trim(),
          email: document.getElementById('modal-email').value.trim(),
          role: document.getElementById('modal-role').value
        });
        if (res && res.error) throw new Error(res.error);
        closeModal();
        const users = await DB.getUsers();
        renderUsers(users);
        showToast('User updated successfully.');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  }
})();
