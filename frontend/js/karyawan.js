import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { API_BASE_URL } from './api-config.js';

const API_URL = `${API_BASE_URL}/karyawan`;
let semuaKaryawan = [];

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('userEmail').textContent = user.email;
    muatKaryawan();
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

async function muatKaryawan() {
  try {
    const res = await fetch(API_URL);
    semuaKaryawan = await res.json();
    renderTabel(semuaKaryawan);
  } catch (err) {
    document.getElementById('tabelKaryawan').innerHTML =
      `<tr><td class="px-5 py-4 text-red-500" colspan="5">Gagal memuat data. Pastikan backend berjalan.</td></tr>`;
  }
}

function renderTabel(data) {
  const tbody = document.getElementById('tabelKaryawan');
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td class="px-5 py-4 text-slate-400" colspan="5">Belum ada data karyawan.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(k => `
    <tr class="border-b border-slate-50 last:border-0">
      <td class="px-5 py-3 text-slate-700">${k.nama ?? '-'}</td>
      <td class="px-5 py-3 text-slate-700">${k.jabatan ?? '-'}</td>
      <td class="px-5 py-3 text-slate-700">${k.divisi ?? '-'}</td>
      <td class="px-5 py-3 text-slate-700">${k.tanggalMasuk ?? '-'}</td>
      <td class="px-5 py-3 text-right space-x-2">
        <button data-id="${k.id}" class="btnEdit text-blue-600 hover:underline text-sm">Edit</button>
        <button data-id="${k.id}" class="btnHapus text-red-500 hover:underline text-sm">Hapus</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.btnEdit').forEach(btn =>
    btn.addEventListener('click', () => bukaModalEdit(btn.dataset.id))
  );
  document.querySelectorAll('.btnHapus').forEach(btn =>
    btn.addEventListener('click', () => hapusKaryawan(btn.dataset.id))
  );
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const kata = e.target.value.toLowerCase();
  const hasil = semuaKaryawan.filter(k => k.nama?.toLowerCase().includes(kata));
  renderTabel(hasil);
});

const modal = document.getElementById('modal');
const form = document.getElementById('karyawanForm');
const modalTitle = document.getElementById('modalTitle');

document.getElementById('btnTambah').addEventListener('click', () => {
  form.reset();
  document.getElementById('karyawanId').value = '';
  modalTitle.textContent = 'Tambah Karyawan';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
});

document.getElementById('btnBatal').addEventListener('click', tutupModal);

function tutupModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function bukaModalEdit(id) {
  const k = semuaKaryawan.find(x => x.id === id);
  if (!k) return;
  document.getElementById('karyawanId').value = k.id;
  document.getElementById('nama').value = k.nama ?? '';
  document.getElementById('jabatan').value = k.jabatan ?? '';
  document.getElementById('divisi').value = k.divisi ?? '';
  document.getElementById('tanggalMasuk').value = k.tanggalMasuk ?? '';
  modalTitle.textContent = 'Edit Karyawan';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('karyawanId').value;
  const data = {
    nama: document.getElementById('nama').value,
    jabatan: document.getElementById('jabatan').value,
    divisi: document.getElementById('divisi').value,
    tanggalMasuk: document.getElementById('tanggalMasuk').value
  };

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    tutupModal();
    muatKaryawan();
  } catch (err) {
    alert('Gagal menyimpan data.');
  }
});

async function hapusKaryawan(id) {
  if (!confirm('Yakin ingin menghapus karyawan ini?')) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    muatKaryawan();
  } catch (err) {
    alert('Gagal menghapus data.');
  }
}