const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET semua absensi
  router.get('/', async (req, res) => {
    try {
      const snapshot = await db.collection('absensi').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(data);
    } catch (err) {
      console.error('❌ Error GET /api/absensi:', err);
      res.status(500).json({ error: 'Gagal mengambil data absensi', message: err.message });
    }
  });

  // POST tambah absensi
  router.post('/', async (req, res) => {
    try {
      const docRef = await db.collection('absensi').add(req.body);
      res.json({ id: docRef.id });
    } catch (err) {
      console.error('❌ Error POST /api/absensi:', err);
      res.status(500).json({ error: 'Gagal menambah data absensi', message: err.message });
    }
  });

  // PUT edit absensi
  router.put('/:id', async (req, res) => {
    try {
      await db.collection('absensi').doc(req.params.id).update(req.body);
      res.json({ success: true });
    } catch (err) {
      console.error('❌ Error PUT /api/absensi/:id:', err);
      res.status(500).json({ error: 'Gagal mengubah data absensi', message: err.message });
    }
  });

  // DELETE hapus absensi
  router.delete('/:id', async (req, res) => {
    try {
      await db.collection('absensi').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (err) {
      console.error('❌ Error DELETE /api/absensi/:id:', err);
      res.status(500).json({ error: 'Gagal menghapus data absensi', message: err.message });
    }
  });

  return router;
};
