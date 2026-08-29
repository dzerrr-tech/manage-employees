import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { API_BASE_URL } from './api-config.js';

const API_KARYAWAN = `${API_BASE_URL}/karyawan`;
const API_ABSENSI = `${API_BASE_URL}/absensi`;
let daftarKaryawan = [];

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('userEmail').textContent = user.email;
    muatKaryawanUntukSelect();
    muatAbsensi();
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
  if (daftarKaryawan.length === 0) {
    select.innerHTML = '<option value="">Belum ada data karyawan</option>';
    return;
  }
  select.innerHTML = daftarKaryawan.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
}

document.getElementById('absensiForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const idKaryawan = document.getElementById('pilihKaryawan').value;
  if (!idKaryawan) return;

  const sekarang = new Date();
  const tanggal = sekarang.toISOString().slice(0, 10);
  const jam = sekarang.toTimeString().slice(0, 5);

  await fetch(API_ABSENSI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idKaryawan, tanggal, jamMasuk: jam, jamKeluar: '' })
  });

  muatAbsensi();
});

async function muatAbsensi() {
  const res = await fetch(API_ABSENSI);
  const data = await res.json();
  renderTabel(data.reverse());
}

function namaKaryawan(id) {
  const k = daftarKaryawan.find(x => x.id === id);
  return k ? k.nama : '(karyawan tidak ditemukan)';
}

function renderTabel(data) {
  const tbody = document.getElementById('tabelAbsensi');
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td class="px-5 py-4 text-slate-400" colspan="5">Belum ada data absensi.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(a => `
    <tr class="border-b border-slate-50 last:border-0">
      <td class="px-5 py-3 text-slate-700">${namaKaryawan(a.idKaryawan)}</td>
      <td class="px-5 py-3 text-slate-700">${a.tanggal ?? '-'}</td>
      <td class="px-5 py-3 text-slate-700">${a.jamMasuk ?? '-'}</td>
      <td class="px-5 py-3 text-slate-700">${a.jamKeluar || '-'}</td>
      <td class="px-5 py-3 text-right">
        ${!a.jamKeluar ? `<button data-id="${a.id}" class="btnCheckout text-blue-600 hover:underline text-sm">Check Out</button>` : ''}
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.btnCheckout').forEach(btn =>
    btn.addEventListener('click', () => checkOut(btn.dataset.id))
  );
}

async function checkOut(id) {
  const jam = new Date().toTimeString().slice(0, 5);
  await fetch(`${API_ABSENSI}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jamKeluar: jam })
  });
  muatAbsensi();
}