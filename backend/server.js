require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');


let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

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


const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));


app.use('/api/karyawan', require('./routes/karyawan')(db));
app.use('/api/absensi', require('./routes/absensi')(db));
app.use('/api/cuti', require('./routes/cuti')(db));


app.get('/api/health', (req, res) => {
  res.json({ message: 'Server jalan!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
