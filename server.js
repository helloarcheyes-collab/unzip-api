const express = require('express');
const multer = require('multer');
const AdmZip = require('adm-zip');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post('/unzip', upload.single('file'), (req, res) => {
  try {
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();
    const files = zipEntries.map(entry => ({
      name: entry.entryName,
      size: entry.header.size,
      isDirectory: entry.isDirectory,
      content: entry.getData().toString('base64')
    }));
    res.json({ files });
  } catch (err) {
    console.error('Unzip error:', err);
    res.status(500).json({ error: 'Failed to unzip' });
  }
});

app.listen(3000, () => {
  console.log('Unzip API listening on port 3000');
});
