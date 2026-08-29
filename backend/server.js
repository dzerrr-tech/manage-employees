const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Inisialisasi Firebase Admin SDK
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  // Perbaiki formatting newline pada private key jika dari Environment Variables Railway
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} else {
  serviceAccount = require('./serviceAccountKey.json');
}

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/karyawan', require('./routes/karyawan')(db));
app.use('/api/absensi', require('./routes/absensi')(db));
app.use('/api/cuti', require('./routes/cuti')(db));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));

app.get('/', (req, res) => {
  res.json({ message: 'Server jalan!' });
});

app.use('/api/karyawan', require('./routes/karyawan')(db));
// ... routes lain