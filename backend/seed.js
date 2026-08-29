const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

async function seed() {
  console.log('Mulai isi data contoh...');


  const karyawanRefs = [];
  const karyawanData = [
    { nama: 'Budi Santoso', jabatan: 'Frontend Developer', divisi: 'IT', tanggalMasuk: '2024-01-15', fotoUrl: '' },
    { nama: 'Siti Aminah', jabatan: 'HR Staff', divisi: 'Human Resources', tanggalMasuk: '2023-06-01', fotoUrl: '' },
    { nama: 'Andi Wijaya', jabatan: 'Backend Developer', divisi: 'IT', tanggalMasuk: '2024-03-10', fotoUrl: '' }
  ];

  for (const k of karyawanData) {
    const ref = await db.collection('karyawan').add(k);
    karyawanRefs.push(ref.id);
    console.log('Karyawan ditambahkan:', k.nama, '| id:', ref.id);
  }


  await db.collection('absensi').add({
    idKaryawan: karyawanRefs[0],
    tanggal: '2026-08-28',
    jamMasuk: '08:00',
    jamKeluar: '17:00'
  });
  console.log('Absensi contoh ditambahkan');


  await db.collection('cuti').add({
    idKaryawan: karyawanRefs[1],
    tanggalMulai: '2026-09-01',
    tanggalSelesai: '2026-09-03',
    alasan: 'Acara keluarga',
    status: 'pending'
  });
  console.log('Cuti contoh ditambahkan');

  console.log('Selesai! Cek Firebase Console untuk lihat datanya.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Gagal seed data:', err);
  process.exit(1);
});
