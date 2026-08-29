const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const app = express();
app.use(cors());
app.use(express.json());

// routes akan ditambahkan di sini
app.use('/api/karyawan', require('./routes/karyawan')(db));
app.use('/api/absensi', require('./routes/absensi')(db));
app.use('/api/cuti', require('./routes/cuti')(db));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));