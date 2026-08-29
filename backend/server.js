const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Kalau ada env variable FIREBASE_SERVICE_ACCOUNT (di server/Railway), pakai itu.
// Kalau tidak ada (di laptop lokal), baca dari file serviceAccountKey.json.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const app = express();

// Middleware order matters: CORS & body parsing harus sebelum routes.
app.use(cors());
app.use(express.json());

// Health check / root endpoint.
app.get('/', (req, res) => {
  res.json({ message: 'Server jalan!', status: 'ok' });
});

// Register semua API routes dengan error handling yang eksplisit,
// supaya kalau ada route yang gagal ter-register, kita lihat errornya
// di log, bukan cuma dapat 404 yang silent.
const routesToRegister = [
  { path: '/api/karyawan', module: './routes/karyawan' },
  { path: '/api/absensi', module: './routes/absensi' },
  { path: '/api/cuti', module: './routes/cuti' }
];

const registeredRoutes = [];

routesToRegister.forEach(({ path, module }) => {
  try {
    const routerFactory = require(module);

    if (typeof routerFactory !== 'function') {
      throw new Error(
        `Module "${module}" tidak export function. Expected: module.exports = (db) => { ... return router; }`
      );
    }

    const router = routerFactory(db);

    if (!router) {
      throw new Error(`Router dari "${module}" tidak ter-return dengan benar (undefined/null).`);
    }

    app.use(path, router);
    registeredRoutes.push(path);
    console.log(`✅ Route berhasil ter-register: ${path}`);
  } catch (err) {
    console.error(`❌ Gagal register route "${path}" dari module "${module}":`, err);
  }
});

// Validasi bahwa semua routes berhasil ter-register sebelum listen.
if (registeredRoutes.length !== routesToRegister.length) {
  console.error(
    `⚠️  Hanya ${registeredRoutes.length}/${routesToRegister.length} routes yang berhasil ter-register.`
  );
} else {
  console.log(`✅ Semua ${registeredRoutes.length} routes berhasil ter-register.`);
}

// 404 handler untuk route yang tidak ditemukan.
app.use((req, res) => {
  res.status(404).json({ error: 'Route tidak ditemukan', path: req.originalUrl });
});

// Global error handler middleware — harus paling akhir.
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
