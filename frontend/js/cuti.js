import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const API_KARYAWAN = 'http://localhost:5000/api/karyawan';
const API_CUTI = 'http://localhost:5000/api/cuti';
let daftarKaryawan = [];

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('userEmail').textContent = user.email;
    muatKaryawanUntukSelect();
    muatCuti();
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
document.getElementById('menuBtn')?.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
});
overlay?.addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
});

async function muatKaryawanUntukSelect() {
  const res = await fetch(API_KARYAWAN);
  daftarKaryawan = await res.json();
  const select = document.getElementById('pilihKaryawan');
  select.innerHTML = daftarKaryawan.length
    ? daftarKaryawan.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')
    : '<option value="">Belum ada data karyawan</option>';
}

function namaKaryawan(id) {
  const k = daftarKaryawan.find(x => x.id === id);
  return k ? k.nama : '(karyawan tidak ditemukan)';
}

// Modal
const modal = document.getElementById('modal');
document.getElementById('btnAjukan').addEventListener('click', () => {
  document.getElementById('cutiForm').reset();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
});
document.getElementById('btnBatal').addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});

document.getElementById('cutiForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    idKaryawan: document.getElementById('pilihKaryawan').value,
    tanggalMulai: document.getElementById('tanggalMulai').value,
    tanggalSelesai: document.getElementById('tanggalSelesai').value,
    alasan: document.getElementById('alasan').value
  };

  await fetch(API_CUTI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  modal.classList.add('hidden');
  modal.classList.remove('flex');
  muatCuti();
});

async function muatCuti() {
  const res = await fetch(API_CUTI);
  const data = await res.json();
  renderTabel(data.reverse());
}

function badgeStatus(status) {
  const warna = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700'
  };
  const label = { pending: 'Pending', approved: 'Disetujui', rejected: 'Ditolak' };
  return `<span class="px-2 py-1 rounded-full text-xs font-medium ${warna[status] || 'bg-slate-100 text-slate-600'}">${label[status] || status}</span>`;
}

function renderTabel(data) {
  const tbody = document.getElementById('tabelCuti');
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td class="px-5 py-4 text-slate-400" colspan="6">Belum ada pengajuan cuti.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(c => `
    <tr class="border-b border-slate-50 last:border-0">
      <td class="px-5 py-3 text-slate-700">${namaKaryawan(c.idKaryawan)}</td>
      <td class="px-5 py-3 text-slate-700">${c.tanggalMulai ?? '-'}</td>
      <td class="px-5 py-3 text-slate-700">${c.tanggalSelesai ?? '-'}</td>
      <td class="px-5 py-3 text-slate-700">${c.alasan ?? '-'}</td>
      <td class="px-5 py-3">${badgeStatus(c.status)}</td>
      <td class="px-5 py-3 text-right space-x-2">
        ${c.status === 'pending' ? `
          <button data-id="${c.id}" data-status="approved" class="btnAksi text-emerald-600 hover:underline text-sm">Approve</button>
          <button data-id="${c.id}" data-status="rejected" class="btnAksi text-red-500 hover:underline text-sm">Reject</button>
        ` : ''}
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.btnAksi').forEach(btn =>
    btn.addEventListener('click', () => updateStatus(btn.dataset.id, btn.dataset.status))
  );
}

async function updateStatus(id, status) {
  await fetch(`${API_CUTI}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  muatCuti();
}