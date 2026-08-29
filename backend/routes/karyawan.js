const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET semua karyawan
  router.get('/', async (req, res) => {
    try {
      const snapshot = await db.collection('karyawan').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(data);
    } catch (err) {
      console.error('❌ Error GET /api/karyawan:', err);
      res.status(500).json({ error: 'Gagal mengambil data karyawan', message: err.message });
    }
  });

  // POST tambah karyawan
  router.post('/', async (req, res) => {
    try {
      const docRef = await db.collection('karyawan').add(req.body);
      res.json({ id: docRef.id });
    } catch (err) {
      console.error('❌ Error POST /api/karyawan:', err);
      res.status(500).json({ error: 'Gagal menambah data karyawan', message: err.message });
    }
  });

  // PUT edit karyawan
  router.put('/:id', async (req, res) => {
    try {
      await db.collection('karyawan').doc(req.params.id).update(req.body);
      res.json({ success: true });
    } catch (err) {
      console.error('❌ Error PUT /api/karyawan/:id:', err);
      res.status(500).json({ error: 'Gagal mengubah data karyawan', message: err.message });
    }
  });

  // DELETE hapus karyawan
  router.delete('/:id', async (req, res) => {
    try {
      await db.collection('karyawan').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (err) {
      console.error('❌ Error DELETE /api/karyawan/:id:', err);
      res.status(500).json({ error: 'Gagal menghapus data karyawan', message: err.message });
    }
  });

  return router;
};
