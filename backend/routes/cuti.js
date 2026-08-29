const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET semua cuti
  router.get('/', async (req, res) => {
    try {
      const snapshot = await db.collection('cuti').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(data);
    } catch (err) {
      console.error('❌ Error GET /api/cuti:', err);
      res.status(500).json({ error: 'Gagal mengambil data cuti', message: err.message });
    }
  });

  // POST tambah cuti
  router.post('/', async (req, res) => {
    try {
      const docRef = await db.collection('cuti').add(req.body);
      res.json({ id: docRef.id });
    } catch (err) {
      console.error('❌ Error POST /api/cuti:', err);
      res.status(500).json({ error: 'Gagal menambah data cuti', message: err.message });
    }
  });

  // PUT edit cuti
  router.put('/:id', async (req, res) => {
    try {
      await db.collection('cuti').doc(req.params.id).update(req.body);
      res.json({ success: true });
    } catch (err) {
      console.error('❌ Error PUT /api/cuti/:id:', err);
      res.status(500).json({ error: 'Gagal mengubah data cuti', message: err.message });
    }
  });

  // DELETE hapus cuti
  router.delete('/:id', async (req, res) => {
    try {
      await db.collection('cuti').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (err) {
      console.error('❌ Error DELETE /api/cuti/:id:', err);
      res.status(500).json({ error: 'Gagal menghapus data cuti', message: err.message });
    }
  });

  return router;
};
