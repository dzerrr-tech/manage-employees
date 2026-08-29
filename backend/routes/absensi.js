   const express = require('express');

   module.exports = (db) => {
     const router = express.Router();

     // GET semua absensi
     router.get('/', async (req, res) => {
       const snapshot = await db.collection('absensi').get();
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       res.json(data);
     });

     // POST tambah absensi
     router.post('/', async (req, res) => {
       const docRef = await db.collection('absensi').add(req.body);
       res.json({ id: docRef.id });
     });

     // PUT edit absensi
     router.put('/:id', async (req, res) => {
       await db.collection('absensi').doc(req.params.id).update(req.body);
       res.json({ success: true });
     });

     // DELETE hapus absensi
     router.delete('/:id', async (req, res) => {
       await db.collection('absensi').doc(req.params.id).delete();
       res.json({ success: true });
     });

     return router;
   };