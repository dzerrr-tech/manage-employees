   const express = require('express');

   module.exports = (db) => {
     const router = express.Router();

     // GET semua cuti
     router.get('/', async (req, res) => {
       const snapshot = await db.collection('cuti').get();
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       res.json(data);
     });

     // POST tambah cuti
     router.post('/', async (req, res) => {
       const docRef = await db.collection('cuti').add(req.body);
       res.json({ id: docRef.id });
     });

     // PUT edit cuti
     router.put('/:id', async (req, res) => {
       await db.collection('cuti').doc(req.params.id).update(req.body);
       res.json({ success: true });
     });

     // DELETE hapus cuti
     router.delete('/:id', async (req, res) => {
       await db.collection('cuti').doc(req.params.id).delete();
       res.json({ success: true });
     });

     return router;
   };