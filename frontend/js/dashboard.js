import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const API_URL = 'http://localhost:5000/api';

// Proteksi halaman: kalau belum login, tendang ke halaman login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('userEmail').textContent = user.email;
    loadDashboardData();
  }
});

// Tombol logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

// Toggle sidebar di layar mobile
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');

menuBtn?.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
});
overlay?.addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
});

// Ambil dan tampilkan data ringkasan
async function loadDashboardData() {
  try {
    const [karyawanRes, absensiRes, cutiRes] = await Promise.all([
      fetch(`${API_URL}/karyawan`).then(r => r.json()),
      fetch(`${API_URL}/absensi`).then(r => r.json()),
      fetch(`${API_URL}/cuti`).then(r => r.json())
    ]);

    // Total karyawan
    document.getElementById('totalKaryawan').textContent = karyawanRes.length;

    // Hadir hari ini (cocokkan tanggal format YYYY-MM-DD)
    const hariIni = new Date().toISOString().slice(0, 10);
    const hadirHariIni = absensiRes.filter(a => a.tanggal === hariIni).length;
    document.getElementById('hadirHariIni').textContent = hadirHariIni;

    // Cuti dengan status pending
    const cutiPending = cutiRes.filter(c => c.status === 'pending').length;
    document.getElementById('cutiPending').textContent = cutiPending;

    // Tabel karyawan terbaru (ambil 5 terakhir)
    const tabelBody = document.getElementById('tabelKaryawanTerbaru');
    const terbaru = karyawanRes.slice(-5).reverse();

    if (terbaru.length === 0) {
      tabelBody.innerHTML = `<tr><td class="px-5 py-4 text-slate-400" colspan="3">Belum ada data karyawan</td></tr>`;
      return;
    }

    tabelBody.innerHTML = terbaru.map(k => `
      <tr class="border-b border-slate-50 last:border-0">
        <td class="px-5 py-3 text-slate-700">${k.nama ?? '-'}</td>
        <td class="px-5 py-3 text-slate-700">${k.jabatan ?? '-'}</td>
        <td class="px-5 py-3 text-slate-700">${k.divisi ?? '-'}</td>
      </tr>
    `).join('');

  } catch (err) {
    console.error('Gagal memuat data dashboard:', err);
    document.getElementById('tabelKaryawanTerbaru').innerHTML =
      `<tr><td class="px-5 py-4 text-red-500" colspan="3">Gagal memuat data. Pastikan backend sedang berjalan.</td></tr>`;
  }
}
